import type { VercelRequest, VercelResponse } from '@vercel/node';

const MONDAY_API_URL = 'https://api.monday.com/v2';
const BOARD_ID = 5098314640;

const COLUMN_IDS = {
  stage: 'deal_stage',
  consultationDate: 'date_mm4j1dhr',
  notes: 'text_mm47r0fc',
};

// Stage set by its label index (3 is Discovery / Feasibility), never by name, so no stage
// label can be created.
const BOOKED_STAGE_INDEX = 3;

// Only Calendly's own API is ever fetched; any other eventUri is ignored.
const CALENDLY_EVENT_PREFIX = 'https://api.calendly.com/scheduled_events/';

const MEETING_LABELS: Record<string, string> = {
  virtual: 'Virtual Meeting',
  studio: 'Studio Visit',
};

type FoundItem = { id: string; notes: string };

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

// One GraphQL call. Throws with Monday's error message or the HTTP status, never with the
// lead's details, so callers can log it safely.
async function mondayRequest<T>(apiToken: string, query: string, variables: Record<string, unknown>): Promise<T> {
  const response = await fetch(MONDAY_API_URL, {
    method: 'POST',
    headers: {
      // Monday's v2 API expects the raw token in this header, with no "Bearer " prefix.
      Authorization: apiToken,
      'Content-Type': 'application/json',
      'API-Version': '2024-01',
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = (await response.json().catch(() => null)) as { data?: T; errors?: { message?: string }[] } | null;
  if (!response.ok || !body?.data || body.errors?.length) {
    throw new Error(body?.errors?.[0]?.message ?? `Monday API returned status ${response.status}`);
  }
  return body.data;
}

const FIND_BY_ID = `
  query FindById($itemId: ID!) {
    items(ids: [$itemId]) {
      id
      board {
        id
      }
      column_values(ids: ["text_mm47r0fc"]) {
        text
      }
    }
  }
`;

const FIND_BY_EMAIL = `
  query FindByEmail($boardId: ID!, $email: String!) {
    items_page_by_column_values(
      board_id: $boardId,
      limit: 1,
      columns: [{ column_id: "email_mm51mezw", column_values: [$email] }]
    ) {
      items {
        id
        column_values(ids: ["text_mm47r0fc"]) {
          text
        }
      }
    }
  }
`;

const UPDATE_ITEM = `
  mutation UpdateItem($boardId: ID!, $itemId: ID!, $columnValues: JSON!) {
    change_multiple_column_values(
      board_id: $boardId,
      item_id: $itemId,
      column_values: $columnValues,
      create_labels_if_missing: true
    ) {
      id
    }
  }
`;

// The item id from the form is used first, but only if it belongs to the All Deals board;
// otherwise the lead is looked up by email on that board.
async function findItem(apiToken: string, itemId: string, email: string): Promise<FoundItem | null> {
  if (/^\d+$/.test(itemId)) {
    const data = await mondayRequest<{
      items: { id: string; board: { id: string } | null; column_values: { text: string | null }[] }[];
    }>(apiToken, FIND_BY_ID, { itemId });
    const item = data.items[0];
    if (item && String(item.board?.id) === String(BOARD_ID)) {
      return { id: String(item.id), notes: item.column_values[0]?.text ?? '' };
    }
  }

  if (email) {
    const data = await mondayRequest<{
      items_page_by_column_values: { items: { id: string; column_values: { text: string | null }[] }[] };
    }>(apiToken, FIND_BY_EMAIL, { boardId: BOARD_ID, email });
    const item = data.items_page_by_column_values.items[0];
    if (item) return { id: String(item.id), notes: item.column_values[0]?.text ?? '' };
  }

  return null;
}

// Start time of the booked event in UTC, or null if it cannot be read.
async function consultationStart(eventUri: string): Promise<{ date: string; time: string } | null> {
  const calendlyToken = process.env.CALENDLY_API_TOKEN;
  if (!calendlyToken || !eventUri.startsWith(CALENDLY_EVENT_PREFIX)) return null;

  try {
    const response = await fetch(eventUri, { headers: { Authorization: `Bearer ${calendlyToken}` } });
    if (!response.ok) {
      console.error(`[monday-booking] Calendly event request returned status ${response.status}`);
      return null;
    }
    const body = (await response.json().catch(() => null)) as { resource?: { start_time?: string } } | null;
    const start = body?.resource?.start_time ? new Date(body.resource.start_time) : null;
    if (!start || Number.isNaN(start.getTime())) {
      console.error('[monday-booking] Calendly event had no readable start time');
      return null;
    }
    const iso = start.toISOString();
    return { date: iso.slice(0, 10), time: iso.slice(11, 19) };
  } catch (err) {
    console.error('[monday-booking] Calendly event request failed:', err instanceof Error ? err.message : 'Unknown error');
    return null;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const apiToken = process.env.MONDAY_API_TOKEN;
  if (!apiToken) {
    console.error('[monday-booking] MONDAY_API_TOKEN is not configured');
    res.status(500).json({ ok: false, error: 'Monday API token is not configured' });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const itemId = asString(body.itemId);
  const email = asString(body.email);
  const meetingType = asString(body.meetingType);
  const eventUri = asString(body.eventUri);

  try {
    const item = await findItem(apiToken, itemId, email);
    if (!item) {
      res.status(404).json({ ok: false });
      return;
    }

    const start = await consultationStart(eventUri);

    const meetingLabel = MEETING_LABELS[meetingType];
    const booked = ['Consultation booked:', meetingLabel, start ? `${start.date} ${start.time.slice(0, 5)} UTC` : '']
      .filter(Boolean)
      .join(' ');
    const notes = item.notes ? `${item.notes} | ${booked}` : booked;

    const columnValues: Record<string, unknown> = {
      [COLUMN_IDS.stage]: { index: BOOKED_STAGE_INDEX },
      [COLUMN_IDS.notes]: notes,
    };
    if (start) columnValues[COLUMN_IDS.consultationDate] = start;

    await mondayRequest(apiToken, UPDATE_ITEM, {
      boardId: BOARD_ID,
      itemId: item.id,
      columnValues: JSON.stringify(columnValues),
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[monday-booking] update failed:', err instanceof Error ? err.message : 'Unknown error');
    res.status(502).json({ ok: false });
  }
}

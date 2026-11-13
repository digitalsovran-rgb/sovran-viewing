import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';
// The .js extension is needed for ESM imports at runtime on Vercel; it resolves to meta-capi.ts.
import { sendMetaLead } from './_lib/meta-capi.js';

const MONDAY_API_URL = 'https://api.monday.com/v2';
const BOARD_ID = 5098314640;

const COLUMN_IDS = {
  firstName: 'text_mm5q24an',
  email: 'email_mm51mezw',
  phone: 'phone_mm51yhe7',
  projectType: 'dropdown_mm47dr86',
  budget: 'numeric_mm47arbw',
  leadSource: 'dropdown_mm47gc2c',
  leadOrigin: 'dropdown_mm894w44',
  stage: 'deal_stage',
  projectStart: 'text_mm8kh8kd',
  notes: 'text_mm47r0fc',
};

// Every lead from this page carries the same origin and starts at the same stage. The stage
// is set by its label index (4 is New Enquiry), never by name, so no stage label can be created.
const LEAD_ORIGIN = 'LP Viewing';
const NEW_STAGE_INDEX = 4;
const PAGE_HOST = 'design.sovranstudio.co.uk';

// Form option to Monday Project Type label.
const PROJECT_TYPE_LABELS: Record<string, string> = {
  'New Build': 'New Build',
  'Home Extension': 'Extension',
  'Home Renovation': 'Renovation',
  Basements: 'Basement',
  'Multiple Projects': 'Multiple Projects',
};

const META_SOURCES = ['facebook', 'fb', 'instagram', 'ig', 'meta'];

const RETRY_ATTEMPTS = 2;
const RETRY_DELAY_MS = 500;

// Daily form submission counter read by api/stats.ts for the hero activity line.
const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? '',
  token: process.env.KV_REST_API_TOKEN ?? '',
});

// UK-local calendar date, so the counter rolls over at UK midnight rather than UTC midnight.
function getUKDateKey(): string {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
};

type MondayResult = { ok: true; id: string } | { ok: false; error: string };

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function readAttribution(value: unknown): Attribution {
  if (!value || typeof value !== 'object') return {};
  const source = value as Record<string, unknown>;
  const keys: (keyof Attribution)[] = [
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'fbclid',
    'gclid',
  ];
  const result: Attribution = {};
  for (const key of keys) {
    const text = asString(source[key]);
    if (text) result[key] = text;
  }
  return result;
}

function extractFirstName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  return parts.length === 0 ? '' : parts[0];
}

// Turns the budget value sent by the form ("£100K", "£400K" or "£1000K") into a number: strips
// £ and commas, takes the first run of digits, and multiplies by 1000 when it is followed by K.
function extractBudgetNumber(budgetText: string): number {
  const stripped = budgetText.replace(/[£,]/g, '');
  const match = stripped.match(/\d+/);
  if (!match || match.index === undefined) return 0;
  const numEnd = match.index + match[0].length;
  const followedByK = stripped[numEnd]?.toUpperCase() === 'K';
  const num = parseInt(match[0], 10);
  return followedByK ? num * 1000 : num;
}

function leadChannel(attribution: Attribution): string {
  const source = (attribution.utm_source ?? '').toLowerCase();
  if (attribution.fbclid || META_SOURCES.includes(source)) return 'Meta Ad';
  if (attribution.gclid || source === 'google') return 'Google Ad';
  return 'Website';
}

function buildNotes(levelOfWork: string, attribution: Attribution): string {
  let notes = `Level: ${levelOfWork} | Page: ${PAGE_HOST}`;
  const utmKeys: (keyof Attribution)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  for (const key of utmKeys) {
    if (attribution[key]) notes += ` | ${key}: ${attribution[key]}`;
  }
  // Only whether a click id was present, never the id itself.
  if (attribution.fbclid) notes += ' | fbclid: yes';
  if (attribution.gclid) notes += ' | gclid: yes';
  return notes;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// One GraphQL call. Throws with Monday's error message (which never contains the lead's details
// we send) or the HTTP status, so callers can log it safely.
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

const CREATE_ITEM = `
  mutation CreateItem($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
    create_item(
      board_id: $boardId,
      item_name: $itemName,
      column_values: $columnValues,
      create_labels_if_missing: true
    ) {
      id
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

type FindResult = {
  items_page_by_column_values: { items: { id: string; column_values: { text: string | null }[] }[] };
};

// Looks the lead up by email first, so a repeat enquiry (or a retry after a lost response)
// updates the existing item instead of creating a duplicate.
async function upsertLead(
  apiToken: string,
  email: string,
  itemName: string,
  columnValues: Record<string, unknown>,
  notes: string
): Promise<string> {
  if (email) {
    const found = await mondayRequest<FindResult>(apiToken, FIND_BY_EMAIL, { boardId: BOARD_ID, email });
    const existing = found.items_page_by_column_values.items[0];
    if (existing) {
      const oldNotes = existing.column_values[0]?.text ?? '';
      const today = new Date().toISOString().slice(0, 10);
      const repeatNotes = `Repeat enquiry ${today} | ${notes}${oldNotes ? ` | ${oldNotes}` : ''}`;
      const updated = await mondayRequest<{ change_multiple_column_values: { id: string } }>(apiToken, UPDATE_ITEM, {
        boardId: BOARD_ID,
        itemId: existing.id,
        columnValues: JSON.stringify({ ...columnValues, name: itemName, [COLUMN_IDS.notes]: repeatNotes }),
      });
      return String(updated.change_multiple_column_values.id);
    }
  }

  const created = await mondayRequest<{ create_item: { id: string } }>(apiToken, CREATE_ITEM, {
    boardId: BOARD_ID,
    itemName,
    columnValues: JSON.stringify(columnValues),
  });
  return String(created.create_item.id);
}

async function upsertWithRetry(
  apiToken: string,
  email: string,
  itemName: string,
  columnValues: Record<string, unknown>,
  notes: string
): Promise<MondayResult> {
  let lastError = 'Unknown error';
  for (let attempt = 1; attempt <= RETRY_ATTEMPTS; attempt++) {
    try {
      const id = await upsertLead(apiToken, email, itemName, columnValues, notes);
      return { ok: true, id };
    } catch (err) {
      lastError = err instanceof Error ? err.message : 'Unknown fetch error';
      console.error(`[monday-submit] attempt ${attempt}/${RETRY_ATTEMPTS} failed:`, lastError);
    }
    if (attempt < RETRY_ATTEMPTS) await sleep(RETRY_DELAY_MS);
  }
  return { ok: false, error: lastError };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ ok: false, error: 'Method not allowed' });
    return;
  }

  const apiToken = process.env.MONDAY_API_TOKEN;
  if (!apiToken) {
    console.error('[monday-submit] MONDAY_API_TOKEN is not configured');
    res.status(500).json({ ok: false, error: 'Monday API token is not configured' });
    return;
  }

  const body = (req.body ?? {}) as Record<string, unknown>;
  const fullName = asString(body.name);
  const email = asString(body.email);
  const phone = asString(body.phone);
  const projectType = asString(body.projectType);
  const levelOfWork = asString(body.level_of_work);
  const timeline = asString(body.timeline);
  const attribution = readAttribution(body.attribution);

  const notes = buildNotes(levelOfWork, attribution);

  const columnValues: Record<string, unknown> = {
    [COLUMN_IDS.firstName]: extractFirstName(fullName),
    [COLUMN_IDS.email]: { email, text: email },
    // Same format as before: the digits the form sends, with the GB country code.
    [COLUMN_IDS.phone]: { phone: phone.replace(/[^\d]/g, ''), countryShortName: 'GB' },
    [COLUMN_IDS.projectType]: { labels: [PROJECT_TYPE_LABELS[projectType] ?? projectType] },
    [COLUMN_IDS.budget]: extractBudgetNumber(asString(body.budget)),
    [COLUMN_IDS.leadSource]: { labels: [leadChannel(attribution)] },
    [COLUMN_IDS.leadOrigin]: { labels: [LEAD_ORIGIN] },
    [COLUMN_IDS.stage]: { index: NEW_STAGE_INDEX },
    [COLUMN_IDS.projectStart]: timeline,
    [COLUMN_IDS.notes]: notes,
  };

  const result = await upsertWithRetry(apiToken, email, fullName, columnValues, notes);

  // Counts the request for the hero activity line. A Redis failure never affects the response.
  if (result.ok) {
    try {
      await redis.incr(`stats:formSubmissions:${getUKDateKey()}`);
    } catch (err) {
      console.error('Redis increment failed for form submission counter:', err);
    }
  }

  // Server copy of the Meta Lead: sent after every successful Monday create or update, and
  // skipped without a log when no Conversions API token is configured. It never changes the
  // response to the form.
  const meta = body.meta && typeof body.meta === 'object' ? (body.meta as Record<string, unknown>) : {};
  if (result.ok && process.env.META_CAPI_ACCESS_TOKEN) {
    try {
      await sendMetaLead({
        eventId: asString(meta.eventId),
        email,
        phone,
        firstName: extractFirstName(fullName),
        fbp: asString(meta.fbp),
        fbc: asString(meta.fbc),
        clientIp: clientIpFrom(req),
        userAgent: headerValue(req.headers['user-agent']),
        eventSourceUrl: asString(meta.eventSourceUrl),
      });
    } catch {
      // sendMetaLead never throws; this only guards the response.
    }
  }

  res.status(result.ok ? 200 : 502).json(result);
}

function headerValue(value: string | string[] | undefined): string {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? '';
}

// The visitor's IP: the first address in x-forwarded-for, otherwise x-real-ip.
function clientIpFrom(req: VercelRequest): string {
  const forwarded = headerValue(req.headers['x-forwarded-for']).split(',')[0]?.trim();
  return forwarded || headerValue(req.headers['x-real-ip']);
}

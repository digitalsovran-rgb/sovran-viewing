import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const MONDAY_BOARD_ID = 5098314640;

const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? '',
  token: process.env.KV_REST_API_TOKEN ?? '',
});

const budgetValueMap: Record<string, number> = {
  'Under £150K': 100000,
  '£150K – £500K': 325000,
  '£500K – £1M': 750000,
  '£1M+': 1250000,
};

function getBudgetValue(budget: string | undefined): number {
  return budgetValueMap[budget ?? ''] ?? 0;
}

function extractFirstName(fullName: string | undefined): string {
  const trimmed = (fullName ?? '').trim();
  if (!trimmed) return '';
  return trimmed.split(/\s+/)[0];
}

function buildNotes(budget: string | undefined, timing: string | undefined): string {
  return `Investment: ${budget || 'Not specified'}\nIdeal Start: ${timing || 'Not specified'}`;
}

// UK-local calendar date, so the counter rolls over at UK midnight rather than UTC midnight.
function getUKDateKey(): string {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const MAX_ATTEMPTS = 3; // 1 initial attempt + 2 retries
const RETRY_DELAY_MS = 500;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type MondayAttemptResult = { ok: true; id: string } | { ok: false; error: string };

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

async function attemptMondayRequest(
  apiKey: string,
  itemName: string,
  columnValues: Record<string, unknown>
): Promise<MondayAttemptResult> {
  const query = `mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
    create_item (board_id: $boardId, item_name: $itemName, column_values: $columnValues, create_labels_if_missing: true) {
      id
    }
  }`;

  try {
    const mondayResponse = await fetch('https://api.monday.com/v2', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: {
          boardId: MONDAY_BOARD_ID,
          itemName,
          columnValues: JSON.stringify(columnValues),
        },
      }),
    });

    const data = await mondayResponse.json().catch(() => null);
    if (!mondayResponse.ok || data?.errors) {
      const message = data?.errors
        ? `Monday GraphQL error: ${toErrorMessage(data.errors)}`
        : `Monday API returned HTTP ${mondayResponse.status}`;
      return { ok: false, error: message };
    }
    const id = data?.data?.create_item?.id;
    if (!id) {
      return { ok: false, error: 'Monday response did not include a created item id' };
    }
    return { ok: true, id };
  } catch (err) {
    return { ok: false, error: `Network error calling Monday API: ${toErrorMessage(err)}` };
  }
}

async function createMondayItem(
  body: Record<string, unknown>
): Promise<{ success: boolean; itemId?: string }> {
  const apiKey = process.env.MONDAY_API_TOKEN;
  if (!apiKey) {
    console.error('Monday API key is not configured (MONDAY_API_TOKEN is undefined)');
    return { success: false };
  }

  const { firstName, email, phone, extensionType, budget, timing } = body;

  const columnValues = {
    email_mm51mezw: { email: email ?? '', text: email ?? '' },
    phone_mm51yhe7: { phone: phone ?? '', countryShortName: 'GB' },
    dropdown_mm47dr86: { labels: extensionType ? [extensionType] : [] },
    numeric_mm47arbw: String(getBudgetValue(budget as string | undefined)),
    text_mm47r0fc: buildNotes(budget as string | undefined, timing as string | undefined),
    dropdown_mm47gc2c: { labels: ['Website'] },
    deal_stage: { label: 'New Enquiry' },
    text_mm5q24an: extractFirstName(firstName as string | undefined),
  };
  const itemName = (firstName as string) || 'Unnamed Lead';

  let lastError: string | null = null;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const result = await attemptMondayRequest(apiKey, itemName, columnValues);
    if (result.ok) {
      console.log(
        `[monday-submit] item created on attempt ${attempt}/${MAX_ATTEMPTS} — item ID: ${result.id}`
      );
      return { success: true, itemId: result.id };
    }
    lastError = result.error;
    console.error(`[monday-submit] attempt ${attempt}/${MAX_ATTEMPTS} failed:`, result.error);
    if (attempt < MAX_ATTEMPTS) {
      await sleep(RETRY_DELAY_MS);
    }
  }

  console.error('[monday-submit] all attempts exhausted, item was not created. Last error:', lastError);
  return { success: false };
}

async function incrementFormSubmissionCounter(): Promise<void> {
  try {
    await redis.incr(`stats:formSubmissions:${getUKDateKey()}`);
  } catch (err) {
    console.error('Redis increment failed for form submission counter:', err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('[monday-submit] invoked');

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { success, itemId } = await createMondayItem(req.body ?? {});
  console.log(
    success
      ? `[monday-submit] outcome: success — item ID ${itemId}`
      : '[monday-submit] outcome: failure — see attempt logs above for error details'
  );

  // Tracks completed form submissions, not CRM delivery — increments regardless of Monday outcome.
  await incrementFormSubmissionCounter();

  res.status(success ? 200 : 502).json({ success });
}

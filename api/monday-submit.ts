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

function buildNotes(
  services: string[] | undefined,
  timing: string | undefined,
  postcode: string | undefined
): string {
  const serviceList = Array.isArray(services) && services.length > 0 ? services.join(', ') : 'None selected';
  return `Services: ${serviceList}\nPreferred Timing: ${timing || 'Not specified'}\nPostcode: ${postcode || 'Not provided'}`;
}

// UK-local calendar date, so the counter rolls over at UK midnight rather than UTC midnight.
function getUKDateKey(): string {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

async function createMondayItem(body: Record<string, unknown>): Promise<boolean> {
  const apiKey = process.env.MONDAY_API_TOKEN;
  if (!apiKey) {
    console.error('Monday API key is not configured (MONDAY_API_TOKEN is undefined)');
    return false;
  }

  const { firstName, email, phone, extensionType, services, budget, timing, postcode } = body;

  const columnValues = {
    email_mm51mezw: { email: email ?? '', text: email ?? '' },
    phone_mm51yhe7: { phone: phone ?? '', countryShortName: 'GB' },
    dropdown_mm47dr86: { labels: extensionType ? [extensionType] : [] },
    numeric_mm47arbw: String(getBudgetValue(budget as string | undefined)),
    text_mm47r0fc: buildNotes(services as string[] | undefined, timing as string | undefined, postcode as string | undefined),
    dropdown_mm47gc2c: { labels: ['Website'] },
    deal_stage: { label: 'New Enquiry' },
  };

  const query = `mutation ($boardId: ID!, $itemName: String!, $columnValues: JSON!) {
    create_item (board_id: $boardId, item_name: $itemName, column_values: $columnValues) {
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
          itemName: (firstName as string) || 'Unnamed Lead',
          columnValues: JSON.stringify(columnValues),
        },
      }),
    });

    const data = await mondayResponse.json().catch(() => null);
    if (!mondayResponse.ok || data?.errors) {
      console.error('Monday item creation failed:', data?.errors ?? mondayResponse.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Monday item creation request failed:', err);
    return false;
  }
}

async function incrementFormSubmissionCounter(): Promise<void> {
  try {
    await redis.incr(`stats:formSubmissions:${getUKDateKey()}`);
  } catch (err) {
    console.error('Redis increment failed for form submission counter:', err);
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const success = await createMondayItem(req.body ?? {});

  // Tracks completed form submissions, not CRM delivery — increments regardless of Monday outcome.
  await incrementFormSubmissionCounter();

  res.status(success ? 200 : 502).json({ success });
}

import { createHash } from 'node:crypto';

// Server copy of the browser Lead, sent to the Meta Conversions API. It shares its event_id with
// the browser event (form_complete in GTM) so Meta counts the lead once. The leading underscore
// keeps this folder from being deployed as an API route.
const PIXEL_ID = '778264765117000';
const GRAPH_URL = `https://graph.facebook.com/v21.0/${PIXEL_ID}/events`;
const TIMEOUT_MS = 5000;

export type MetaLeadInput = {
  eventId: string;
  email: string;
  phone: string;
  firstName: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
};

function sha256(value: string): string {
  return createHash('sha256').update(value.trim().toLowerCase()).digest('hex');
}

// Digits only, with the 44 country code and no leading 0: "07123 456789" becomes "447123456789".
function normalisePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  if (digits.startsWith('44')) return digits;
  return `44${digits.replace(/^0+/, '')}`;
}

// Never throws: a missing token, a timeout or an error from Meta is logged (without personal
// data) and the lead carries on as normal.
export async function sendMetaLead(input: MetaLeadInput): Promise<void> {
  const token = process.env.META_CAPI_ACCESS_TOKEN;
  if (!token) {
    console.error('META_CAPI_ACCESS_TOKEN missing');
    return;
  }

  const email = input.email.trim();
  const phone = normalisePhone(input.phone);
  const firstName = input.firstName.trim();

  // Only fields with a value are sent.
  const userData: Record<string, unknown> = {};
  if (email) userData.em = [sha256(email)];
  if (phone) userData.ph = [sha256(phone)];
  if (firstName) userData.fn = [sha256(firstName)];
  if (input.fbp) userData.fbp = input.fbp;
  if (input.fbc) userData.fbc = input.fbc;
  if (input.clientIp) userData.client_ip_address = input.clientIp;
  if (input.userAgent) userData.client_user_agent = input.userAgent;

  const event: Record<string, unknown> = {
    event_name: 'Lead',
    event_time: Math.floor(Date.now() / 1000),
    event_id: input.eventId,
    action_source: 'website',
    user_data: userData,
  };
  if (input.eventSourceUrl) event.event_source_url = input.eventSourceUrl;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [event] }),
      signal: controller.signal,
    });
    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: { code?: number; type?: string } } | null;
      console.error(
        `[meta-capi] Lead not accepted: status ${response.status}, code ${body?.error?.code ?? 'n/a'}, type ${body?.error?.type ?? 'n/a'}`
      );
    }
  } catch (err) {
    console.error('[meta-capi] Lead request failed:', err instanceof Error ? err.name : 'Unknown error');
  } finally {
    clearTimeout(timeoutId);
  }
}

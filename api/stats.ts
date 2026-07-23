import type { VercelRequest, VercelResponse } from '@vercel/node';

const GHL_LOCATION_ID = 'VNX7VxNMqlGtrJbs2RGG';
const GHL_TAG = 'Site Visit Landing Page';
const PAGE_PATH = '/';

// Cached across warm invocations of the same serverless instance — avoids requesting a
// fresh GA4 access token on every request when the previous one is still valid.
let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getGA4AccessToken(): Promise<string | null> {
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now()) {
    return cachedAccessToken.token;
  }

  const clientId = process.env.GA4_CLIENT_ID;
  const clientSecret = process.env.GA4_CLIENT_SECRET;
  const refreshToken = process.env.GA4_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!res.ok) return null;

  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) return null;

  cachedAccessToken = {
    token: data.access_token,
    // Refresh a minute early so we never serve a token that expires mid-request.
    expiresAt: Date.now() + ((data.expires_in ?? 3600) - 60) * 1000,
  };
  return cachedAccessToken.token;
}

async function getPageViewsToday(): Promise<number> {
  try {
    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!propertyId) return 0;

    const accessToken = await getGA4AccessToken();
    if (!accessToken) return 0;

    const res = await fetch(
      `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRanges: [{ startDate: 'today', endDate: 'today' }],
          dimensions: [{ name: 'pagePath' }],
          metrics: [{ name: 'screenPageViews' }],
          dimensionFilter: {
            filter: {
              fieldName: 'pagePath',
              stringFilter: { matchType: 'EXACT', value: PAGE_PATH },
            },
          },
        }),
      }
    );
    if (!res.ok) return 0;

    const data = (await res.json()) as {
      rows?: { metricValues?: { value?: string }[] }[];
    };
    const value = data.rows?.[0]?.metricValues?.[0]?.value;
    return value ? parseInt(value, 10) || 0 : 0;
  } catch (err) {
    console.error('GA4 pageViewsToday fetch failed:', err);
    return 0;
  }
}

async function getBookingsToday(): Promise<number> {
  try {
    const apiKey = process.env.GHL_API_KEY;
    if (!apiKey) return 0;

    const now = new Date();
    const startOfDay = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

    const res = await fetch('https://services.leadconnectorhq.com/contacts/search', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        pageLimit: 1,
        filters: [
          { field: 'tags', operator: 'contains', value: GHL_TAG },
          { field: 'dateAdded', operator: 'range', value: { gte: startOfDay, lte: endOfDay } },
        ],
      }),
    });
    if (!res.ok) return 0;

    const data = (await res.json()) as { total?: number; contacts?: unknown[] };
    if (typeof data.total === 'number') return data.total;
    if (Array.isArray(data.contacts)) return data.contacts.length;
    return 0;
  } catch (err) {
    console.error('GHL bookingsToday fetch failed:', err);
    return 0;
  }
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 's-maxage=120');

  const [pageViewsToday, bookingsToday] = await Promise.all([
    getPageViewsToday(),
    getBookingsToday(),
  ]);

  res.status(200).json({ pageViewsToday, bookingsToday });
}

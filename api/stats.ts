import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Redis } from '@upstash/redis';

const PAGE_PATH = '/';

// UK-local calendar date, matching the key format written by api/monday-submit.ts.
function getUKDateKey(): string {
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Europe/London' }));
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? '',
  token: process.env.KV_REST_API_TOKEN ?? '',
});

// Reads the last known-good value for a stat, defaulting to 0 if nothing has ever been stored.
async function getStoredValue(key: string): Promise<number> {
  try {
    const value = await redis.get<number>(key);
    return typeof value === 'number' ? value : 0;
  } catch (err) {
    console.error(`Redis read failed for ${key}:`, err);
    return 0;
  }
}

// Persists a fresh, real (> 0) value alongside a timestamp of when it was recorded.
async function storeValue(key: string, value: number): Promise<void> {
  try {
    await Promise.all([redis.set(key, value), redis.set(`${key}:updatedAt`, Date.now())]);
  } catch (err) {
    console.error(`Redis write failed for ${key}:`, err);
  }
}

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
    const value = await redis.get<number>(`stats:formSubmissions:${getUKDateKey()}`);
    return typeof value === 'number' ? value : 0;
  } catch (err) {
    console.error('Redis formSubmissions read failed:', err);
    return 0;
  }
}

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 's-maxage=120');

  const [freshPageViews, freshBookings] = await Promise.all([
    getPageViewsToday(),
    getBookingsToday(),
  ]);

  await Promise.all([
    freshPageViews > 0 ? storeValue('stats:pageViewsToday', freshPageViews) : Promise.resolve(),
    freshBookings > 0 ? storeValue('stats:bookingsToday', freshBookings) : Promise.resolve(),
  ]);

  const [pageViewsToday, bookingsToday] = await Promise.all([
    freshPageViews > 0 ? freshPageViews : getStoredValue('stats:pageViewsToday'),
    freshBookings > 0 ? freshBookings : getStoredValue('stats:bookingsToday'),
  ]);

  res.status(200).json({ pageViewsToday, bookingsToday });
}

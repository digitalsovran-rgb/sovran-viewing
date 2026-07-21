import type { VercelRequest, VercelResponse } from '@vercel/node';

const GHL_LOCATION_ID = 'VNX7VxNMqlGtrJbs2RGG';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) {
    console.error('GHL API key is not configured (GHL_API_KEY is undefined)');
    res.status(500).json({ error: 'GHL API key is not configured' });
    return;
  }

  const { firstName, email, phone, extensionType, postcode } = req.body ?? {};

  try {
    const ghlResponse = await fetch('https://services.leadconnectorhq.com/contacts/upsert', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        Version: '2021-07-28',
      },
      body: JSON.stringify({
        locationId: GHL_LOCATION_ID,
        firstName,
        email,
        phone,
        tags: ['Site Visit Landing Page'],
        customFields: [
          { key: 'extensions_types', field_value: extensionType },
          { key: 'postcodes', field_value: postcode },
        ],
      }),
    });

    const data = await ghlResponse.json().catch(() => null);
    res.status(ghlResponse.status).json(data);
  } catch (err) {
    console.error('GHL contact upsert request failed:', err);
    res.status(502).json({ error: 'Failed to reach GHL' });
  }
}

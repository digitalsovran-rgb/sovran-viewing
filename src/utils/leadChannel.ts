export type LeadChannel = 'Meta Ad' | 'Google Ad' | 'Website';

const STORAGE_KEY = 'sov_lead_channel';

// In-memory fallback for when sessionStorage is unavailable (private mode, blocked storage).
let memoryChannel: LeadChannel | null = null;

function isLeadChannel(value: unknown): value is LeadChannel {
  return value === 'Meta Ad' || value === 'Google Ad' || value === 'Website';
}

function detectFromUrl(): LeadChannel {
  if (typeof window === 'undefined') return 'Website';
  const params = new URLSearchParams(window.location.search);
  const utmSource = (params.get('utm_source') ?? '').toLowerCase();

  if (params.has('fbclid') || ['facebook', 'instagram', 'fb', 'ig', 'meta'].some((s) => utmSource.includes(s))) {
    return 'Meta Ad';
  }
  if (params.has('gclid') || utmSource.includes('google')) {
    return 'Google Ad';
  }
  return 'Website';
}

function readStored(): LeadChannel | null {
  try {
    const stored = window.sessionStorage.getItem(STORAGE_KEY);
    return isLeadChannel(stored) ? stored : null;
  } catch {
    return null;
  }
}

// Called once on first page load. Only records a channel if none is stored yet, so the
// original landing attribution survives later navigation within the same session.
export function captureLeadChannel(): void {
  if (readStored() || memoryChannel) return;
  const channel = detectFromUrl();
  memoryChannel = channel;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, channel);
  } catch {
    // Storage unavailable: the in-memory value above is used instead.
  }
}

export function getLeadChannel(): LeadChannel {
  return readStored() ?? memoryChannel ?? detectFromUrl();
}

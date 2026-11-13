import { useEffect, useState } from 'react';
import { animate } from 'framer-motion';

type Stats = {
  pageViewsToday: number;
  bookingsToday: number;
};

const COUNT_UP_DURATION = 1.2;

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function toCount(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

// Live activity under the hero CTA. Fetches /api/stats once on mount (no polling) and renders
// nothing if both counts are 0 or the request fails. Both numbers count up together.
export default function ActivityLine() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [views, setViews] = useState(0);
  const [requests, setRequests] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/stats')
      .then((res) => (res.ok ? (res.json() as Promise<Partial<Stats>>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        const pageViewsToday = toCount(data.pageViewsToday);
        const bookingsToday = toCount(data.bookingsToday);
        if (pageViewsToday > 0 || bookingsToday > 0) {
          setStats({ pageViewsToday, bookingsToday });
        }
      })
      .catch(() => {
        // Silent: no fallback text, nothing rendered.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!stats) return;

    if (prefersReducedMotion()) {
      setViews(stats.pageViewsToday);
      setRequests(stats.bookingsToday);
      return;
    }

    const viewsControls = animate(0, stats.pageViewsToday, {
      duration: COUNT_UP_DURATION,
      ease: 'easeOut',
      onUpdate: (v) => setViews(Math.round(v)),
    });
    const requestsControls = animate(0, stats.bookingsToday, {
      duration: COUNT_UP_DURATION,
      ease: 'easeOut',
      onUpdate: (v) => setRequests(Math.round(v)),
    });

    return () => {
      viewsControls.stop();
      requestsControls.stop();
    };
  }, [stats]);

  if (!stats) return null;

  const hasViews = stats.pageViewsToday > 0;
  const hasRequests = stats.bookingsToday > 0;

  let message: string;
  if (hasViews && hasRequests) {
    message = `${views} people viewed this page today · ${requests} requested a viewing`;
  } else if (hasViews) {
    message = `${views} people viewed this page today`;
  } else {
    message = `${requests} people requested a viewing today`;
  }

  return (
    <>
      <style>{`
        @keyframes activity-live-pulse {
          0% { box-shadow: 0 0 0 0 rgba(194,178,160,0.5); }
          100% { box-shadow: 0 0 0 8px rgba(194,178,160,0); }
        }
        .activity-live-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #C2B2A0;
          flex-shrink: 0;
          animation: activity-live-pulse 1.8s ease-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .activity-live-dot { animation: none; }
        }
      `}</style>
      <div
        className="viewing-hero-activity"
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          gap: '8px',
          marginTop: '20px',
        }}
      >
        {/* Dot and LIVE stay on the first line; only the message wraps on narrow screens. */}
        <span className="activity-live-dot" aria-hidden="true" style={{ marginTop: '6.5px' }} />
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#C2B2A0',
            lineHeight: '20px',
            flexShrink: 0,
          }}
        >
          Live
        </span>
        <span
          style={{
            fontSize: '14px',
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: 'normal',
            lineHeight: '20px',
            minWidth: 0,
          }}
        >
          · {message}
        </span>
      </div>
    </>
  );
}

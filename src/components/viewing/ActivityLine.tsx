import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

type Stats = {
  pageViewsToday: number;
  bookingsToday: number;
};

const COUNT_UP_DURATION = 1.3;

function useCountUp(target: number, trigger: boolean) {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!trigger || startedRef.current || target <= 0) return;
    startedRef.current = true;
    const controls = animate(0, target, {
      duration: COUNT_UP_DURATION,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [trigger, target]);

  return display;
}

export default function ActivityLine() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/stats')
      .then((res) => (res.ok ? (res.json() as Promise<Partial<Stats>>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        const views = data.pageViewsToday ?? 0;
        const bookings = data.bookingsToday ?? 0;
        if (views > 0 || bookings > 0) {
          setStats({ pageViewsToday: views, bookingsToday: bookings });
        }
      })
      .catch(() => {
        // Silent — no fallback text, no skeleton, just nothing.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const trigger = stats !== null;
  const views = useCountUp(stats?.pageViewsToday ?? 0, trigger);
  const bookings = useCountUp(stats?.bookingsToday ?? 0, trigger);

  if (!stats) return null;

  const showViews = stats.pageViewsToday > 0;
  const showBookings = stats.bookingsToday > 0;

  return (
    <>
      <style>{`
        @keyframes activity-live-pulse {
          0% { box-shadow: 0 0 0 0 rgba(201,169,110,0.55); }
          70% { box-shadow: 0 0 0 6px rgba(201,169,110,0); }
          100% { box-shadow: 0 0 0 0 rgba(201,169,110,0); }
        }
        .activity-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #C9A96E;
          flex-shrink: 0;
          animation: activity-live-pulse 2s ease-out infinite;
        }
      `}</style>
      <div
        className="viewing-hero-activity"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '8px',
          flexWrap: 'wrap',
          marginTop: '24px',
        }}
      >
        <span className="activity-live-dot" />
        <span
          style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: '#C9A96E',
          }}
        >
          Live
        </span>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 400,
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: 'normal',
          }}
        >
          · {showViews && <>{views} people viewed this page today</>}
          {showViews && showBookings && ' · '}
          {showBookings && <>{bookings} booked a viewing</>}
        </span>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';

type StatsResponse = {
  pageViewsToday?: number;
  bookingsToday?: number;
};

export default function ActivityLine() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch('/api/stats')
      .then((res) => (res.ok ? (res.json() as Promise<StatsResponse>) : null))
      .then((data) => {
        if (cancelled || !data) return;
        const views = data.pageViewsToday ?? 0;
        const bookings = data.bookingsToday ?? 0;

        if (views > 0 && bookings > 0) {
          setText(`${views} people viewed this page today · ${bookings} booked a viewing`);
        } else if (views > 0) {
          setText(`${views} people viewed this page today`);
        } else if (bookings > 0) {
          setText(`${bookings} people booked a viewing today`);
        }
      })
      .catch(() => {
        // Silent — no fallback text, no skeleton, just nothing.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!text) return null;

  return (
    <section style={{ backgroundColor: '#F5F0EB', padding: '0 0 32px' }}>
      <p
        className="inner"
        style={{
          textAlign: 'center',
          fontSize: '12px',
          fontWeight: 400,
          color: 'rgba(10,10,10,0.4)',
          letterSpacing: '0.02em',
          margin: '0 auto',
        }}
      >
        {text}
      </p>
    </section>
  );
}

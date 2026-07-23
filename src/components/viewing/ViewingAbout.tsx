import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';

const STAT_ANIMATION_DURATION = 1.8;

const stats = [
  { target: 15, format: (n: number) => `${Math.round(n)}+`, label: 'Years of Experience' },
  { target: 97, format: (n: number) => `${Math.round(n)}%`, label: 'Planning Success Rate' },
  { target: 25, format: (n: number) => `£${Math.round(n)}M+`, label: 'Value Delivered' },
  { target: 1000, format: (n: number) => `${Math.round(n).toLocaleString('en-GB')}+`, label: 'Projects Completed' },
];

const cards = [
  {
    title: 'Architecture & Design',
    body: "We turn a brief into a workable design, drawings, 3D visuals and planning submissions shaped around how you actually want to live. Every layout decision is tested against light, flow and function before it reaches site.",
  },
  {
    title: 'Construction & Delivery',
    body: "The same team that designed the project builds it. Skilled trades, dedicated site management, and a single point of accountability from foundation to final finish.",
  },
  {
    title: 'Guidance & Advice',
    body: "Before you commit to anything, we assess what's realistic for your site, your budget and your timeline, and tell you honestly what it will take to get there.",
  },
];

function ArrowIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#0a0a0a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="10" x2="16" y2="10" />
      <polyline points="10,4 16,10 10,16" />
    </svg>
  );
}

function CountUpStat({
  target,
  format,
  trigger,
}: {
  target: number;
  format: (n: number) => string;
  trigger: boolean;
}) {
  const [display, setDisplay] = useState(format(0));
  const startedRef = useRef(false);

  useEffect(() => {
    if (!trigger || startedRef.current) return;
    startedRef.current = true;
    const controls = animate(0, target, {
      duration: STAT_ANIMATION_DURATION,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(format(v)),
    });
    return () => controls.stop();
  }, [trigger, target, format]);

  return <>{display}</>;
}

export default function ViewingAbout() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -120px 0px', amount: 0.2 });
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '0px 0px -80px 0px', amount: 0.4 });

  return (
    <>
      <style>{`
        .partner-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .partner-card {
          position: relative;
          background-color: #ede9e3;
          border: 1px solid rgba(10,10,10,0.08);
          padding: 36px 32px 64px;
          min-height: 280px;
        }
        .partner-card-tag {
          font-size: 13px;
          font-weight: 300;
          letter-spacing: 0.08em;
          color: #C9A96E;
        }
        .partner-card-title {
          font-size: 20px;
          font-weight: 700;
          color: #0a0a0a;
          letter-spacing: -0.005em;
          margin-top: 14px;
        }
        .partner-card-body {
          font-size: 14px;
          font-weight: 400;
          color: rgba(10,10,10,0.62);
          line-height: 1.65;
          margin-top: 14px;
        }
        .partner-card-arrow {
          position: absolute;
          right: 28px;
          bottom: 28px;
        }
        .about-stats {
          display: flex;
        }
        .about-stat {
          flex: 1;
          text-align: center;
          padding: 0 24px;
        }
        .about-stat + .about-stat {
          border-left: 1px solid rgba(10,10,10,0.12);
        }
        @media (max-width: 768px) {
          .partner-cards {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .about-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .about-stat {
            padding: 24px 12px;
          }
          .about-stat + .about-stat {
            border-left: none;
          }
          .about-stat:nth-child(odd) {
            border-right: 1px solid rgba(10,10,10,0.12);
          }
          .about-stat:nth-child(-n+2) {
            border-bottom: 1px solid rgba(10,10,10,0.12);
          }
        }
      `}</style>
      <section ref={ref} data-theme="light" style={{ backgroundColor: '#F5F0EB', padding: '110px 0' }}>
        <div className="inner">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
            }}
          >
            Delivered By Sovran
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#C9A96E',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginTop: '18px',
            }}
          >
            Your Design And Build Partner
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="partner-cards"
            style={{ marginTop: '56px' }}
          >
            {cards.map((card, i) => (
              <div key={card.title} className="partner-card">
                <span className="partner-card-tag">/{String(i + 1).padStart(2, '0')}</span>
                <h3 className="partner-card-title">{card.title}</h3>
                <p className="partner-card-body">{card.body}</p>
                <span className="partner-card-arrow">
                  <ArrowIcon />
                </span>
              </div>
            ))}
          </motion.div>

          <motion.div
            ref={statsRef}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="about-stats"
            style={{ marginTop: '72px' }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="about-stat">
                <div
                  style={{
                    fontSize: 'clamp(26px, 2.8vw, 36px)',
                    fontWeight: 900,
                    color: '#0a0a0a',
                    letterSpacing: '-0.005em',
                    lineHeight: 1,
                    marginBottom: '10px',
                  }}
                >
                  <CountUpStat target={stat.target} format={stat.format} trigger={isStatsInView} />
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    fontWeight: 500,
                    color: 'rgba(10,10,10,0.55)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}

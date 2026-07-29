import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useInView } from 'framer-motion';

const STAT_ANIMATION_DURATION = 1.8;

const stats = [
  { target: 15, format: (n: number) => `${Math.round(n)}+`, label: 'Years of Experience' },
  { target: 97, format: (n: number) => `${Math.round(n)}%`, label: 'Planning Success Rate' },
  { target: 25, format: (n: number) => `£${Math.round(n)}M+`, label: 'Value Delivered' },
  { target: 1000, format: (n: number) => `${Math.round(n).toLocaleString('en-GB')}+`, label: 'Projects Completed' },
];

const features = [
  {
    label: 'Design Led',
    body: "Every project starts with drawings, 3D visuals and planning submissions shaped around how you want to live, tested against light, flow and function before it reaches site.",
  },
  {
    label: 'One Team',
    body: "The same team that designs a project builds it, with skilled trades and a single point of accountability from foundation to final finish.",
  },
  {
    label: 'Honest Guidance',
    body: "Before you commit to anything, we assess what's realistic for your site, your budget and your timeline, and tell you honestly what it will take to get there.",
  },
];

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
  const [activeFeature, setActiveFeature] = useState(features[0].label);
  const activeFeatureData = features.find((f) => f.label === activeFeature) ?? features[0];

  return (
    <>
      <style>{`
        .about-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
        }
        .about-feature-rule {
          width: 40px;
          height: 2px;
          background-color: #C9A96E;
        }
        .about-feature-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #0a0a0a;
          margin-top: 18px;
        }
        .about-feature-body {
          font-size: 14px;
          font-weight: 400;
          color: rgba(10,10,10,0.62);
          line-height: 1.65;
          margin-top: 10px;
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
        .about-feature-tabs { display: none; }
        .about-feature-tablist {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .about-feature-tab {
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(10,10,10,0.55);
          background-color: transparent;
          border: 1px solid rgba(10,10,10,0.15);
          border-radius: 999px;
          padding: 9px 16px;
          cursor: pointer;
          transition: background-color 0.25s, border-color 0.25s, color 0.25s;
        }
        .about-feature-tab.active {
          background-color: #C9A96E;
          border-color: #C9A96E;
          color: #0a0a0a;
        }
        .about-feature-tab-body {
          font-size: 14px;
          font-weight: 400;
          color: rgba(10,10,10,0.62);
          line-height: 1.65;
          margin-top: 20px;
        }
        @media (max-width: 768px) {
          .about-feature-grid { display: none !important; }
          .about-feature-tabs { display: block; }
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
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#C9A96E',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginBottom: '18px',
            }}
          >
            About Sovran
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
            }}
          >
            Delivered By Sovran.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{
              fontSize: '17px',
              fontWeight: 400,
              color: 'rgba(10,10,10,0.65)',
              lineHeight: 1.7,
              letterSpacing: 'normal',
              maxWidth: '640px',
              marginTop: '22px',
            }}
          >
            Behind every project is a family, a vision, and a home worth building properly. Sovran brings architects, designers and construction specialists together as one team, delivering design and build projects across London and the Home Counties.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="about-feature-grid"
            style={{ marginTop: '56px' }}
          >
            {features.map((feature) => (
              <div key={feature.label}>
                <div className="about-feature-rule" />
                <p className="about-feature-label">{feature.label}</p>
                <p className="about-feature-body">{feature.body}</p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="about-feature-tabs"
            style={{ marginTop: '56px' }}
          >
            <div className="about-feature-tablist">
              {features.map((feature) => (
                <button
                  key={feature.label}
                  type="button"
                  className={`about-feature-tab${feature.label === activeFeature ? ' active' : ''}`}
                  onClick={() => setActiveFeature(feature.label)}
                >
                  {feature.label}
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={activeFeatureData.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="about-feature-tab-body"
              >
                {activeFeatureData.body}
              </motion.p>
            </AnimatePresence>
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

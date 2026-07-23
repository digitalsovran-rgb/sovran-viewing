import { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView } from 'framer-motion';

const STAT_ANIMATION_DURATION = 1.8;

const stats = [
  { target: 15, format: (n: number) => `${Math.round(n)}+`, label: 'Years of Experience' },
  { target: 97, format: (n: number) => `${Math.round(n)}%`, label: 'Planning Success Rate' },
  { target: 25, format: (n: number) => `£${Math.round(n)}M+`, label: 'Value Delivered' },
  { target: 1000, format: (n: number) => `${Math.round(n).toLocaleString('en-GB')}+`, label: 'Projects Completed' },
];

const columns = [
  "Sovran brings architecture, planning and construction together as one team, working across London and the Home Counties. Every specialist involved in a project stays on it from beginning to end.",
  "From a single extension to a complete transformation, our architects, designers and construction specialists carry a project from first sketch to final handover, across residential, commercial and hospitality spaces.",
  "The home you walk through on a Sovran site visit reflects the standard behind every project we deliver, unstaged and unedited for a photograph.",
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
  const isInView = useInView(ref, { once: true, margin: '0px 0px -120px 0px', amount: 0.3 });
  const statsRef = useRef<HTMLDivElement>(null);
  const isStatsInView = useInView(statsRef, { once: true, margin: '0px 0px -80px 0px', amount: 0.4 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleCarouselScroll = () => {
    const el = carouselRef.current;
    if (!el || !el.firstElementChild) return;
    const cardWidth = (el.firstElementChild as HTMLElement).offsetWidth + 16;
    const idx = Math.round(el.scrollLeft / cardWidth);
    setActiveCard(Math.max(0, Math.min(idx, columns.length - 1)));
  };

  return (
    <>
      <style>{`
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
        .about-columns {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 40px;
          text-align: left;
        }
        .about-column {
          border-top: 2px solid #C9A96E;
          padding-top: 24px;
        }
        .about-column p {
          font-size: 15px;
          font-weight: 400;
          color: rgba(10,10,10,0.65);
          line-height: 1.75;
          letter-spacing: normal;
        }
        .about-cta-btn {
          display: inline-block;
          background-color: transparent;
          color: #0a0a0a;
          border: 1px solid #0a0a0a;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 16px 40px;
          cursor: pointer;
          text-decoration: none;
          transition: background-color 0.3s ease, color 0.3s ease;
        }
        .about-cta-btn:hover {
          background-color: #0a0a0a;
          color: #ffffff;
        }
        .about-carousel {
          display: flex;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          -webkit-overflow-scrolling: touch;
          gap: 16px;
          scrollbar-width: none;
        }
        .about-carousel::-webkit-scrollbar {
          display: none;
        }
        .about-carousel-card {
          flex: 0 0 82%;
          scroll-snap-align: start;
          background-color: #ffffff;
          border: 1px solid rgba(10,10,10,0.08);
          border-radius: 10px;
          padding: 28px 24px;
          box-shadow: 0 6px 20px rgba(10,10,10,0.06);
        }
        .about-carousel-number {
          display: block;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: #C9A96E;
          margin-bottom: 14px;
        }
        .about-carousel-card p {
          font-size: 15px;
          font-weight: 400;
          color: rgba(10,10,10,0.65);
          line-height: 1.75;
          letter-spacing: normal;
          text-align: left;
        }
        .about-carousel-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 20px;
        }
        .about-carousel-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(10,10,10,0.2);
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .about-carousel-dot.active {
          background-color: #C9A96E;
          transform: scale(1.5);
        }
        @media (max-width: 768px) {
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
          .about-columns {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
      <section ref={ref} style={{ backgroundColor: '#F5F0EB', padding: '110px 0' }}>
        <div className="inner" style={{ textAlign: 'center', maxWidth: '760px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(34px, 4.2vw, 56px)',
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '-0.01em',
              lineHeight: 1.1,
            }}
          >
            Designed And Built By Sovran.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: '#C9A96E',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              marginTop: '16px',
            }}
          >
            Your Design And Build Partner
          </motion.p>
        </div>

        {isMobile ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{ marginTop: '48px' }}
          >
            <div className="inner about-carousel" ref={carouselRef} onScroll={handleCarouselScroll}>
              {columns.map((text, i) => (
                <div key={i} className="about-carousel-card">
                  <span className="about-carousel-number">{String(i + 1).padStart(2, '0')}</span>
                  <p>{text}</p>
                </div>
              ))}
            </div>
            <div className="about-carousel-dots">
              {columns.map((_, i) => (
                <span key={i} className={`about-carousel-dot${i === activeCard ? ' active' : ''}`} />
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="inner about-columns"
            style={{ marginTop: '56px' }}
          >
            {columns.map((text, i) => (
              <div key={i} className="about-column">
                <p>{text}</p>
              </div>
            ))}
          </motion.div>
        )}

        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          className="inner about-stats"
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

        <div className="inner" style={{ marginTop: '48px', textAlign: 'center' }}>
          <a
            href="https://sovrangroup.co.uk"
            target="_blank"
            rel="noopener noreferrer"
            className="about-cta-btn"
          >
            Discover More About Sovran
          </a>
        </div>
      </section>
    </>
  );
}

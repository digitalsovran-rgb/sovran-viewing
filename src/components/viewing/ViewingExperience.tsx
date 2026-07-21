import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import ImageCarousel from './ImageCarousel';

const DISCOVER_ROTATE_INTERVAL = 5500;

const CAROUSEL_IMAGES = [
  '/media/constr1.png',
  '/media/constr3.png',
  '/media/constr2.png',
  '/media/constr4.png',
  '/media/joiner.png',
];

const items = [
  {
    title: 'The thinking behind the layout and flow',
    desc: 'Every room connects with intention. We walk you through why each space was positioned where it is, and how it changes the way the home is actually used day to day.',
  },
  {
    title: 'Design choices that maximise space and natural light',
    desc: 'See how window placement, ceiling height, and room orientation were used to bring in natural light without compromising privacy or structure.',
  },
  {
    title: 'Luxury features most homeowners only discover after moving in',
    desc: "The features that get added late in a build because a client wishes they'd asked, from lighting control to storage most people forget to plan for.",
  },
  {
    title: 'Details that quietly improve everyday comfort',
    desc: "The quiet decisions, socket placement, acoustic separation, heating zoning, that most homeowners never notice until they're living without them.",
  },
  {
    title: 'Decisions that protect long-term value',
    desc: 'The specification choices made early on, materials, layout, services, that protect what the home is worth years down the line.',
  },
  {
    title: 'The full journey, from first drawing to finished home, with time to ask questions',
    desc: 'From the first sketch through planning, construction, and handover, with the chance to ask a specialist anything about how it actually happened.',
  },
];

const pad = (n: number) => String(n).padStart(2, '0');

function PlusIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      style={{ transform: active ? 'rotate(45deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
    >
      <line x1="7" y1="1" x2="7" y2="13" />
      <line x1="1" y1="7" x2="13" y2="7" />
    </svg>
  );
}

function ChevronIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ transform: active ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
    >
      <polyline points="2,5 7,10 12,5" />
    </svg>
  );
}

function FlipTitle({
  item,
  active,
  align = 'left',
}: {
  item: (typeof items)[0];
  active: boolean;
  align?: 'left' | 'center';
}) {
  return (
    <div className="selector-flip-wrap">
      <motion.div
        className="selector-face selector-face-front"
        animate={{ rotateX: active ? -180 : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <p className="selector-label" style={{ color: active ? '#ffffff' : '#0a0a0a', textAlign: align, width: '100%' }}>
          {item.title}
        </p>
      </motion.div>
      <motion.div
        className="selector-face selector-face-back"
        animate={{ rotateX: active ? 0 : 180 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <p className="selector-desc" style={{ textAlign: align, width: '100%' }}>{item.desc}</p>
      </motion.div>
    </div>
  );
}

function SelectorItem({
  item,
  index,
  isMobile,
  showNumber = true,
  useArrowIcon = false,
}: {
  item: (typeof items)[0];
  index: number;
  isMobile: boolean;
  showNumber?: boolean;
  useArrowIcon?: boolean;
}) {
  const [hoverActive, setHoverActive] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const active = isMobile ? expanded : hoverActive;

  const triggerProps = isMobile
    ? { onClick: () => setExpanded((e) => !e) }
    : {
        onMouseEnter: () => setHoverActive(true),
        onMouseLeave: () => setHoverActive(false),
      };

  return (
    <div className="selector-item-outer">
      <div className="selector-item" style={{ backgroundColor: active ? '#0a0a0a' : 'transparent' }}>
        <div className="selector-row">
          {showNumber && <span className="selector-number">{pad(index + 1)}</span>}

          <FlipTitle item={item} active={active} />

          <span className="selector-plus-hit" style={{ color: active ? '#ffffff' : '#0a0a0a' }} {...triggerProps}>
            {useArrowIcon ? <ChevronIcon active={active} /> : <PlusIcon active={active} />}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ViewingExperience() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '0px 0px -120px 0px', amount: 0.3 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [discoverExpanded, setDiscoverExpanded] = useState(false);
  const [rotatingIndex, setRotatingIndex] = useState(0);
  const [rotatorOpen, setRotatorOpen] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    if (!isMobile || discoverExpanded || rotatorOpen) return;
    const id = window.setInterval(() => {
      setRotatingIndex((i) => (i + 1) % items.length);
    }, DISCOVER_ROTATE_INTERVAL);
    return () => window.clearInterval(id);
  }, [isMobile, discoverExpanded, rotatorOpen]);

  return (
    <>
      <style>{`
        .discover-grid {
          display: flex;
          gap: 56px;
          align-items: stretch;
        }
        .discover-image-col {
          flex: 0 0 46%;
          position: relative;
        }
        .discover-image-sticky {
          position: sticky;
          top: 90px;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }
        .discover-list-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .selector-item-outer {
          padding: 4px 0;
        }
        .selector-item {
          padding: 9px 28px;
          border-bottom: 1px solid rgba(10,10,10,0.08);
          border-radius: 4px;
          transition: background-color 0.3s ease;
        }
        .selector-row {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .selector-number {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          flex-shrink: 0;
          align-self: flex-start;
          margin-top: 4px;
          color: #c9a96e;
        }
        .selector-flip-wrap {
          flex: 1;
          position: relative;
          min-height: 80px;
          perspective: 1000px;
        }
        .selector-face {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        .selector-label {
          font-size: clamp(15px, 1.2vw, 18px);
          font-weight: 700;
          letter-spacing: -0.005em;
          line-height: 1.3;
          max-width: 400px;
          transition: color 0.2s ease;
        }
        .selector-desc {
          font-size: 13px;
          font-weight: 400;
          color: #ffffff;
          line-height: 1.55;
          letter-spacing: normal;
          max-width: 380px;
        }
        .selector-plus-hit {
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px;
          margin: -14px;
          cursor: pointer;
          align-self: flex-start;
          transition: color 0.2s ease;
        }
        .discover-toggle-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          align-self: center;
          margin-top: 20px;
          background: none;
          border: 1px solid rgba(10,10,10,0.25);
          color: #0a0a0a;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 12px 28px;
          cursor: pointer;
          border-radius: 2px;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .discover-toggle-btn:hover {
          background-color: #0a0a0a;
          color: #ffffff;
        }
        .rotator-outer {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .rotator-arrow-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: auto;
          height: auto;
          margin: 2px auto 0;
          padding: 10px;
          background: none;
          border: none;
          color: #0a0a0a;
          cursor: pointer;
          transition: opacity 0.2s ease;
        }
        .rotator-arrow-btn:active {
          opacity: 0.5;
        }
        .rotator-divider {
          width: 100%;
          max-width: 220px;
          height: 1px;
          background-color: rgba(10,10,10,0.1);
          margin: 20px auto 0;
        }
        .rotator-dots {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 16px;
        }
        .rotator-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: rgba(10,10,10,0.2);
          transition: background-color 0.3s ease, transform 0.3s ease;
        }
        .rotator-dot.active {
          background-color: #c9a96e;
          transform: scale(1.5);
        }
        @media (max-width: 768px) {
          .discover-grid { flex-direction: column; align-items: stretch; gap: 32px; }
          .discover-image-col { flex: none; width: 100%; }
          .discover-image-sticky { position: static; top: auto; height: auto; aspect-ratio: 4 / 3; }
          .discover-list-col { width: 100%; }
          .selector-item { padding: 14px 16px; }
          .selector-flip-wrap { min-height: 110px; }
          .selector-label { font-size: 16px; max-width: none; }
          .selector-desc { max-width: none; }
        }
      `}</style>
      <section style={{ backgroundColor: '#F5F0EB', padding: '64px 0' }}>
        <div className="inner" ref={headingRef} style={{ textAlign: 'center' }}>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(32px, 3.8vw, 50px)',
              fontWeight: 900,
              color: '#0a0a0a',
              letterSpacing: '-0.01em',
              maxWidth: '760px',
              margin: '0 auto',
            }}
          >
            What You&apos;ll Discover Inside
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={isHeadingInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: 'rgba(0,0,0,0.55)',
              maxWidth: '520px',
              margin: '18px auto 0',
              lineHeight: 1.7,
              letterSpacing: 'normal',
            }}
          >
            Guided by a Sovran Design &amp; Build Specialist, you&apos;ll walk a completed home and see exactly how it was made to work.
          </motion.p>
        </div>

        <div className="inner discover-grid" style={{ marginTop: '36px' }}>
          <div className="discover-image-col">
            <div className="discover-image-sticky">
              <ImageCarousel images={CAROUSEL_IMAGES} alt="Sovran extension under construction" />
            </div>
          </div>

          <div className="discover-list-col">
            {isMobile && !discoverExpanded ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={items[rotatingIndex].title}
                    className="rotator-outer"
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ duration: 0.35 }}
                  >
                    <div style={{ padding: '14px 16px', borderRadius: '4px', width: '100%', backgroundColor: rotatorOpen ? '#0a0a0a' : 'transparent', transition: 'background-color 0.3s ease' }}>
                      <FlipTitle item={items[rotatingIndex]} active={rotatorOpen} align="center" />
                    </div>
                    <button
                      type="button"
                      className="rotator-arrow-btn"
                      onClick={() => setRotatorOpen((o) => !o)}
                      aria-label={rotatorOpen ? 'Hide description' : 'Show description'}
                    >
                      <ChevronIcon active={rotatorOpen} />
                    </button>
                  </motion.div>
                </AnimatePresence>
                <div className="rotator-divider" />
                <div className="rotator-dots">
                  {items.map((_, i) => (
                    <span key={i} className={`rotator-dot${i === rotatingIndex ? ' active' : ''}`} />
                  ))}
                </div>
                <button
                  type="button"
                  className="discover-toggle-btn"
                  onClick={() => setDiscoverExpanded(true)}
                >
                  Show All
                </button>
              </>
            ) : (
              <>
                {items.map((item, i) => (
                  <SelectorItem key={item.title} item={item} index={i} isMobile={isMobile} showNumber={!isMobile} useArrowIcon={isMobile} />
                ))}
                {isMobile && (
                  <button
                    type="button"
                    className="discover-toggle-btn"
                    onClick={() => setDiscoverExpanded(false)}
                  >
                    Show Less
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

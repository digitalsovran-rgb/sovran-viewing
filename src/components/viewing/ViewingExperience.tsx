import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const ICON_PROPS = {
  width: 32,
  height: 32,
  viewBox: '0 0 32 32',
  fill: 'none',
  stroke: '#C9A96E',
  strokeWidth: 1.4,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function LayoutIcon() {
  return (
    <svg {...ICON_PROPS}>
      <rect x="4" y="5" width="24" height="22" />
      <line x1="16" y1="5" x2="16" y2="16" />
      <line x1="4" y1="16" x2="28" y2="16" />
      <line x1="16" y1="16" x2="16" y2="27" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="16" cy="16" r="6" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="16" y1="26" x2="16" y2="30" />
      <line x1="2" y1="16" x2="6" y2="16" />
      <line x1="26" y1="16" x2="30" y2="16" />
      <line x1="6.3" y1="6.3" x2="9" y2="9" />
      <line x1="23" y1="23" x2="25.7" y2="25.7" />
      <line x1="6.3" y1="25.7" x2="9" y2="23" />
      <line x1="23" y1="9" x2="25.7" y2="6.3" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M16 4 L18.2 13.8 L28 16 L18.2 18.2 L16 28 L13.8 18.2 L4 16 L13.8 13.8 Z" />
    </svg>
  );
}

function HouseIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path d="M5 15 L16 5 L27 15" />
      <path d="M8 13 V27 H24 V13" />
      <line x1="14" y1="27" x2="14" y2="19" />
      <line x1="18" y1="27" x2="18" y2="19" />
      <line x1="14" y1="19" x2="18" y2="19" />
    </svg>
  );
}

function TrendIcon() {
  return (
    <svg {...ICON_PROPS}>
      <polyline points="4,24 12,16 17,20 28,8" />
      <polyline points="20,8 28,8 28,16" />
    </svg>
  );
}

function PathIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="6" cy="8" r="2.2" />
      <circle cx="26" cy="24" r="2.2" />
      <path d="M8 9 C 14 9, 10 18, 16 18 S 24 22, 24 24" strokeDasharray="3 3" />
    </svg>
  );
}

const discoverItems = [
  { Icon: LayoutIcon, title: 'Layout & Flow' },
  { Icon: SunIcon, title: 'Space & Natural Light' },
  { Icon: SparkleIcon, title: 'Luxury Features' },
  { Icon: HouseIcon, title: 'Everyday Comfort' },
  { Icon: TrendIcon, title: 'Long-Term Value' },
  { Icon: PathIcon, title: 'The Full Journey' },
];

export default function ViewingExperience() {
  const headingRef = useRef<HTMLDivElement>(null);
  const isHeadingInView = useInView(headingRef, { once: true, margin: '0px 0px -120px 0px', amount: 0.3 });
  const gridRef = useRef<HTMLDivElement>(null);
  const isGridInView = useInView(gridRef, { once: true, margin: '0px 0px -80px 0px', amount: 0.2 });

  return (
    <>
      <style>{`
        .discover-icon-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .discover-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 40px 20px;
          border: 1px solid rgba(10,10,10,0.08);
          background-color: rgba(10,10,10,0.02);
          border-radius: 6px;
          transition: border-color 0.25s ease, background-color 0.25s ease;
        }
        .discover-card:hover {
          border-color: rgba(201,169,110,0.55);
          background-color: rgba(201,169,110,0.06);
        }
        .discover-card-title {
          margin-top: 18px;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.01em;
          color: #0a0a0a;
        }
        .discover-feature-image {
          width: 100%;
          height: clamp(280px, 44vw, 560px);
          object-fit: cover;
          display: block;
          border-radius: 4px;
        }
        .discover-feature-caption {
          font-size: 16px;
          font-weight: 400;
          color: rgba(10,10,10,0.6);
          max-width: 640px;
          margin: 0 auto;
          line-height: 1.75;
          letter-spacing: normal;
        }
        @media (max-width: 768px) {
          .discover-icon-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .discover-card { padding: 28px 14px; }
        }
      `}</style>
      <section style={{ backgroundColor: '#F5F0EB', padding: '100px 0' }}>
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
        </div>

        <motion.div
          ref={gridRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isGridInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inner discover-icon-grid"
          style={{ marginTop: '56px' }}
        >
          {discoverItems.map(({ Icon, title }) => (
            <div className="discover-card" key={title}>
              <Icon />
              <p className="discover-card-title">{title}</p>
            </div>
          ))}
        </motion.div>

        <div className="inner" style={{ marginTop: '64px' }}>
          <img
            src="/media/constr1.png"
            alt="Sovran extension under construction"
            className="discover-feature-image"
          />
        </div>

        <div className="inner" style={{ marginTop: '40px', textAlign: 'center' }}>
          <p className="discover-feature-caption">
            Guided by a Sovran Design &amp; Build Specialist, you&apos;ll walk a completed home and see the real decisions, materials, and craftsmanship behind it, not a rendering of the finished result.
          </p>
        </div>
      </section>
    </>
  );
}

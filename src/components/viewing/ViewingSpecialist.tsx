import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const FEATURE_ICON_PROPS = {
  width: 28,
  height: 28,
  viewBox: '0 0 28 28',
  fill: 'none',
  stroke: '#ffffff',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

function GuideIcon() {
  return (
    <svg {...FEATURE_ICON_PROPS}>
      <circle cx="14" cy="8" r="4" />
      <path d="M5 24c0-5 4-8 9-8s9 3 9 8" />
    </svg>
  );
}

function AskIcon() {
  return (
    <svg {...FEATURE_ICON_PROPS}>
      <path d="M5 6h18v12H12l-5 4v-4H5z" />
      <path d="M11 10.8c0-1.7 1.4-2.4 3-2.4s3 .7 3 2.2c0 1.5-1.6 1.8-2.6 2.6-.4.3-.6.6-.6 1.1" />
      <circle cx="14" cy="16.5" r="0.5" fill="#ffffff" stroke="none" />
    </svg>
  );
}

function MagnifyIcon() {
  return (
    <svg {...FEATURE_ICON_PROPS}>
      <circle cx="12" cy="12" r="7" />
      <line x1="17.2" y1="17.2" x2="23" y2="23" />
    </svg>
  );
}

function AccountabilityIcon() {
  return (
    <svg {...FEATURE_ICON_PROPS}>
      <circle cx="14" cy="14" r="10" />
      <polyline points="9,14 12.5,17.5 19,10.5" />
    </svg>
  );
}

const features = [
  { Icon: GuideIcon, label: 'A Specialist By Your Side' },
  { Icon: AskIcon, label: 'Ask Anything, Anytime' },
  { Icon: MagnifyIcon, label: 'See Real Materials Up Close' },
  { Icon: AccountabilityIcon, label: 'Full Accountability, Start To Finish' },
];

export default function ViewingSpecialist() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -120px 0px', amount: 0.2 });

  return (
    <>
      <style>{`
        .specialist-features-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }
        .specialist-feature-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 14px;
          padding: 28px 16px;
          border: 1px solid rgba(255,255,255,0.1);
          background-color: rgba(255,255,255,0.02);
          border-radius: 6px;
          transition: border-color 0.25s ease, background-color 0.25s ease;
        }
        .specialist-feature-card:hover {
          border-color: rgba(201,169,110,0.5);
          background-color: rgba(201,169,110,0.05);
        }
        .specialist-feature-label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #ffffff;
        }
        @media (max-width: 767px) {
          .specialist-row { flex-direction: column !important; min-height: unset !important; }
          .specialist-image-col {
            flex: 0 0 auto !important;
            width: 100% !important;
            padding: 32px 24px !important;
          }
          .specialist-image-col img {
            width: 100% !important;
            max-height: none !important;
            height: auto !important;
          }
          .specialist-text-col { flex: auto !important; width: 100% !important; padding: 48px 24px !important; }
          .specialist-features-grid { grid-template-columns: repeat(2, 1fr); gap: 14px; }
          .specialist-feature-card { padding: 22px 12px; }
        }
      `}</style>
      <section
        id="specialist-section"
        ref={ref}
        data-theme="dark"
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <div className="specialist-row" style={{ display: 'flex', flexDirection: 'row-reverse', minHeight: '640px' }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="specialist-image-col"
            style={{
              flex: '0 0 58%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '48px',
            }}
          >
            <img
              src="/media/drawh.png"
              alt="Architectural line drawing of a Sovran home"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="specialist-text-col"
            style={{
              flex: '0 0 42%',
              display: 'flex',
              alignItems: 'center',
              padding: '80px 64px',
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 'clamp(30px, 3.4vw, 48px)',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.08,
                }}
              >
                A Guided Walkthrough
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.75)',
                  lineHeight: 1.75,
                  letterSpacing: 'normal',
                  marginTop: '20px',
                }}
              >
                This isn&apos;t a property viewing. A Sovran Design &amp; Build Specialist walks you through the real decisions, materials, and process behind the home, so you leave with a clear picture of what&apos;s possible for your own.
              </p>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#c9a96e',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: '28px',
                }}
              >
                Led by the Same Specialists Managing Live Sovran Projects Across London.
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="inner specialist-features-grid"
          style={{ paddingTop: '8px', paddingBottom: '72px' }}
        >
          {features.map(({ Icon, label }) => (
            <div className="specialist-feature-card" key={label}>
              <Icon />
              <p className="specialist-feature-label">{label}</p>
            </div>
          ))}
        </motion.div>
      </section>
    </>
  );
}

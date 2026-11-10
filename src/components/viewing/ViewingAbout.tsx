import { useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';

const features = [
  {
    label: 'Design Led',
    body: 'Drawings, 3D visuals and planning strategy shaped around how you want to live, tested for light, flow and function long before work begins on site.',
  },
  {
    label: 'One Team',
    body: 'The people who design your project also deliver it, with skilled trades and a single point of accountability from foundation to final finish.',
  },
  {
    label: 'Accountability',
    body: 'Before anything is agreed, we assess what your site, budget and timeline allow, and tell you plainly what it will take.',
  },
];

export default function ViewingAbout() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -120px 0px', amount: 0.2 });
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
          background-color: var(--sov-greige-dark);
        }
        .about-feature-label {
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--sov-black);
          margin-top: 18px;
        }
        .about-feature-body {
          font-size: 14px;
          font-weight: 400;
          color: var(--sov-grey);
          line-height: 1.65;
          margin-top: 10px;
        }
        .about-credentials {
          text-align: center;
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.16em;
          font-weight: 500;
          color: var(--sov-grey);
          line-height: 1.9;
          margin-top: 56px;
        }
        .about-feature-tabs { display: none; }
        .about-feature-tabs-block {
          border-radius: 8px;
          overflow: hidden;
        }
        .about-feature-tablist {
          display: flex;
          border: 1px solid rgba(10,10,10,0.35);
          border-bottom: none;
        }
        .about-feature-tab {
          flex: 1;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: var(--sov-black);
          background-color: var(--sov-white);
          border: none;
          border-right: 1px solid rgba(10,10,10,0.35);
          padding: 14px 8px;
          cursor: pointer;
          text-align: center;
          transition: background-color 0.25s, color 0.25s;
        }
        .about-feature-tab:last-child {
          border-right: none;
        }
        .about-feature-tab.active {
          background-color: var(--sov-greige-dark);
          color: var(--sov-white);
        }
        .about-feature-tab-panel {
          border: 1px solid rgba(10,10,10,0.35);
          padding: 20px 18px;
          overflow: hidden;
        }
        .about-feature-tab-body {
          font-size: 14px;
          font-weight: 400;
          color: var(--sov-grey);
          line-height: 1.65;
          margin: 0;
        }
        @media (max-width: 768px) {
          .about-feature-grid { display: none !important; }
          .about-feature-tabs { display: block; }
        }
      `}</style>
      <section ref={ref} data-theme="light" style={{ backgroundColor: 'var(--sov-white)', padding: '110px 0' }}>
        <div className="inner">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--sov-greige-dark)',
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
              color: 'var(--sov-black)',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
            }}
          >
            Delivered By Sovran.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.8, delay: 0.15, ease: 'easeOut' }}
            style={{
              textTransform: 'uppercase',
              fontSize: '13px',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: 'var(--sov-greige-dark)',
              margin: '12px 0 0',
            }}
          >
            Your Design And Build Partner
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{
              fontSize: '17px',
              fontWeight: 400,
              color: 'var(--sov-grey)',
              lineHeight: 1.7,
              letterSpacing: 'normal',
              maxWidth: '640px',
              marginTop: '22px',
            }}
          >
            Since 2011, Sovran has designed, delivered and refined exceptional spaces as one integrated team. Architecture, planning, interiors and the build are led by the same people, for clients across London and the wider UK.
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
            <div className="about-feature-tabs-block">
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
              <div className="about-feature-tab-panel">
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
              </div>
            </div>
          </motion.div>

          <p className="about-credentials">
            15+ Years · 97% Planning Success Rate · £25M+ Value Delivered · 1,000+ Projects Completed
          </p>
        </div>
      </section>
    </>
  );
}

import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { KenBurnsStatic } from './KenBurnsCarousel';

const DESKTOP_VISIT_IMAGE = '/media/visitpc.webp';
const MOBILE_VISIT_IMAGE = '/media/visitmob.webp';

const journeyPoints = [
  'How the layout and flow were planned around daily life',
  'True proportions and natural light, experienced at full scale',
  'Materials, joinery and finishes you can see and touch',
  'The details owners value most once they move in',
  'Realistic cost and timeline benchmarks for work of this scale',
  'The full journey from first sketch to handover, with time for your questions',
];

export default function ViewingExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -120px 0px', amount: 0.2 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return (
    <>
      <style>{`
        .visit-list-item {
          display: flex;
          align-items: flex-start;
          gap: 22px;
          padding: 26px 0;
          border-bottom: 1px solid rgba(10,10,10,0.08);
        }
        .visit-list-item:last-child {
          border-bottom: none;
        }
        .visit-list-number {
          flex-shrink: 0;
          width: 34px;
          font-size: 20px;
          font-weight: 500;
          color: var(--sov-greige-dark);
          line-height: 1.6;
        }
        .visit-list-rule {
          flex-shrink: 0;
          width: 2px;
          height: 27px;
          background-color: var(--sov-greige-dark);
        }
        .visit-list-text {
          font-size: 17px;
          font-weight: 400;
          color: var(--sov-black);
          line-height: 1.6;
          letter-spacing: normal;
        }
        .visit-feature-image-wrap {
          position: relative;
          width: 100%;
          height: clamp(280px, 44vw, 560px);
          overflow: hidden;
          display: block;
        }
        @media (max-width: 768px) {
          .visit-list-item { gap: 16px; padding: 20px 0; }
          .visit-list-number { width: 28px; font-size: 17px; }
          .visit-list-rule { height: 22px; }
          .visit-list-text { font-size: 15px; }
        }
      `}</style>
      <section data-theme="light" style={{ backgroundColor: 'var(--sov-white)', padding: '100px 0' }}>
        <div className="inner" ref={ref}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 900,
              color: 'var(--sov-black)',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
              maxWidth: '760px',
            }}
          >
            What The Viewing Reveals
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              fontSize: '17px',
              fontWeight: 400,
              color: 'var(--sov-grey)',
              lineHeight: 1.7,
              letterSpacing: 'normal',
              maxWidth: '620px',
              marginTop: '22px',
            }}
          >
            Your guide is the design and build specialist who delivered the project. They will explain how each space was planned, which materials were specified and why, and what this level of finish involves for a project like yours.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            style={{ listStyle: 'none', margin: '56px 0 0', padding: 0 }}
          >
            {journeyPoints.map((text, i) => (
              <li key={i} className="visit-list-item">
                <span className="visit-list-number">{String(i + 1).padStart(2, '0')}</span>
                <span className="visit-list-rule" />
                <span className="visit-list-text">{text}</span>
              </li>
            ))}
          </motion.ul>

          <div className="visit-feature-image-wrap" style={{ marginTop: '64px' }}>
            <KenBurnsStatic
              src={isMobile ? MOBILE_VISIT_IMAGE : DESKTOP_VISIT_IMAGE}
              alt="A completed Sovran design and build project"
              duration={14}
              zoomScale={1.06}
            />
          </div>
        </div>
      </section>
    </>
  );
}

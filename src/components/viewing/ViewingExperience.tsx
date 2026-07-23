import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const journeyPoints = [
  "The layout and flow decisions that shaped how the finished home works, day to day.",
  "Real proportions, real square footage, and materials you can consider for your own project.",
  "The design choices that maximise space and natural light.",
  "Luxury features most homeowners only discover after moving in.",
  "Honest cost and timeline benchmarks for a project of this scale.",
  "The full journey from first sketch to completed home, with the person who led it there to answer your questions.",
];

export default function ViewingExperience() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -120px 0px', amount: 0.2 });

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
          font-weight: 700;
          color: #C9A96E;
          line-height: 1.6;
        }
        .visit-list-rule {
          flex-shrink: 0;
          width: 2px;
          height: 27px;
          background-color: #C9A96E;
        }
        .visit-list-text {
          font-size: 17px;
          font-weight: 400;
          color: #0a0a0a;
          line-height: 1.6;
          letter-spacing: normal;
        }
        .visit-feature-image {
          width: 100%;
          height: clamp(280px, 44vw, 560px);
          object-fit: cover;
          display: block;
        }
        @media (max-width: 768px) {
          .visit-list-item { gap: 16px; padding: 20px 0; }
          .visit-list-number { width: 28px; font-size: 17px; }
          .visit-list-rule { height: 22px; }
          .visit-list-text { font-size: 15px; }
        }
      `}</style>
      <section data-theme="light" style={{ backgroundColor: '#F5F0EB', padding: '100px 0' }}>
        <div className="inner" ref={ref}>
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
              maxWidth: '760px',
            }}
          >
            What This Visit Gives You
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              fontSize: '17px',
              fontWeight: 400,
              color: 'rgba(10,10,10,0.65)',
              lineHeight: 1.7,
              letterSpacing: 'normal',
              maxWidth: '620px',
              marginTop: '22px',
            }}
          >
            A working look at a finished Sovran extension, renovation or new build, guided in person from start to finish.
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

          <div style={{ marginTop: '64px' }}>
            <img
              src="/media/constr1.png"
              alt="A completed Sovran extension"
              className="visit-feature-image"
            />
          </div>
        </div>
      </section>
    </>
  );
}

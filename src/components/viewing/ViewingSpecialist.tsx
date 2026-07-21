import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import ImageCarousel from './ImageCarousel';

const CAROUSEL_IMAGES = [
  '/media/inside1.png',
  '/media/plann1.png',
  '/media/inside2.png',
  '/media/plann2.png',
];

export default function ViewingSpecialist() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -120px 0px', amount: 0.2 });

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .specialist-row { flex-direction: column !important; min-height: unset !important; }
          .specialist-carousel-col { flex: 0 0 340px !important; width: 100% !important; }
          .specialist-text-col { flex: auto !important; width: 100% !important; padding: 48px 24px !important; }
        }
      `}</style>
      <section
        id="specialist-section"
        ref={ref}
        style={{ backgroundColor: '#0a0a0a' }}
      >
        <div className="specialist-row" style={{ display: 'flex', minHeight: '640px' }}>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="specialist-carousel-col"
            style={{ flex: '0 0 58%', position: 'relative', overflow: 'hidden' }}
          >
            <ImageCarousel images={CAROUSEL_IMAGES} alt="Inside a completed Sovran home and its planning drawings" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
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
      </section>
    </>
  );
}

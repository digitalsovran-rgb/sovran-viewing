import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

function SectionLabel({ label }: { label: string }) {
  return (
    <p
      style={{
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#C9A96E',
        marginBottom: '20px',
      }}
    >
      {label}
    </p>
  );
}

export default function ViewingSpecialist() {
  const ref = useRef<HTMLElement>(null);
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
        @media (max-width: 767px) {
          .expect-row { flex-direction: column !important; }
          .expect-text-col { flex: auto !important; width: 100% !important; padding: 64px 24px 48px !important; }
          .expect-image-col { flex: 0 0 auto !important; width: 100% !important; min-height: 0 !important; }
        }
      `}</style>
      <section id="specialist-section" ref={ref} data-theme="dark" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="expect-row" style={{ display: 'flex', alignItems: 'stretch' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="expect-text-col"
            style={{
              flex: '0 0 50%',
              display: 'flex',
              alignItems: 'center',
              padding: '100px 64px',
            }}
          >
            <div>
              <SectionLabel label="The Experience" />
              <h2
                style={{
                  fontSize: 'clamp(30px, 3.4vw, 48px)',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                }}
              >
                What To Expect From Your Visit
              </h2>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: 'rgba(255,255,255,0.78)',
                  lineHeight: 1.75,
                  letterSpacing: 'normal',
                  marginTop: '24px',
                  maxWidth: '520px',
                }}
              >
                You&apos;ll be welcomed into the home and walked through it room by room, at your own pace. There&apos;s time to stop, look closely, and ask about anything you notice, from the materials underfoot to the reasoning behind a layout decision. Nothing is rushed, and nothing is scripted.
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
                Hosted By The Team Behind Live Sovran Projects Across London.
              </p>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#ffffff',
                  lineHeight: 1.7,
                  letterSpacing: 'normal',
                  marginTop: '24px',
                  maxWidth: '520px',
                }}
              >
                Bring your own plans, your own questions, or just an idea. You&apos;ll leave with a clearer sense of what&apos;s realistic for your home.
              </p>
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: 400,
                  color: 'rgba(245,240,235,0.5)',
                  lineHeight: 1.6,
                  letterSpacing: 'normal',
                  marginTop: '18px',
                }}
              >
                Places are limited to keep each visit personal and unhurried.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="expect-image-col"
            style={
              isMobile
                ? { flex: '0 0 auto', width: '100%' }
                : { flex: '0 0 50%', position: 'relative', minHeight: '480px' }
            }
          >
            {isMobile ? (
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <img
                  src="/media/planmobh.png"
                  alt="Architectural plan drawing, top half"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
                <img
                  src="/media/planmobf.png"
                  alt="Architectural plan drawing, bottom half"
                  style={{ display: 'block', width: '100%', height: 'auto' }}
                />
              </div>
            ) : (
              <img
                src="/media/planpc.png?v=2"
                alt="Architectural plan drawing"
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}

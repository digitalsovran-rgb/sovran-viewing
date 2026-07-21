import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const stats = [
  { value: '15+', label: 'Years of Experience' },
  { value: '97%', label: 'Planning Success Rate' },
  { value: '£25M+', label: 'Value Delivered' },
  { value: '1,000+', label: 'Projects Completed' },
];

export default function ViewingAbout() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '0px 0px -120px 0px', amount: 0.3 });
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const showSecondParagraph = !isMobile || expanded;

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
        }
      `}</style>
      <section ref={ref} style={{ backgroundColor: '#F5F0EB', padding: '110px 0' }}>
        <div className="inner" style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto' }}>
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
            Design And Build Solutions
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: 'rgba(10,10,10,0.65)',
              lineHeight: 1.75,
              letterSpacing: 'normal',
              marginTop: '28px',
              maxWidth: '680px',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
            A home rarely needs to change for its own sake. It changes because a family outgrew it, because life asks for more from the space around them. Sovran was founded by architects, designers and construction specialists who bring architecture, planning, construction and interiors together under one team, whether the work is a single extension or a complete transformation, residential or commercial.
          </motion.p>

          {showSecondParagraph && (
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.8, delay: isMobile ? 0 : 0.2, ease: 'easeOut' }}
              style={{
                fontSize: '16px',
                fontWeight: 400,
                color: 'rgba(10,10,10,0.65)',
                lineHeight: 1.75,
                letterSpacing: 'normal',
                marginTop: '24px',
                maxWidth: '680px',
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
            >
              That&apos;s why we open our finished homes to people still deciding. A showroom can be dressed for a photograph. A real home, built for a real family, cannot. What you walk through on a Sovran site visit is the standard held on every project we deliver, not a version of it staged for the camera.
            </motion.p>
          )}

          {isMobile && (
            <button
              type="button"
              onClick={() => setExpanded((e) => !e)}
              style={{
                display: 'inline-block',
                background: 'none',
                border: 'none',
                color: '#c9a96e',
                fontSize: '13px',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                textDecoration: 'underline',
                textUnderlineOffset: '3px',
                cursor: 'pointer',
                padding: 0,
                marginTop: '18px',
              }}
            >
              {expanded ? 'Read Less' : 'Read More'}
            </button>
          )}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            className="about-stats"
            style={{ marginTop: '64px' }}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="about-stat">
                <div
                  style={{
                    fontSize: 'clamp(26px, 2.8vw, 36px)',
                    fontWeight: 900,
                    color: '#c9a96e',
                    letterSpacing: '-0.005em',
                    lineHeight: 1,
                    marginBottom: '10px',
                  }}
                >
                  {stat.value}
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

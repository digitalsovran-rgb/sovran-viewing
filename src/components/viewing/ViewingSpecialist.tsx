import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const checklistItems = [
  'Warmer, more energy efficient homes',
  'Lower running costs',
  'More natural light throughout',
  'Healthier, more comfortable living',
  'Built to hold their value for years to come',
];

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#C9A96E" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3,8.5 6.5,12 13,4" />
    </svg>
  );
}

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

  return (
    <>
      <style>{`
        .expect-checklist {
          list-style: none;
          margin: 24px 0 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .expect-checklist li {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 15px;
          font-weight: 400;
          color: rgba(255,255,255,0.85);
          line-height: 1.5;
          letter-spacing: normal;
        }
        .expect-checklist svg {
          flex-shrink: 0;
          margin-top: 3px;
        }
        @media (max-width: 767px) {
          .expect-row { flex-direction: column !important; }
          .expect-text-col { flex: auto !important; width: 100% !important; padding: 64px 24px 48px !important; }
          .expect-image-col {
            flex: 0 0 auto !important;
            width: 100% !important;
            min-height: 0 !important;
            aspect-ratio: auto !important;
            position: static !important;
            margin-left: 0 !important;
            padding-bottom: 48px !important;
          }
          .expect-image {
            position: static !important;
            display: block !important;
            width: 100% !important;
            height: clamp(280px, 60vw, 420px) !important;
            object-fit: cover !important;
            object-position: 68% center !important;
          }
        }
      `}</style>
      <section id="specialist-section" ref={ref} data-theme="dark" style={{ backgroundColor: '#0a0a0a' }}>
        <div className="expect-row" style={{ display: 'flex', alignItems: 'center' }}>
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="expect-text-col"
            style={{
              flex: '0 0 44%',
              display: 'flex',
              alignItems: 'center',
              padding: '100px 64px',
            }}
          >
            <div>
              <SectionLabel label="The Future" />
              <h2
                style={{
                  fontSize: 'clamp(30px, 3.4vw, 48px)',
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                }}
              >
                Designed For What&apos;s Next
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
                From March 2027, new UK building standards raise the bar for how homes perform, not just how they look. At Sovran, we design every project with that shift already in mind.
              </p>

              <ul className="expect-checklist" style={{ maxWidth: '520px' }}>
                {checklistItems.map((item) => (
                  <li key={item}>
                    <CheckIcon />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

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
                Many of our projects also include smart lighting, heating and security, giving homeowners control over comfort and efficiency from a single app.
              </p>

              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#c9a96e',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: '28px',
                  maxWidth: '520px',
                }}
              >
                Ask how these standards shape the home you&apos;re about to walk through, and what they could mean for your own project.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            className="expect-image-col"
            style={{
              flex: '1 1 auto',
              position: 'relative',
              aspectRatio: '1920 / 1080',
              marginLeft: '-56px',
            }}
          >
            <img
              className="expect-image"
              src="/media/houseic.webp"
              alt="A finished Sovran home"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
              }}
            />
          </motion.div>
        </div>
      </section>
    </>
  );
}

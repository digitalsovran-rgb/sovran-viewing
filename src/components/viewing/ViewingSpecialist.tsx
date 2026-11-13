import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Smartphone, Thermometer, TrendingDown, type LucideIcon } from 'lucide-react';

const outcomeRows: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: Thermometer, title: 'Steady Warmth', text: 'Rooms that hold their heat through the coldest months.' },
  { Icon: TrendingDown, title: 'Lower Running Costs', text: 'Efficient systems that keep energy bills down.' },
  { Icon: Smartphone, title: 'One App, Full Control', text: 'Smart lighting, heating and security, available on request.' },
];

function SectionLabel({ label }: { label: string }) {
  return (
    <p
      style={{
        fontSize: '12px',
        fontWeight: 600,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'var(--sov-greige-light)',
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
      <section id="specialist-section" ref={ref} data-theme="dark" style={{ backgroundColor: 'var(--sov-black)' }}>
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
                  color: 'var(--sov-white)',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.1,
                }}
              >
                Designed For What Comes Next
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
                From March 2027, new homes in England must meet the Future Homes Standard, with higher energy performance and low-carbon heating. Sovran already applies that thinking to new builds, extensions and renovations alike, settling comfort and running costs at the drawing stage.
              </p>

              <div style={{ marginTop: '32px', display: 'grid', gap: '20px' }}>
                {outcomeRows.map(({ Icon, title, text }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <Icon size={22} strokeWidth={1.6} color="#C2B2A0" style={{ flex: '0 0 auto', marginTop: '2px' }} aria-hidden="true" />
                    <div>
                      <p style={{ fontSize: '16px', fontWeight: 700, color: '#FFFFFF', margin: '0 0 4px' }}>{title}</p>
                      <p style={{ fontSize: '14.5px', lineHeight: 1.55, color: 'rgba(255,255,255,0.7)' }}>{text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--sov-greige-light)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginTop: '32px',
                  maxWidth: '520px',
                }}
              >
                Ask During Your Viewing How These Standards Shaped The Property.
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

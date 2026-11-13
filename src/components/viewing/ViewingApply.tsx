import { motion, useReducedMotion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'I Share My Project',
    text: 'A few short questions about what I am planning, my investment level and when I would like to begin.',
  },
  {
    number: '02',
    title: 'My Project Is Reviewed',
    text: 'A member of the Sovran team calls me to understand my plans and confirm the project is eligible.',
  },
  {
    number: '03',
    title: 'I Am Invited To A Viewing',
    text: 'Once approved, I am offered a private viewing of a completed home as a courtesy, at a time that suits me.',
  },
];

export default function ViewingApply() {
  const reduceMotion = useReducedMotion();

  return (
    <>
      <style>{`
        .apply-section { padding: 96px 24px; }
        .apply-steps {
          position: relative;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 32px;
          margin-top: 48px;
        }
        /* Desktop: one horizontal line through the circle centres, from the first to the last. */
        .apply-line {
          position: absolute;
          top: 22px;
          left: calc((100% - 64px) / 6);
          right: calc((100% - 64px) / 6);
          height: 1px;
          background-color: rgba(10,10,10,0.15);
        }
        .apply-step {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .apply-circle {
          position: relative;
          z-index: 1;
          flex: 0 0 44px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background-color: #FFFFFF;
          border: 1px solid #4A443C;
          display: grid;
          place-items: center;
          font-size: 14px;
          font-weight: 600;
          color: #4A443C;
        }
        .apply-connector { display: none; }
        .apply-step-title {
          font-size: 18px;
          font-weight: 700;
          color: #0A0A0A;
          margin: 14px 0 6px;
        }
        .apply-step-text {
          font-size: 15px;
          line-height: 1.6;
          color: #6B655C;
          max-width: 300px;
          margin: 0 auto;
        }
        .apply-callout {
          font-size: 22px;
        }
        @media (max-width: 767px) {
          .apply-section { padding: 72px 20px; }
          .apply-steps {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .apply-line { display: none; }
          .apply-step {
            flex-direction: row;
            align-items: flex-start;
            text-align: left;
            gap: 16px;
          }
          /* Mobile: each step's segment runs from its circle centre to the next circle centre
             (row height plus the 28px gap), behind the circles. */
          .apply-connector {
            display: block;
            position: absolute;
            left: 22px;
            top: 22px;
            width: 1px;
            height: calc(100% + 28px);
            background-color: rgba(10,10,10,0.15);
          }
          .apply-step-body { padding-top: 11px; }
          .apply-step-title { margin: 0 0 6px; }
          .apply-step-text { max-width: none; margin: 0; }
          .apply-callout { font-size: 19px; }
        }
      `}</style>
      <section className="apply-section" data-theme="light" style={{ backgroundColor: '#FFFFFF' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
              fontSize: '13px',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: '#4A443C',
              marginBottom: '18px',
            }}
          >
            How To Apply
          </p>

          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 900,
              color: '#0A0A0A',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
            }}
          >
            Three Steps To Your Private Viewing.
          </h2>

          <div className="apply-steps">
            <div className="apply-line" aria-hidden="true" />
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                className="apply-step"
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={reduceMotion ? { duration: 0 } : { duration: 0.4, delay: i * 0.1, ease: 'easeOut' }}
              >
                {i < steps.length - 1 && <div className="apply-connector" aria-hidden="true" />}
                <div className="apply-circle">{step.number}</div>
                <div className="apply-step-body">
                  <p className="apply-step-title">{step.title}</p>
                  <p className="apply-step-text">{step.text}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <p
            style={{
              textAlign: 'center',
              fontSize: '14px',
              color: '#6B655C',
              lineHeight: 1.6,
              maxWidth: '560px',
              margin: '32px auto 0',
            }}
          >
            Viewings are reserved for eligible design and build projects, and each application is reviewed individually.
          </p>

          <div
            style={{
              maxWidth: '760px',
              margin: '48px auto 0',
              textAlign: 'left',
              borderLeft: '2px solid #4A443C',
              padding: '8px 0 8px 24px',
            }}
          >
            <p className="apply-callout" style={{ lineHeight: 1.5, fontWeight: 500, color: '#0A0A0A' }}>
              In our experience, homeowners who attend a viewing begin their own design stage with a clearer brief, firmer budgets and far fewer doubts.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

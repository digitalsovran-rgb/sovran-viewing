import { motion, useReducedMotion } from 'framer-motion';

const figures = ['Since 2011', '1,000+ Projects', '97% Planning Success', '4.9 Rated On Google'];

export default function ViewingAbout() {
  const reduceMotion = useReducedMotion();
  const fade = {
    initial: reduceMotion ? false : { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.6, ease: 'easeOut' as const },
  };

  return (
    <>
      <style>{`
        .about-section { padding: 128px 24px; text-align: center; }
        .about-statement { font-size: 26px; }
        .about-figures {
          text-transform: uppercase;
          font-size: 12px;
          letter-spacing: 0.18em;
          font-weight: 600;
          color: #C2B2A0;
          line-height: 1.9;
        }
        .about-figures-grid { display: none; }
        @media (max-width: 767px) {
          .about-section { padding: 96px 22px; }
          .about-statement { font-size: 20px; }
          .about-figures-line { display: none; }
          .about-figures-grid {
            display: grid;
            grid-template-columns: repeat(2, auto);
            justify-content: center;
            gap: 14px 18px;
          }
        }
      `}</style>
      <section className="about-section" data-theme="dark" style={{ backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p
            style={{
              textTransform: 'uppercase',
              fontSize: '13px',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: '#C2B2A0',
              marginBottom: '18px',
            }}
          >
            What We Stand For
          </p>

          <h2
            style={{
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
            }}
          >
            Designed To Be Remembered.
          </h2>

          <motion.p
            className="about-statement"
            {...fade}
            style={{
              margin: '28px auto 0',
              maxWidth: '820px',
              fontWeight: 300,
              lineHeight: 1.55,
              color: '#FFFFFF',
            }}
          >
            We believe a home should feel quietly exceptional long after the last trade has left. Since 2011, our design and build team has pursued that standard on each project, until the finished property feels unmistakably personal to the people who live there.
          </motion.p>

          <div
            aria-hidden="true"
            style={{ width: '48px', height: '1px', backgroundColor: 'rgba(194,178,160,0.5)', margin: '56px auto' }}
          />

          <motion.div {...fade}>
            <p className="about-figures about-figures-line">{figures.join(' · ')}</p>
            <div className="about-figures about-figures-grid">
              {figures.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </motion.div>

          <img
            src="/media/logo-sovran-white.webp"
            alt="Sovran"
            loading="lazy"
            style={{ width: '110px', height: 'auto', display: 'block', margin: '56px auto 0', opacity: 0.9 }}
          />
        </div>
      </section>
    </>
  );
}

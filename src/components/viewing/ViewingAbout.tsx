import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

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
        .about-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 40px;
          font-size: 15px;
          font-weight: 500;
          color: #FFFFFF;
          text-decoration: none;
          border-bottom: 1px solid rgba(194,178,160,0.6);
          padding-bottom: 4px;
          transition: color 0.2s, border-bottom-color 0.2s;
        }
        @media (hover: hover) and (pointer: fine) {
          .about-link:hover { color: #C2B2A0; border-bottom-color: #C2B2A0; }
        }
        @media (max-width: 767px) {
          .about-section { padding: 96px 22px; }
          .about-statement { font-size: 20px; }
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
            A home quietly shapes the people inside it: how mornings begin, where a family gathers, what lingers with a guest on the way out. Since 2011, Sovran has designed and built with that in mind, for the many years after handover.
          </motion.p>

          <p
            style={{
              marginTop: '28px',
              textTransform: 'uppercase',
              fontSize: '12px',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: '#C2B2A0',
              textAlign: 'center',
            }}
          >
            The Sovran Team
          </p>

          <a className="about-link" href="https://www.sovranstudio.co.uk/about" target="_blank" rel="noopener">
            Explore the world of Sovran
            <ArrowRight size={16} aria-hidden="true" />
          </a>

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

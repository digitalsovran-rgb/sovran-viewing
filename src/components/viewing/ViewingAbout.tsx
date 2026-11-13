import { motion, useReducedMotion } from 'framer-motion';

const beliefs = [
  {
    numeral: 'I',
    title: 'One Team, One Conscience',
    text: 'The people who shape the design remain accountable for each detail that follows.',
  },
  {
    numeral: 'II',
    title: 'Craft Before Speed',
    text: 'Details receive the time they deserve, as a finish is judged across decades.',
  },
  {
    numeral: 'III',
    title: 'Honesty From The First Conversation',
    text: 'Realistic costs, timelines and advice, offered plainly, even when the answer reshapes the plan.',
  },
];

export default function ViewingAbout() {
  const reduceMotion = useReducedMotion();
  const fadeUp = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 12 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: reduceMotion ? { duration: 0 } : { duration: 0.5, delay, ease: 'easeOut' as const },
  });

  return (
    <>
      <style>{`
        .about-section { padding: 128px 24px; text-align: center; }
        .about-desc { font-size: 18px; }
        .about-belief {
          display: grid;
          grid-template-columns: 56px 1fr;
          align-items: baseline;
          padding: 26px 0;
          border-bottom: 1px solid rgba(194,178,160,0.25);
        }
        .about-belief-title { font-size: 17px; }
        @media (max-width: 767px) {
          .about-section { padding: 96px 22px; }
          .about-desc { font-size: 16.5px; }
          .about-belief { grid-template-columns: 44px 1fr; }
          .about-belief-title { font-size: 16px; }
        }
      `}</style>
      <section className="about-section" data-theme="dark" style={{ backgroundColor: '#0A0A0A' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
              fontSize: '13px',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: '#C2B2A0',
              marginBottom: '18px',
            }}
          >
            Our Ethos
          </p>

          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
            }}
          >
            A Standard Worth Inheriting.
          </h2>

          <motion.p
            className="about-desc"
            {...fadeUp(0)}
            style={{
              textAlign: 'center',
              margin: '24px auto 0',
              maxWidth: '680px',
              fontWeight: 300,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.88)',
            }}
          >
            Since 2011, Sovran has held one conviction: the finest homes are shaped around the lives unfolding inside them. Our designers and builders study how a family wishes to wake, gather and entertain, then translate it into spaces where those moments feel effortless. The outcome settles into a quality that only deepens with the years.
          </motion.p>

          <div
            style={{
              margin: '56px auto 0',
              maxWidth: '720px',
              textAlign: 'left',
              borderTop: '1px solid rgba(194,178,160,0.25)',
            }}
          >
            {beliefs.map((belief, i) => (
              <motion.div key={belief.numeral} className="about-belief" {...fadeUp(i * 0.1)}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, 'Times New Roman', serif",
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: '26px',
                    color: '#C2B2A0',
                  }}
                >
                  {belief.numeral}
                </span>
                <div>
                  <p className="about-belief-title" style={{ fontWeight: 700, color: '#FFFFFF', margin: '0 0 6px' }}>
                    {belief.title}
                  </p>
                  <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'rgba(255,255,255,0.68)', margin: 0 }}>
                    {belief.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <img
            src="/media/logo-sovran-white.webp"
            alt="Sovran"
            loading="lazy"
            style={{ width: '110px', height: 'auto', display: 'block', margin: '64px auto 0', opacity: 0.9 }}
          />
        </div>
      </section>
    </>
  );
}

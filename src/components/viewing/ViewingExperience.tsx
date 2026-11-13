import { motion } from 'framer-motion';
import { Compass, MessagesSquare, PoundSterling, ShieldCheck, type LucideIcon } from 'lucide-react';

type Card = { Icon: LucideIcon; title: string; text: string };

const cards: Card[] = [
  {
    Icon: ShieldCheck,
    title: 'Confidence In Each Decision',
    text: 'Plan your own project knowing the standard you want and the team able to reach it.',
  },
  {
    Icon: Compass,
    title: 'Know What Is Possible',
    text: 'Learn which layouts, spaces and finishes could work for the property you own.',
  },
  {
    Icon: PoundSterling,
    title: "Today's Real Costs",
    text: 'Current costs and timelines for work at this level.',
  },
  {
    Icon: MessagesSquare,
    title: 'A Specialist At Your Side',
    text: 'Every question answered in person by the specialist who delivered the project.',
  },
];

export default function ViewingExperience() {
  return (
    <>
      <style>{`
        .leave-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          max-width: 1200px;
          margin: 56px auto 0;
        }
        .leave-card {
          background-color: #FFFFFF;
          border: 1px solid rgba(10,10,10,0.1);
          border-radius: 0;
          padding: 28px;
        }
        .leave-card-icon {
          display: block;
          margin-bottom: 16px;
        }
        .leave-card-title {
          font-size: 17px;
          font-weight: 700;
          color: #0A0A0A;
          margin-bottom: 8px;
        }
        .leave-card-text {
          font-size: 15px;
          line-height: 1.6;
          color: #6B655C;
        }
        @media (max-width: 767px) {
          .leave-grid { grid-template-columns: 1fr; gap: 12px; }
          .leave-card { padding: 22px; }
        }
      `}</style>
      <section data-theme="light" style={{ backgroundColor: '#FFFFFF', padding: '100px 0' }}>
        <div className="inner">
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
            The Viewing
          </p>

          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 900,
              color: 'var(--sov-black)',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
            }}
          >
            Discover What You Can Achieve.
          </h2>

          <div className="leave-grid">
            {cards.map(({ Icon, title, text }, i) => (
              <motion.div
                key={title}
                className="leave-card"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08, ease: 'easeOut' }}
              >
                <Icon className="leave-card-icon" size={22} strokeWidth={1.6} color="#4A443C" aria-hidden="true" />
                <p className="leave-card-title">{title}</p>
                <p className="leave-card-text">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

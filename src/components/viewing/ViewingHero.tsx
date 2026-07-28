import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import KenBurnsCarousel from './KenBurnsCarousel';
import ActivityLine from './ActivityLine';

const DESKTOP_IMAGES = ['/media/hero.png', '/media/hero2.png', '/media/hero3.png'];
const MOBILE_IMAGES = ['/media/heromob.png', '/media/heromob2.png', '/media/heromob3.png'];

export default function ViewingHero() {
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const scrollToForm = () => {
    document.getElementById('viewing-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          #viewing-hero { min-height: 640px !important; }
          .viewing-hero-content { padding: 0 24px 40px !important; max-width: none !important; }
          .viewing-hero-eyebrow {
            font-size: 10px !important;
            margin-bottom: 14px !important;
            text-shadow: 0 2px 10px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9) !important;
          }
          .viewing-hero-h1 { font-size: clamp(22px, 6.4vw, 30px) !important; line-height: 1.16 !important; }
          .viewing-hero-desc { font-size: 13px !important; max-width: none !important; margin-top: 14px !important; }
          .viewing-hero-btn { width: 100% !important; text-align: center !important; }
          .viewing-hero-cta-wrap { margin-top: 22px !important; }
          .viewing-hero-activity { margin-top: 16px !important; }
        }
      `}</style>
      <section
        id="viewing-hero"
        data-theme="dark"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '760px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Background — rotating Ken Burns carousel, per breakpoint */}
        <motion.div
          className="viewing-hero-bg"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <KenBurnsCarousel
            images={isMobile ? MOBILE_IMAGES : DESKTOP_IMAGES}
            alt="A completed Sovran home extension"
            interval={6500}
            fadeDuration={1.2}
            zoomScale={1.09}
            panX={-2.5}
            panY={-1.5}
          />
        </motion.div>

        {/* Gradient overlay — light enough for the photo to read clearly, just enough contrast
            at the bottom-left for the eyebrow/headline/body text to stay legible. Mobile gets
            a slightly stronger stack so the eyebrow line stays legible against the rotating images. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isMobile
              ? 'linear-gradient(0deg, rgba(10,10,10,0.82) 0%, rgba(10,10,10,0.52) 45%, rgba(10,10,10,0.18) 75%, rgba(10,10,10,0) 100%)'
              : 'linear-gradient(0deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.3) 40%, rgba(10,10,10,0.05) 70%, rgba(10,10,10,0) 100%)',
          }}
        />

        {/* Content — anchored bottom-left, asymmetrical */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
          }}
        >
          <div
            className="viewing-hero-content"
            style={{
              padding: '0 clamp(24px, 6vw, 90px) clamp(56px, 9vh, 110px)',
              maxWidth: '940px',
            }}
          >
            <motion.p
              className="viewing-hero-eyebrow"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                color: '#c9a96e',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              For Homeowners Planning An Extension, Renovation Or New Build
            </motion.p>

            <motion.h1
              className="viewing-hero-h1"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(34px, 4.6vw, 64px)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.05,
                letterSpacing: '-0.015em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Private Viewing Of A Completed Project
            </motion.h1>

            <motion.p
              className="viewing-hero-desc"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45 }}
              style={{
                fontSize: 'clamp(15px, 1.3vw, 18px)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.72)',
                margin: '28px 0 0',
                lineHeight: 1.7,
                letterSpacing: 'normal',
              }}
            >
              If you&apos;re planning your next design and build project, this is the inspiration you need. Walk through a finished home, see the real layout and standard of work we carry out, and speak directly with the specialist who delivered it.
            </motion.p>

            <motion.div
              className="viewing-hero-cta-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{ marginTop: '44px' }}
            >
              <button
                onClick={scrollToForm}
                className="viewing-hero-btn"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '18px 44px',
                  cursor: 'pointer',
                  backgroundColor: '#ffffff',
                  color: '#0a0a0a',
                  border: '1px solid #ffffff',
                  transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#c9a96e';
                  e.currentTarget.style.borderColor = '#c9a96e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#ffffff';
                }}
              >
                Register Your Interest
              </button>
            </motion.div>

            <ActivityLine />
          </div>
        </div>
      </section>
    </>
  );
}

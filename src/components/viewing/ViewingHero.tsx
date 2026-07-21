import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ImageCarousel from './ImageCarousel';

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
          .viewing-hero-content { padding: 0 24px 64px !important; max-width: none !important; }
          .viewing-hero-h1 { font-size: clamp(32px, 10vw, 48px) !important; }
          .viewing-hero-desc { font-size: 14px !important; max-width: none !important; }
          .viewing-hero-btn { width: 100% !important; text-align: center !important; }
        }
      `}</style>
      <section
        id="viewing-hero"
        style={{
          position: 'relative',
          height: '100vh',
          minHeight: '760px',
          width: '100%',
          overflow: 'hidden',
          backgroundColor: '#0a0a0a',
        }}
      >
        {/* Background */}
        <motion.div
          className="viewing-hero-bg"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: 'easeOut' }}
          style={{ position: 'absolute', inset: 0 }}
        >
          <ImageCarousel
            images={isMobile ? MOBILE_IMAGES : DESKTOP_IMAGES}
            alt="A completed Sovran home extension"
            interval={5000}
          />
        </motion.div>

        {/* Gradient overlay — near-transparent up top for negative space, dark toward the bottom-left text block.
            Mobile gets a heavier, higher-reaching overlay so the eyebrow/headline stay legible across all rotating images. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: isMobile
              ? 'linear-gradient(0deg, rgba(10,10,10,0.96) 0%, rgba(10,10,10,0.88) 42%, rgba(10,10,10,0.4) 72%, rgba(10,10,10,0.12) 100%)'
              : 'linear-gradient(0deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.5) 38%, rgba(10,10,10,0.05) 68%, rgba(10,10,10,0) 100%)',
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
              maxWidth: '1180px',
            }}
          >
            <motion.p
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
              A Private Home Viewing Experience
            </motion.p>

            <motion.h1
              className="viewing-hero-h1"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(40px, 6.2vw, 88px)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1,
                letterSpacing: '-0.015em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
                maxWidth: '1100px',
              }}
            >
              Private Viewing of a Completed Home Extension
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
                maxWidth: '480px',
                margin: '28px 0 0',
                lineHeight: 1.7,
                letterSpacing: 'normal',
              }}
            >
              A rare walkthrough of a finished Sovran project, guided by one of our Design &amp; Build Specialists. Not photographs. Not a brochure. The real space, as it was made to be lived in.
            </motion.p>

            <motion.div
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
          </div>
        </div>
      </section>
    </>
  );
}

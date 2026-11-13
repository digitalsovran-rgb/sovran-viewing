import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import KenBurnsCarousel from './KenBurnsCarousel';
import ActivityLine from './ActivityLine';

const DESKTOP_IMAGES = ['/media/hero.webp', '/media/hero2.webp?v=2', '/media/hero3.webp?v=2'];

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
            font-size: 11px !important;
            margin-bottom: 14px !important;
            text-shadow: 0 2px 10px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.9) !important;
          }
          .viewing-hero-h1 { font-size: clamp(25px, 7.2vw, 34px) !important; line-height: 1.16 !important; }
          .viewing-hero-desc { font-size: 14.5px !important; max-width: none !important; margin-top: 14px !important; }
          .viewing-hero-btn { width: 100% !important; text-align: center !important; }
          .viewing-hero-cta-wrap { margin-top: 22px !important; }
          .viewing-hero-logo-wrap { top: 24px !important; }
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
          backgroundColor: 'var(--sov-black)',
        }}
      >
        {/* Background: a muted looping video on mobile (poster shown until it plays), the
            rotating Ken Burns carousel on desktop. No entrance fade on this wrapper, since it
            sits directly behind the LCP candidate. */}
        <div className="viewing-hero-bg" style={{ position: 'absolute', inset: 0 }}>
          {isMobile ? (
            <video
              // React only sets `muted` as a property; iOS Safari needs the attribute to autoplay.
              ref={(el) => {
                if (el) {
                  el.defaultMuted = true;
                  el.setAttribute('muted', '');
                }
              }}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/media/herovidph-poster.webp"
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            >
              <source src="/media/herovidph.webm" type="video/webm" />
            </video>
          ) : (
            <KenBurnsCarousel
              images={DESKTOP_IMAGES}
              alt="A completed Sovran home extension"
              interval={6500}
              fadeDuration={1.2}
              zoomScale={1.09}
              panX={-2.5}
              panY={-1.5}
            />
          )}
        </div>

        {/* Gradient overlay: light enough for the photo to read clearly, just enough contrast
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

        {/* Wordmark: centered near the top, independent of the bottom-anchored text block.
            Centered via a flex wrapper rather than transform: translateX(-50%), since Framer
            Motion manages the transform property itself for the y-animation on the image. */}
        <div
          className="viewing-hero-logo-wrap"
          style={{
            position: 'absolute',
            top: 'clamp(28px, 5vh, 56px)',
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <motion.img
            className="viewing-hero-logo"
            src="/media/logo-sovran-white.webp"
            alt="Sovran"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ width: '120px', height: 'auto' }}
          />
        </div>

        {/* Content: anchored bottom-left, asymmetrical */}
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
                fontSize: '13.5px',
                fontWeight: 600,
                letterSpacing: '0.22em',
                color: 'var(--sov-greige-light)',
                textTransform: 'uppercase',
                marginBottom: '20px',
              }}
            >
              For Homeowners Planning A Design And Build Project
            </motion.p>

            <motion.h1
              className="viewing-hero-h1"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
              style={{
                fontSize: 'clamp(38px, 5.2vw, 72px)',
                fontWeight: 900,
                color: 'var(--sov-white)',
                lineHeight: 1.05,
                letterSpacing: '-0.015em',
                textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              A Private Viewing Of A Completed Sovran Home
            </motion.h1>

            {/* Plain, unanimated: this is the confirmed LCP element (per live Lighthouse trace).
                Its entrance fade was responsible for ~95% of total LCP render delay. */}
            <p
              className="viewing-hero-desc"
              style={{
                fontSize: 'clamp(17px, 1.45vw, 20px)',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.72)',
                margin: '28px 0 0',
                lineHeight: 1.7,
                letterSpacing: 'normal',
                textAlign: 'justify',
              }}
            >
              Before committing to your own plans, see one of our finished properties in person. A Sovran design and build specialist will guide you through the layout, the materials and the decisions behind each room, and answer the questions your project raises.
            </p>

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
                  backgroundColor: 'var(--sov-white)',
                  color: 'var(--sov-black)',
                  border: '1px solid var(--sov-white)',
                  transition: 'background-color 0.3s, border-color 0.3s, color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sov-greige-light)';
                  e.currentTarget.style.borderColor = 'var(--sov-greige-light)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--sov-white)';
                  e.currentTarget.style.borderColor = 'var(--sov-white)';
                }}
              >
                Request A Viewing
              </button>
            </motion.div>

            <ActivityLine />
          </div>
        </div>
      </section>
    </>
  );
}

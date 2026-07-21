import { useState, useEffect } from 'react';
import ViewingHero from './components/viewing/ViewingHero';
import ViewingExperience from './components/viewing/ViewingExperience';
import ViewingSpecialist from './components/viewing/ViewingSpecialist';
import ViewingAbout from './components/viewing/ViewingAbout';
import SiteVisitForm from './components/viewing/SiteVisitForm';
import Footer from './components/Footer';

function FloatingCTA() {
  const [hovered, setHovered] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    const form = document.getElementById('viewing-form');
    if (form) {
      const o = new IntersectionObserver(([e]) => setFormVisible(e.isIntersecting), { threshold: 0.1 });
      o.observe(form);
      observers.push(o);
    }

    const hero = document.getElementById('viewing-hero');
    if (hero) {
      const o = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
      o.observe(hero);
      observers.push(o);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const shouldShow = !formVisible && !(heroVisible && isMobile);

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .floating-cta { bottom: 16px !important; right: 16px !important; padding: 10px 16px !important; font-size: 11px !important; }
        }
      `}</style>
      <button
        type="button"
        className="floating-cta"
        onClick={() => {
          document.getElementById('viewing-form')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          padding: '16px 28px',
          backgroundColor: hovered ? '#c9a96e' : '#0a0a0a',
          color: hovered ? '#0a0a0a' : '#f5f0eb',
          border: '2px solid #f5f0eb',
          borderRadius: 0,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontSize: '13px',
          fontWeight: 700,
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          opacity: shouldShow ? 1 : 0,
          pointerEvents: shouldShow ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, background-color 0.3s ease, color 0.3s ease',
        }}
      >
        Get In Touch
      </button>
    </>
  );
}

export default function App() {
  return (
    <>
      <ViewingHero />
      <ViewingExperience />
      <ViewingSpecialist />
      <ViewingAbout />
      <SiteVisitForm />
      <Footer />
      <FloatingCTA />
    </>
  );
}

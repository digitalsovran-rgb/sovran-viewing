import { useState, useEffect } from 'react';
import ViewingHero from './components/viewing/ViewingHero';
import ViewingExperience from './components/viewing/ViewingExperience';
import ViewingSpecialist from './components/viewing/ViewingSpecialist';
import ViewingAbout from './components/viewing/ViewingAbout';
import SiteVisitForm from './components/viewing/SiteVisitForm';
import Footer from './components/Footer';

function StickyCTABar() {
  const [heroVisible, setHeroVisible] = useState(true);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const hero = document.getElementById('viewing-hero');
    if (!hero) return;
    const o = new IntersectionObserver(([e]) => setHeroVisible(e.isIntersecting), { threshold: 0 });
    o.observe(hero);
    return () => o.disconnect();
  }, []);

  return (
    <button
      type="button"
      className="sticky-cta-bar"
      onClick={() => {
        document.getElementById('viewing-form')?.scrollIntoView({ behavior: 'smooth' });
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        zIndex: 100,
        backgroundColor: '#0a0a0a',
        color: hovered ? '#c9a96e' : '#ffffff',
        border: 'none',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        padding: '20px 24px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textAlign: 'center',
        cursor: 'pointer',
        transform: heroVisible ? 'translateY(100%)' : 'translateY(0)',
        transition: 'transform 0.4s ease, color 0.2s ease',
      }}
    >
      Register Your Interest
    </button>
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
      <StickyCTABar />
    </>
  );
}

import { useState, useEffect } from 'react';
import ViewingHero from './components/viewing/ViewingHero';
import ViewingExperience from './components/viewing/ViewingExperience';
import ViewingSpecialist from './components/viewing/ViewingSpecialist';
import ViewingAbout from './components/viewing/ViewingAbout';
import SiteVisitForm from './components/viewing/SiteVisitForm';
import Footer from './components/Footer';

type SectionTheme = 'dark' | 'light';

function FloatingCTA() {
  const [hovered, setHovered] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  const [heroVisible, setHeroVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth < 768);
  const [theme, setTheme] = useState<SectionTheme>('dark');

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

  // Tracks which section sits behind the button's fixed screen position, so its
  // colors can invert to stay legible against both cream and dark sections.
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'));
      const targetY = window.scrollY + window.innerHeight - 40;
      let current: SectionTheme = 'dark';
      for (const el of sections) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        const bottom = top + el.offsetHeight;
        if (targetY >= top && targetY < bottom) {
          current = el.dataset.theme === 'light' ? 'light' : 'dark';
          break;
        }
      }
      setTheme(current);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Section boundaries shift as images finish loading (no scroll event fires for that),
    // so also recompute whenever the page's rendered height changes.
    const resizeObserver = new ResizeObserver(onScroll);
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const shouldShow = !formVisible && !(heroVisible && isMobile);

  // Over a light (cream) section the button reads solid black-on-white-text;
  // over a dark section it flips to a white/cream outline treatment.
  const isOverLight = theme === 'light';
  const baseBg = isOverLight ? '#0a0a0a' : '#ffffff';
  const baseColor = isOverLight ? '#ffffff' : '#0a0a0a';
  const baseBorder = isOverLight ? '#0a0a0a' : '#ffffff';

  return (
    <>
      <style>{`
        @media (max-width: 767px) {
          .floating-cta {
            bottom: 16px !important;
            right: 16px !important;
            left: 16px !important;
            width: auto !important;
            padding: 18px 32px !important;
          }
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
          padding: '18px 44px',
          backgroundColor: hovered ? '#c9a96e' : baseBg,
          color: hovered ? '#0a0a0a' : baseColor,
          border: `1px solid ${hovered ? '#c9a96e' : baseBorder}`,
          borderRadius: 0,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          fontSize: '14px',
          fontWeight: 500,
          fontFamily: 'Inter, sans-serif',
          textTransform: 'uppercase',
          textAlign: 'center',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          opacity: shouldShow ? 1 : 0,
          pointerEvents: shouldShow ? 'auto' : 'none',
          transition: 'opacity 0.3s ease, background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease',
        }}
      >
        Book Your Place
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

import { useState, useEffect, useRef } from 'react';
import ViewingHero from './components/viewing/ViewingHero';
import ViewingExperience from './components/viewing/ViewingExperience';
import ViewingSpecialist from './components/viewing/ViewingSpecialist';
import ViewingAbout from './components/viewing/ViewingAbout';
import SiteVisitForm from './components/viewing/SiteVisitForm';
import Footer from './components/Footer';

type SectionTheme = 'dark' | 'light';

function StickyCTABar() {
  const barRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [heroPast, setHeroPast] = useState(false);
  const [formOrFooterVisible, setFormOrFooterVisible] = useState(false);
  const [theme, setTheme] = useState<SectionTheme>('dark');

  // Hero visibility — the bar is allowed to appear once the hero has scrolled out of view.
  useEffect(() => {
    const hero = document.getElementById('viewing-hero');
    if (!hero) return;
    const o = new IntersectionObserver(([e]) => setHeroPast(!e.isIntersecting), { threshold: 0 });
    o.observe(hero);
    return () => o.disconnect();
  }, []);

  // Form/footer visibility — the bar is fully unmounted once either comes into view.
  useEffect(() => {
    const form = document.getElementById('viewing-form');
    const footer = document.querySelector<HTMLElement>('footer');
    const targets = [form, footer].filter((el): el is HTMLElement => el !== null);
    if (targets.length === 0) return;
    const o = new IntersectionObserver(
      (entries) => setFormOrFooterVisible(entries.some((e) => e.isIntersecting)),
      { threshold: 0 }
    );
    targets.forEach((t) => o.observe(t));
    return () => o.disconnect();
  }, []);

  // Color adaptation — an IntersectionObserver whose root is shrunk down to just the thin
  // strip of the viewport the bar occupies, so whichever section dominates that strip
  // determines the bar's colors. This self-corrects on any layout change, not just scroll.
  //
  // Each callback batch only contains entries whose intersection changed since the last
  // batch, not every currently-intersecting section — so a persistent map (rather than
  // reading straight off the batch) is required to track what's actually still visible.
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-theme]'));
    if (sections.length === 0) return;

    const state = new Map<Element, { theme: SectionTheme; height: number }>();
    let observer: IntersectionObserver;

    const recomputeTheme = () => {
      const best = Array.from(state.values()).reduce<{ theme: SectionTheme; height: number } | null>(
        (acc, cur) => (!acc || cur.height > acc.height ? cur : acc),
        null
      );
      if (best) setTheme(best.theme);
    };

    const build = () => {
      const barHeight = barRef.current?.offsetHeight || 64;
      const topExclude = Math.max(window.innerHeight - barHeight, 0);
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const t: SectionTheme = (entry.target as HTMLElement).dataset.theme === 'light' ? 'light' : 'dark';
              state.set(entry.target, { theme: t, height: entry.intersectionRect.height });
            } else {
              state.delete(entry.target);
            }
          });
          recomputeTheme();
        },
        { rootMargin: `-${topExclude}px 0px 0px 0px`, threshold: [0, 0.05, 0.25, 0.5, 0.75, 1] }
      );
      sections.forEach((el) => observer.observe(el));
    };

    build();

    const handleResize = () => {
      observer.disconnect();
      state.clear();
      build();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (formOrFooterVisible) return null;

  const isOverDark = theme === 'dark';
  const bg = isOverDark ? '#ffffff' : '#0a0a0a';
  const color = isOverDark ? '#0a0a0a' : '#ffffff';

  return (
    <button
      ref={barRef}
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
        backgroundColor: hovered ? '#c9a96e' : bg,
        color: hovered ? '#0a0a0a' : color,
        border: 'none',
        borderTop: '1px solid rgba(128,128,128,0.15)',
        padding: '20px 24px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textAlign: 'center',
        cursor: 'pointer',
        transform: heroPast ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.4s ease, background-color 0.25s ease, color 0.25s ease',
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

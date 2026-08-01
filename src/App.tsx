import { useState, useEffect, useRef } from 'react';
import { getSlotCount } from './utils/slotCount';
import ViewingHero from './components/viewing/ViewingHero';
import ViewingExperience from './components/viewing/ViewingExperience';
import ViewingSpecialist from './components/viewing/ViewingSpecialist';
import ViewingAbout from './components/viewing/ViewingAbout';
import SiteVisitForm from './components/viewing/SiteVisitForm';
import Footer from './components/Footer';

type SectionTheme = 'dark' | 'light';

const BAR_BOTTOM_OFFSET = 20;

function StickyCTABar() {
  const barRef = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);
  const [heroPast, setHeroPast] = useState(false);
  const [pastFormTop, setPastFormTop] = useState(false);
  const [theme, setTheme] = useState<SectionTheme>('dark');

  // Visibility — a single scroll-position check against two fixed document-space boundaries
  // (the hero's bottom edge and the form's top edge), recomputed fresh on every scroll rather
  // than relying on independent per-section IntersectionObserver entries. That per-section
  // approach was the source of the flicker/reappear bug: multiple observers (form, footer)
  // could independently toggle visibility while scrolling within either section.
  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const hero = document.getElementById('viewing-hero');
      const form = document.getElementById('viewing-form');
      if (!hero || !form) return;

      const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
      const formTop = form.getBoundingClientRect().top + window.scrollY;
      const viewportTop = window.scrollY;
      const viewportBottom = window.scrollY + window.innerHeight;

      setHeroPast(viewportTop >= heroBottom);
      setPastFormTop(viewportBottom >= formTop);
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
      const barHeight = barRef.current?.offsetHeight || 60;
      const topExclude = Math.max(window.innerHeight - barHeight - BAR_BOTTOM_OFFSET, 0);
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

  if (pastFormTop) return null;

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
        left: '50%',
        bottom: `${BAR_BOTTOM_OFFSET}px`,
        zIndex: 100,
        maxWidth: 'calc(100% - 40px)',
        backgroundColor: hovered ? color : bg,
        color: hovered ? bg : color,
        border: 'none',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.28)',
        padding: '12px 40px',
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 600,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transform: `translateX(-50%) ${heroPast ? 'translateY(0)' : 'translateY(150%)'}`,
        transition: 'transform 0.4s ease, background-color 0.25s ease, color 0.25s ease',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <span>Register Your Interest</span>
        <span style={{ fontSize: '8px', opacity: 0.8, marginTop: '5px' }}>
          {getSlotCount()} slots left.
        </span>
      </div>
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

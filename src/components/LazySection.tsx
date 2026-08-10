import { Suspense, useEffect, useRef, useState, type ComponentType } from 'react';

// Defers both mounting AND the underlying React.lazy import() until the section is within
// `rootMargin` of the viewport, so below-the-fold JS (e.g. Footer's gsap/ScrollTrigger)
// doesn't download and execute immediately on page load regardless of scroll position.
// The placeholder's height should approximate the real section's rendered height so the
// swap-in happens before the user scrolls close enough to see it, avoiding a layout jump.
export default function LazySection({
  component: Component,
  minHeight,
}: {
  component: ComponentType;
  minHeight: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible]);

  if (!visible) {
    return <div ref={ref} style={{ minHeight }} />;
  }

  return (
    <Suspense fallback={<div style={{ minHeight }} />}>
      <Component />
    </Suspense>
  );
}

import { Suspense, useEffect, useRef, useState, type ComponentType } from 'react';

// Defers both mounting AND the underlying React.lazy import() until the section is within
// `rootMargin` of the viewport, so below-the-fold JS (e.g. Footer's gsap/ScrollTrigger)
// doesn't download and execute immediately on page load regardless of scroll position.
// The placeholder's height should approximate the real section's rendered height so the
// swap-in happens before the user scrolls close enough to see it, avoiding a layout jump.
//
// `id`, when passed, lives on the OUTER wrapper — which never unmounts — rather than on the
// placeholder or the real component individually. That gives anything doing
// document.getElementById(id)?.scrollIntoView(...) a stable target the whole time: before the
// section has mounted, while it's loading, and after the real content swaps in. Putting the id
// only on the placeholder (or only on the real component) leaves a window where the target
// doesn't exist yet, or — worse — where a smooth scroll started against one node gets orphaned
// when that node unmounts mid-animation and is replaced by a different element with the same id.
export default function LazySection({
  component: Component,
  minHeight,
  id,
}: {
  component: ComponentType;
  minHeight: number;
  id?: string;
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

  return (
    <div ref={ref} id={id}>
      {visible ? (
        <Suspense fallback={<div style={{ minHeight }} />}>
          <Component />
        </Suspense>
      ) : (
        <div style={{ minHeight }} />
      )}
    </div>
  );
}

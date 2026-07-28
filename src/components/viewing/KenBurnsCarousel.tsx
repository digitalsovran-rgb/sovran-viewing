import { useEffect, useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function KenBurnsCarousel({
  images,
  alt,
  interval = 6500,
  fadeDuration = 1.2,
  zoomScale = 1.09,
  panX = -2.5,
  panY = -1.5,
}: {
  images: string[];
  alt: string;
  interval?: number;
  fadeDuration?: number;
  zoomScale?: number;
  panX?: number;
  panY?: number;
}) {
  const [index, setIndex] = useState(0);
  const animName = `kenburns-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [images.length, interval]);

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <style>{`
        @keyframes ${animName} {
          0% { transform: scale(1) translate(0%, 0%); }
          100% { transform: scale(${zoomScale}) translate(${panX}%, ${panY}%); }
        }
      `}</style>
      <AnimatePresence>
        <motion.div
          key={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeDuration, ease: 'easeInOut' }}
          style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
        >
          <img
            src={images[index]}
            alt={alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              animation: `${animName} ${interval}ms ease-out forwards`,
              willChange: 'transform',
            }}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// A single static image with a continuous, slow breathing zoom (in, then back out, on loop) —
// used where a section has only one image and doesn't need the cross-fade/rotation logic above.
export function KenBurnsStatic({
  src,
  alt,
  duration = 14,
  zoomScale = 1.08,
}: {
  src: string;
  alt: string;
  duration?: number;
  zoomScale?: number;
}) {
  const animName = `kenburns-static-${useId().replace(/[^a-zA-Z0-9]/g, '')}`;

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <style>{`
        @keyframes ${animName} {
          0% { transform: scale(1); }
          100% { transform: scale(${zoomScale}); }
        }
      `}</style>
      <img
        src={src}
        alt={alt}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          animation: `${animName} ${duration}s ease-in-out infinite alternate`,
          willChange: 'transform',
        }}
      />
    </div>
  );
}

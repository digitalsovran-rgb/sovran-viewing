import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const NAV_COLUMNS = [
  {
    label: 'Services',
    links: [
      { text: 'Architecture', href: 'https://sovrangroup.co.uk/architecture' },
      { text: 'Construction', href: 'https://sovrangroup.co.uk/construction' },
      { text: 'Interiors', href: 'https://sovrangroup.co.uk/interiors' },
    ],
  },
  {
    label: 'Company',
    links: [
      { text: 'About Us', href: 'https://sovrangroup.co.uk/about' },
      { text: 'Contact', href: 'https://sovrangroup.co.uk/contact' },
      { text: 'Resources', href: 'https://sovrangroup.co.uk/resources' },
    ],
  },
  {
    label: 'Get Started',
    links: [
      { text: 'Cost Calculator', href: 'https://sovrangroup.co.uk/cost-calculator' },
      { text: 'Email Us', href: 'mailto:info@sovrangroup.co.uk' },
      { text: 'Call Us', href: 'tel:+442079460958' },
      { text: 'WhatsApp Us', href: 'https://wa.me/442079460958' },
    ],
  },
  {
    label: 'Legal',
    links: [
      { text: 'Privacy Policy', href: 'https://sovrangroup.co.uk/privacy-policy' },
      { text: 'Terms of Service', href: 'https://sovrangroup.co.uk/terms' },
    ],
  },
];

const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const HouzzIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M13.5 2L3 8.25V21h7.5v-6H13.5v6H21V8.25L13.5 2zm0 2.44L19.5 9v10.5H15v-6H12v6H7.5V9l6-4.56z" />
  </svg>
);

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/sovrangroup', Icon: InstagramIcon },
  { label: 'Facebook', href: 'https://facebook.com/sovrangroup', Icon: FacebookIcon },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/sovrangroup', Icon: LinkedInIcon },
  { label: 'Houzz', href: 'https://houzz.co.uk/sovrangroup', Icon: HouzzIcon },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const topLineRef = useRef<HTMLDivElement>(null);
  const sMonogramRef = useRef<HTMLImageElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Vertically center the S monogram via GSAP so it stays within GSAP's transform system
      gsap.set(sMonogramRef.current, { yPercent: -50 });

      // Top separator line reveal
      gsap.from(topLineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: topLineRef.current,
          toggleActions: 'play none none none',
        },
      });

      // S monogram: entrance + continuous pulse after
      gsap.timeline({
        scrollTrigger: {
          trigger: footerRef.current,
          toggleActions: 'play none none none',
        },
        onComplete() {
          gsap.to(sMonogramRef.current, {
            opacity: 0.12,
            duration: 3,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
          });
        },
      }).from(sMonogramRef.current, {
        opacity: 0,
        scale: 0.85,
        rotation: -5,
        duration: 2.5,
        ease: 'power3.out',
      });

      // S monogram: parallax on scroll
      gsap.to(sMonogramRef.current, {
        y: -80,
        ease: 'none',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      });

      // Logo: clip-path left-to-right reveal
      gsap.fromTo(
        logoRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        {
          clipPath: 'inset(0 0% 0 0)',
          duration: 1.4,
          ease: 'power4.inOut',
          scrollTrigger: {
            trigger: logoRef.current,
            toggleActions: 'play none none none',
          },
        },
      );

      // Nav labels, links, tagline — staggered fade + slide up
      gsap.from('.footer-animate', {
        opacity: 0,
        y: 20,
        stagger: 0.05,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          toggleActions: 'play none none none',
        },
      });

      // Bottom separator line reveal
      gsap.from(bottomLineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1,
        delay: 0.3,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: bottomLineRef.current,
          toggleActions: 'play none none none',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <>
      <style>{`
        .footer-link {
          display: block;
          font-family: Inter, sans-serif;
          font-weight: 300;
          font-size: clamp(15px, 1.1vw, 19px);
          color: rgba(245,240,235,0.45);
          text-decoration: none;
          margin-bottom: clamp(12px, 1.5vh, 20px);
          transition: color 0.3s ease, transform 0.3s ease;
          will-change: transform;
        }
        .footer-link:hover {
          color: #f5f0eb;
          transform: translateX(8px);
        }
        .footer-social-icon {
          display: flex;
          align-items: center;
          color: rgba(245,240,235,0.35);
          transition: color 0.3s ease;
          text-decoration: none;
        }
        .footer-social-icon:hover { color: #f5f0eb; }
        .footer-backtop-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(245,240,235,0.15);
          background: transparent;
          color: rgba(245,240,235,0.5);
          font-family: Inter, sans-serif;
          font-weight: 300;
          font-size: clamp(10px, 0.75vw, 12px);
          letter-spacing: 0.2em;
          text-transform: uppercase;
          padding: 10px 20px;
          cursor: pointer;
          transition: color 0.3s ease, border-color 0.3s ease, background-color 0.3s ease;
        }
        .footer-backtop-btn:hover {
          color: #f5f0eb;
          border-color: rgba(245,240,235,0.4);
          background-color: rgba(245,240,235,0.05);
        }
        @media (max-width: 768px) {
          .footer-top-row {
            flex-direction: column !important;
            align-items: flex-start !important;
          }
          .footer-tagline {
            text-align: left !important;
            margin-top: 24px !important;
          }
          .footer-nav-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
          .footer-bottom-bar {
            flex-direction: column !important;
            gap: 16px !important;
          }
        }
      `}</style>

      <footer
        ref={footerRef}
        style={{
          backgroundColor: '#0a0a0a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* S monogram background */}
        <img
          ref={sMonogramRef}
          src="/media/logo-s-white.png"
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: '-5%',
            top: '50%',
            width: 'clamp(400px, 50vw, 800px)',
            opacity: 0.08,
            pointerEvents: 'none',
            userSelect: 'none',
            zIndex: 0,
          }}
        />

        {/* Top separator line */}
        <div
          ref={topLineRef}
          style={{
            height: '1px',
            backgroundColor: 'rgba(245,240,235,0.08)',
            marginLeft: 'clamp(32px, 6vw, 120px)',
            marginRight: 'clamp(32px, 6vw, 120px)',
            position: 'relative',
            zIndex: 1,
          }}
        />

        {/* TOP SECTION — logo + tagline */}
        <div
          className="footer-top-row"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: 'clamp(60px, 8vh, 120px) clamp(32px, 6vw, 120px) clamp(48px, 6vh, 80px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <img
            ref={logoRef}
            src="/media/logo-sovran-white.png"
            alt="Sovran"
            style={{
              height: 'clamp(40px, 5vw, 90px)',
              display: 'block',
            }}
          />
          <p
            className="footer-tagline footer-animate"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(12px, 0.9vw, 15px)',
              color: 'rgba(245,240,235,0.3)',
              maxWidth: '280px',
              textAlign: 'right',
              lineHeight: 1.7,
              margin: 0,
            }}
          >
            Bespoke architecture, build, and interiors — extending London homes, done properly.
          </p>
        </div>

        {/* MIDDLE SECTION — 4 column nav */}
        <div
          style={{
            borderTop: '1px solid rgba(245,240,235,0.05)',
            padding: 'clamp(48px, 6vh, 80px) clamp(32px, 6vw, 120px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            className="footer-nav-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
            }}
          >
            {NAV_COLUMNS.map((col, ci) => (
              <div
                key={col.label}
                style={{
                  borderLeft: ci > 0 ? '1px solid rgba(245,240,235,0.05)' : 'none',
                  paddingLeft: ci > 0 ? 'clamp(24px, 3vw, 48px)' : 0,
                  paddingRight: ci < NAV_COLUMNS.length - 1 ? 'clamp(24px, 3vw, 48px)' : 0,
                }}
              >
                <p
                  className="footer-animate"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 400,
                    fontSize: 'clamp(9px, 0.7vw, 11px)',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    color: 'rgba(245,240,235,0.2)',
                    margin: '0 0 clamp(20px, 2.5vh, 36px) 0',
                  }}
                >
                  {col.label}
                </p>
                {col.links.map((link) => (
                  <a
                    key={link.text}
                    href={link.href}
                    className="footer-link footer-animate"
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  >
                    {link.text}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* SOCIAL LINKS ROW */}
        <div
          style={{
            borderTop: '1px solid rgba(245,240,235,0.05)',
            padding: 'clamp(24px, 3vh, 40px) clamp(32px, 6vw, 120px)',
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p
            className="footer-animate"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(9px, 0.7vw, 11px)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(245,240,235,0.2)',
              margin: 0,
              marginRight: 'auto',
            }}
          >
            Follow Us
          </p>
          {SOCIAL_LINKS.map(({ label, href, Icon }) => (
            <a
              key={label}
              href={href}
              className="footer-social-icon footer-animate"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon />
            </a>
          ))}
        </div>

        {/* Bottom separator line */}
        <div
          ref={bottomLineRef}
          style={{
            height: '1px',
            backgroundColor: 'rgba(245,240,235,0.05)',
            marginLeft: 'clamp(32px, 6vw, 120px)',
            marginRight: 'clamp(32px, 6vw, 120px)',
            position: 'relative',
            zIndex: 1,
          }}
        />

        {/* BOTTOM BAR */}
        <div
          className="footer-bottom-bar"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 'clamp(20px, 2.5vh, 32px) clamp(32px, 6vw, 120px)',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <p
            className="footer-animate"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300,
              fontSize: 'clamp(10px, 0.75vw, 12px)',
              color: 'rgba(245,240,235,0.18)',
              margin: 0,
            }}
          >
            &copy; 2026 Sovran Group Ltd. All rights reserved.
          </p>
          <button
            className="footer-backtop-btn footer-animate"
            onClick={scrollToTop}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 10V2M2 6l4-4 4 4" />
            </svg>
            Back to top
          </button>
        </div>
      </footer>
    </>
  );
}

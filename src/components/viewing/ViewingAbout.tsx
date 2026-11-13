// Review overlay on the image. Set REVIEW_READY to true once REVIEW_TEXT and REVIEW_NAME are
// filled in; while false, nothing is rendered on the image.
const REVIEW_READY: boolean = false;
const REVIEW_TEXT = '';
const REVIEW_NAME = '';

export default function ViewingAbout() {
  return (
    <>
      <style>{`
        .about-statement {
          text-align: center;
          max-width: 640px;
          font-size: 18px;
          line-height: 1.65;
          color: #0A0A0A;
          margin: 20px auto 0;
        }
        .about-image-wrap {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 48px auto 0;
          aspect-ratio: 16 / 9;
          overflow: hidden;
        }
        .about-image-wrap picture {
          display: block;
          width: 100%;
          height: 100%;
        }
        .about-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .about-review-text {
          font-size: 18px;
          line-height: 1.5;
          color: #FFFFFF;
          max-width: 560px;
        }
        @media (max-width: 767px) {
          .about-statement { font-size: 17px; }
          .about-image-wrap { aspect-ratio: 4 / 5; }
          .about-review-text { font-size: 16px; }
        }
      `}</style>
      <section data-theme="light" style={{ backgroundColor: '#C2B2A0', padding: '110px 0' }}>
        <div className="inner">
          <p
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
              fontSize: '13px',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: '#4A443C',
              marginBottom: '18px',
            }}
          >
            What We Stand For
          </p>

          <h2
            style={{
              textAlign: 'center',
              fontSize: 'clamp(32px, 3.8vw, 52px)',
              fontWeight: 900,
              color: '#0A0A0A',
              letterSpacing: '-0.01em',
              lineHeight: 1.08,
            }}
          >
            Designed To Be Remembered.
          </h2>

          <p className="about-statement">
            We believe a home should feel quietly exceptional long after the last trade has left. Since 2011, our design and build team has pursued that standard on each project, until the finished property feels unmistakably personal to the people who live there.
          </p>

          <div className="about-image-wrap">
            <picture>
              <source media="(max-width: 767px)" srcSet="/media/visitmob.webp" />
              <img src="/media/visitpc.webp" alt="A completed Sovran design and build project" loading="lazy" />
            </picture>

            {REVIEW_READY && (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: '40%',
                  background: 'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.75) 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  alignItems: 'flex-start',
                  padding: '28px',
                }}
              >
                <span aria-hidden="true" style={{ fontSize: '28px', lineHeight: 1, color: '#C2B2A0' }}>
                  &ldquo;
                </span>
                <p className="about-review-text">{REVIEW_TEXT}</p>
                <p
                  style={{
                    textTransform: 'uppercase',
                    fontSize: '12px',
                    letterSpacing: '0.16em',
                    color: '#C2B2A0',
                    marginTop: '12px',
                  }}
                >
                  {REVIEW_NAME}
                </p>
              </div>
            )}
          </div>

          <p
            style={{
              textAlign: 'center',
              marginTop: '20px',
              textTransform: 'uppercase',
              fontSize: '12px',
              letterSpacing: '0.16em',
              fontWeight: 600,
              color: '#4A443C',
            }}
          >
            4.9 Rated On Google
          </p>
        </div>
      </section>
    </>
  );
}

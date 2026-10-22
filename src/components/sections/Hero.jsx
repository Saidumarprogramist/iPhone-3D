export default function Hero({ onFilm }) {
  return (
    <section id="hero" data-chapter="0" className="hero-section">
      <div className="hero-topline">
        <span className="live-dot" /> INDEPENDENT DESIGN CONCEPT{' '}
        <span className="hero-edition">EDITION — 001 / 2026</span>
      </div>
      <div className="hero-wordmark" aria-hidden="true">
        AURA<span>ONE</span>
      </div>
      <div className="hero-copy">
        <p className="eyebrow reveal">Less device. More possibility.</p>
        <h1 data-lines>
          <span>Beyond</span>
          <span>
            the <em>ordinary.</em>
          </span>
        </h1>
        <p className="intro-copy reveal">
          Sculpted in titanium. Defined by light.
          <br />A different perspective on what comes next.
        </p>
        <div className="hero-actions reveal">
          <a className="btn-gold" href="#showroom">
            Enter the studio <span>↗</span>
          </a>
          <button className="film-link" onClick={onFilm}>
            <span className="play-icon">▶</span> Play the film <small>00:05</small>
          </button>
        </div>
      </div>
      <div className="hero-device-label">
        <span className="label-line" />
        <p>
          GRADE 5 TITANIUM<small>Precision in every contour.</small>
        </p>
      </div>
      <div className="hero-bottom">
        <a href="#chip">
          <span className="scroll-dot">↓</span> SCROLL TO DISCOVER
        </a>
        <span>FORM. FEEL. FUTURE.</span>
        <span>01 — 04</span>
      </div>
    </section>
  );
}

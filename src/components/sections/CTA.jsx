export default function CTA({ onOpen }) {
  return (
    <section id="cta" data-chapter="4" className="cta-section">
      <p className="eyebrow reveal">A CONCEPT. A CONVERSATION STARTER.</p>
      <h2 data-lines>
        <span>The future</span>
        <span>
          looks <em>different.</em>
        </span>
      </h2>
      <p className="story-description reveal">
        Good design doesn't just catch your eye.
        <br />
        It changes the way you see.
      </p>
      <button onClick={onOpen} className="btn-gold">
        Explore your configuration <span>↗</span>
      </button>
      <p className="concept-note">Independent portfolio concept. Not a product for sale.</p>
      <div className="cta-signature" aria-hidden="true">
        AURA ONE®
      </div>
    </section>
  );
}

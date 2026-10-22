export default function Chapter({ index, align }) {
  const engineering = index === 1;
  return (
    <section
      id={engineering ? 'chip' : 'camera'}
      data-chapter={index}
      className={`story-section ${align === 'right' ? 'story-right' : ''}`}
    >
      <div className="story-content">
        <p className="eyebrow reveal">
          <span className="section-number">0{index + 1} /</span>{' '}
          {engineering ? 'THE ART OF ENGINEERING' : 'A NEW WAY TO SEE'}
        </p>
        <h2 data-lines>
          {engineering ? (
            <>
              <span>Power.</span>
              <span>
                In its <em>purest</em>
              </span>
              <span>form.</span>
            </>
          ) : (
            <>
              <span>Find beauty</span>
              <span>
                in the <em>unseen.</em>
              </span>
            </>
          )}
        </h2>
        <p className="story-description reveal">
          {engineering
            ? 'An exercise in beautiful restraint. A brushed titanium shell meets a luminous edge-to-edge display. Nothing extra. Nothing overlooked.'
            : 'Chase the light. Get closer to the detail. A three-lens camera system imagined for the moments you never want to lose.'}
        </p>
        <div className="detail-grid reveal">
          {(engineering
            ? [
                ['Ti', 'GRADE 5', 'Lightness. With strength.'],
                ['120', 'HZ DISPLAY CONCEPT', 'Every movement, fluid.'],
              ]
            : [
                ['48', 'MP CAMERA CONCEPT', 'A different kind of detail.'],
                ['3', 'LENS SYSTEM', 'More ways to tell the story.'],
              ]
          ).map(([value, label, text]) => (
            <div key={label}>
              <strong>
                {value}
                <span>{value === 'Ti' ? ' / 22' : '+'}</span>
              </strong>
              <small>{label}</small>
              <p>{text}</p>
            </div>
          ))}
        </div>
        <a href="#showroom" className="text-link reveal">
          Make it yours <span>↗</span>
        </a>
      </div>
      <span className="vertical-caption" aria-hidden="true">
        {engineering ? 'PRECISION IS A FEELING.' : 'EVERY PERSPECTIVE MATTERS.'}
      </span>
    </section>
  );
}

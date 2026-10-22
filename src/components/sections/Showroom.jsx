import { finishes } from '../../constants';
import { state } from '../../store/experience';
export default function Showroom({ finishIndex, onChange, paused, onPause, dragRef, supported }) {
  const finish = finishes[finishIndex];
  return (
    <section id="showroom" data-chapter="3" className="showroom-section">
      <div className="studio-copy">
        <p className="eyebrow reveal">
          <span className="section-number">04 /</span> THE FINISH STUDIO
        </p>
        <h2 data-lines>
          <span>One form.</span>
          <span>
            Entirely <em>you.</em>
          </span>
        </h2>
        <p className="story-description reveal">
          Four expressions of titanium.
          <br />
          Find the one that feels like you.
        </p>
        <div className="finish-picker reveal" role="group" aria-label="Choose a titanium finish">
          {finishes.map((f, i) => (
            <button
              key={f.id}
              aria-label={f.name}
              aria-pressed={i === finishIndex}
              onClick={() => onChange(i)}
              style={{ '--swatch': f.dot }}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="finish-description" aria-live="polite">
          <span className="finish-counter">0{finishIndex + 1} / 04</span>
          <h3>{finish.name}</h3>
          <p>{finish.tagline}</p>
        </div>
        {supported && (
          <div className="studio-controls">
            <button
              onClick={() => {
                state.spin -= Math.PI / 4;
              }}
              aria-label="Rotate device left"
            >
              ←
            </button>
            <button onClick={onPause} aria-pressed={paused}>
              {paused ? 'Resume rotation' : 'Pause rotation'}
            </button>
            <button
              onClick={() => {
                state.spin += Math.PI / 4;
              }}
              aria-label="Rotate device right"
            >
              →
            </button>
          </div>
        )}
        <a href="#cta" className="text-link">
          Your concept, at a glance <span>↗</span>
        </a>
      </div>
      <div ref={dragRef} className="device-interaction" aria-hidden="true">
        <span className="orbit-ring" />
        <span className="drag-hint">{supported ? '↔  DRAG TO EXPLORE' : 'CLASSIC VIEW'}</span>
      </div>
      <div className="studio-footnote">
        DESIGNED TO BE EXPLORED.<span>360° OF POSSIBILITY.</span>
      </div>
    </section>
  );
}

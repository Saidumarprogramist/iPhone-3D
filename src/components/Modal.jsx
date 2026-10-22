import { useEffect, useRef, useState } from 'react';
import { finishes } from '../constants';
export default function Modal({ type, finishIndex, onClose }) {
  const dialog = useRef(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const finish = finishes[finishIndex];
  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const el = dialog.current;
    el.showModal();
    const cancel = (e) => {
      e.preventDefault();
      onClose();
    };
    el.addEventListener('cancel', cancel);
    return () => {
      el.removeEventListener('cancel', cancel);
      document.body.style.overflow = overflow;
      previous?.focus();
    };
  }, [onClose]);
  return (
    <dialog
      ref={dialog}
      className={`experience-modal ${type === 'film' ? 'film-modal' : ''}`}
      aria-labelledby="modal-title"
      onClick={(e) => {
        if (e.target === dialog.current) onClose();
      }}
    >
      <div className="modal-inner">
        <button className="modal-close" onClick={onClose} aria-label="Close dialog">
          ✕
        </button>
        <p className="eyebrow">
          AURA ONE / {type === 'film' ? 'MOTION STUDY' : 'YOUR CONFIGURATION'}
        </p>
        <h2 id="modal-title">{type === 'film' ? 'A study in light.' : finish.name}</h2>
        {type === 'film' ? (
          videoFailed ? (
            <p role="status">
              The film could not be loaded. Close this window to continue exploring the device.
            </p>
          ) : (
            <video
              controls
              autoPlay
              playsInline
              preload="metadata"
              onError={() => setVideoFailed(true)}
              src={`${import.meta.env.BASE_URL}assets/videos/hero.mp4`}
            />
          )
        ) : (
          <>
            <div className="summary-finish" style={{ '--swatch': finish.dot }}>
              <span>Λ</span>
            </div>
            <p>{finish.tagline}</p>
            <dl className="summary-specs">
              <div>
                <dt>Material</dt>
                <dd>Grade 5 titanium concept</dd>
              </div>
              <div>
                <dt>Display</dt>
                <dd>120 Hz edge-to-edge concept</dd>
              </div>
              <div>
                <dt>Camera</dt>
                <dd>Triple-lens concept</dd>
              </div>
            </dl>
            <p className="summary-note">
              This is an interactive design study, not a commercial product. Your configuration is a
              preview; no order or payment is collected.
            </p>
            <button className="btn-gold" onClick={onClose}>
              Keep exploring ↗
            </button>
          </>
        )}
      </div>
    </dialog>
  );
}

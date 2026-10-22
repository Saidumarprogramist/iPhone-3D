import { chapters } from '../../constants';

const c = chapters[4];

export default function CTA() {
  return (
    <section
      id="cta"
      data-chapter="4"
      className="relative min-h-[110dvh] flex flex-col justify-center text-center grain"
      aria-label={c.eyebrow}
    >
      <div className="screen-max-width px-5 sm:px-10">
        <p className="eyebrow reveal">{c.eyebrow}</p>
        <h2 className="display-xl mt-6" data-lines>
          {c.titleLines.map((line) => (
            <span key={line} className="block">
              {line === 'orbit.' ? <span className="grad-gold">{line}</span> : line}
            </span>
          ))}
        </h2>
        <p className="reveal mt-6 text-[15px] text-mist max-w-md mx-auto">{c.copy}</p>
        <div className="reveal mt-10 flex items-center justify-center gap-4 flex-wrap" data-delay="0.15">
          <a href="#hero" className="btn-gold text-base !px-9 !py-4">Pre-order now</a>
          <a href="#showroom" className="btn-ghost text-base !px-9 !py-4">Compare finishes</a>
        </div>
      </div>
    </section>
  );
}

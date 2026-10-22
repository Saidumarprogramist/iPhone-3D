/* Generic narrative chapter: eyebrow + big lines + copy, laid to
   one side so the persistent 3D device keeps breathing space. */
import { chapters } from '../../constants';

export default function Chapter({ index, align = 'left', extra }) {
  const c = chapters[index];
  const right = align === 'right';

  return (
    <section
      id={c.id}
      data-chapter={String(index)}
      className="relative min-h-[110dvh] flex items-center grain"
      aria-label={c.eyebrow}
    >
      <div className="screen-max-width px-5 sm:px-10 w-full">
        <div className={`max-w-xl ${right ? 'ml-auto text-right' : ''}`}>
          <p className="eyebrow reveal">{c.eyebrow}</p>
          <h2 className="display-l mt-5" data-lines>
            {c.titleLines.map((line) => (
              <span key={line} className="block">{line}</span>
            ))}
          </h2>
          <p className="reveal mt-6 text-[15px] leading-relaxed text-mist" data-delay="0.15">
            {c.copy}
          </p>
          {extra}
        </div>
      </div>
    </section>
  );
}

import { specs } from '../../constants';

export default function SpecsGrid() {
  return (
    <div className="reveal mt-12 grid grid-cols-2 sm:grid-cols-3 gap-px rounded-3xl overflow-hidden border border-white/[0.07] bg-white/[0.06]" data-delay="0.25">
      {specs.map((s) => (
        <div key={s.value} className="bg-ink-1 p-5 sm:p-7">
          <div className="display-m grad-gold">{s.value}</div>
          <div className="mt-2 text-xs leading-relaxed text-mist">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

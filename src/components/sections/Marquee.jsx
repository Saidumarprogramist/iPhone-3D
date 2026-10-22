import { marqueeWords } from '../../constants';

export default function Marquee() {
  const row = [...marqueeWords, ...marqueeWords];
  return (
    <div
      className="relative overflow-hidden border-y border-white/[0.06] py-4 bg-ink-1/40 backdrop-blur-sm"
      aria-hidden="true"
    >
      <div className="marquee-track flex w-max gap-14 whitespace-nowrap">
        {row.map((w, i) => (
          <span key={i} className="text-[11px] tracking-[0.35em] uppercase text-mist flex items-center gap-14">
            {w}
            <span className="w-1 h-1 rounded-full bg-gold/70" />
          </span>
        ))}
      </div>
    </div>
  );
}

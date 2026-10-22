import { BRAND } from '../constants';

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] bg-ink-0/80 backdrop-blur-xl">
      <div className="screen-max-width px-5 sm:px-10 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="grid place-items-center w-6 h-6 rounded-full border border-gold/60 text-gold text-[10px] font-bold">A</span>
          <span className="text-xs tracking-[0.3em] uppercase text-mist">{BRAND}</span>
        </div>
        <nav aria-label="Footer" className="flex gap-6 text-xs text-mist">
          <a href="#hero" className="link-underline hover:text-snow transition-colors">Design</a>
          <a href="#chip" className="link-underline hover:text-snow transition-colors">Performance</a>
          <a href="#camera" className="link-underline hover:text-snow transition-colors">Camera</a>
          <a href="#showroom" className="link-underline hover:text-snow transition-colors">Showroom</a>
        </nav>
        <p className="text-[11px] text-mist/70">
          Fictional concept · React Three Fiber · GSAP · No real product affiliation
        </p>
      </div>
    </footer>
  );
}

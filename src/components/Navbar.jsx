import { useEffect, useState } from 'react';
import { BRAND } from '../constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const links = [
    ['Design', '#hero'],
    ['Performance', '#chip'],
    ['Camera', '#camera'],
    ['Showroom', '#showroom'],
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'backdrop-blur-xl bg-ink-0/70 border-b border-white/[0.06]'
          : 'bg-transparent'
      }`}
    >
      <nav
        aria-label="Primary"
        className="screen-max-width flex items-center justify-between px-5 sm:px-10 h-14"
      >
        <a
          href="#hero"
          className="flex items-center gap-3 group"
          aria-label={`${BRAND} home`}
        >
          {/* monogram */}
          <span className="grid place-items-center w-7 h-7 rounded-full border border-gold/60 text-gold text-[11px] font-bold tracking-tighter group-hover:bg-gold group-hover:text-black transition-colors duration-300">
            A
          </span>
          <span className="text-[13px] font-semibold tracking-[0.32em] uppercase">
            {BRAND}
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="link-underline text-[13px] text-mist hover:text-snow transition-colors"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a href="#cta" className="btn-gold !px-5 !py-2 text-[13px] hidden sm:inline-flex">
            Pre-order
          </a>
          <button
            className="md:hidden grid place-items-center w-9 h-9 rounded-full border border-white/10"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="Toggle menu"
          >
            <span className="text-sm leading-none">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/[0.06] bg-ink-0/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-4">
            {links.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className="text-sm text-mist hover:text-gold transition-colors"
              >
                {label}
              </a>
            ))}
            <a href="#cta" onClick={() => setOpen(false)} className="btn-gold justify-center sm:hidden">
              Pre-order
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

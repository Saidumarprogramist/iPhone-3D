import { useEffect, useState } from 'react';
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    const key = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('keydown', key);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('keydown', key);
    };
  }, []);
  const links = [
    ['Design', '#hero'],
    ['Engineering', '#chip'],
    ['Camera', '#camera'],
  ];
  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <nav aria-label="Primary">
        <a className="brand" href="#hero" onClick={() => setOpen(false)}>
          <span className="brand-symbol">Λ</span> AURA ONE<span className="brand-register">®</span>
        </a>
        <div className="desktop-links">
          {links.map(([name, href]) => (
            <a key={href} href={href}>
              {name}
            </a>
          ))}
        </div>
        <a className="nav-studio" href="#showroom">
          Discover the studio <span>↗</span>
        </a>
        <button
          className="menu-toggle"
          aria-label="Toggle navigation"
          aria-controls="mobile-menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close −' : 'Menu +'}
        </button>
      </nav>
      {open && (
        <div className="mobile-menu" id="mobile-menu">
          {[...links, ['Finish studio', '#showroom']].map(([name, href]) => (
            <a key={href} href={href} onClick={() => setOpen(false)}>
              {name} <span>↗</span>
            </a>
          ))}
        </div>
      )}
    </header>
  );
}

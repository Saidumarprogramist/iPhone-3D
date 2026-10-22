/* ============================================================
   Fallback — shown when WebGL is unavailable or the device is
   flagged low-power and motion is reduced. Pure DOM/CSS, still
   on-brand: gradient "device", finishes as color chips, specs.
   ============================================================ */

import { BRAND, chapters, finishes, specs } from '../constants';

export default function Fallback({ reason }) {
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-ink-1 via-ink-0 to-black">
      <div className="screen-max-width px-5 sm:px-10 py-24">
        <p className="eyebrow">{reason === 'webgl' ? 'Classic mode' : 'Lightweight mode'}</p>
        <h1 className="display-xl mt-4">
          Titanium.<br />
          <span className="grad-gold">Forged in Light.</span>
        </h1>
        <p className="mt-6 max-w-lg text-mist text-[15px] leading-relaxed">
          Your browser or device doesn&apos;t support the full 3D experience —
          so here is {BRAND} in its purest form: words, numbers and color.
        </p>

        {/* CSS "device" */}
        <div className="mt-16 mx-auto w-56 sm:w-64" aria-hidden="true">
          <div
            className="relative aspect-[9/19] rounded-[3rem] border border-white/15"
            style={{
              background:
                'linear-gradient(160deg,#1b1c22 0%,#0a0a0f 45%,#14151b 100%)',
              boxShadow:
                '0 40px 80px -20px rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.18)',
            }}
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 rounded-full bg-black border border-white/10" />
            <div className="absolute inset-3 rounded-[2.4rem] bg-gradient-to-br from-gold/25 via-transparent to-blue-500/15" />
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-4 flex-wrap" role="list" aria-label="Finishes">
          {finishes.map((f) => (
            <span key={f.id} className="chip">
              <span className="w-3 h-3 rounded-full" style={{ background: f.dot }} />
              {f.name}
            </span>
          ))}
        </div>

        <dl className="mt-16 grid grid-cols-2 sm:grid-cols-3 gap-px rounded-3xl overflow-hidden border border-white/[0.07] bg-white/[0.06]">
          {specs.map((s) => (
            <div key={s.value} className="bg-ink-1 p-5 sm:p-7">
              <dt className="display-m grad-gold">{s.value}</dt>
              <dd className="mt-2 text-xs text-mist leading-relaxed">{s.label}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-14 text-center">
          <a href="#hero" className="btn-gold">Pre-order {chapters[0].titleLines[0]}</a>
        </div>
      </div>
    </main>
  );
}

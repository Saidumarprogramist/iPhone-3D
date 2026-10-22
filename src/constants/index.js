import yellowImg from '/assets/images/yellow.jpg';
import blueImg from '/assets/images/blue.jpg';
import whiteImg from '/assets/images/white.jpg';
import blackImg from '/assets/images/black.jpg';

export const BRAND = 'AURA ONE';

/* Finishes — mapped onto the GLB material recolor pipeline.
   `tint`  : body/frame color applied to paintable materials
   `screen`: wallpaper texture shown on the display mesh
   `dot`   : swatch UI color                                     */
export const finishes = [
  {
    id: 'desert',
    name: 'Desert Titanium',
    tagline: 'Warm alloy, brushed at dawn.',
    tint: '#8F8A81',
    screen: yellowImg,
    dot: '#a89c86',
  },
  {
    id: 'glacier',
    name: 'Glacier Titanium',
    tagline: 'Cold light in a single piece.',
    tint: '#C9C8C2',
    screen: whiteImg,
    dot: '#d9d8d2',
  },
  {
    id: 'deepsea',
    name: 'Deep Sea Titanium',
    tagline: 'Blue that behaves like steel.',
    tint: '#53596E',
    screen: blueImg,
    dot: '#6f7a99',
  },
  {
    id: 'obsidian',
    name: 'Obsidian Titanium',
    tagline: 'Black hole polished matte.',
    tint: '#454749',
    screen: blackImg,
    dot: '#3b3b3b',
  },
];

export const specs = [
  { value: '6.82″', label: 'Luminous XDR ProMotion display, 1–120Hz always-on' },
  { value: 'A19 Aura', label: '3nm SoC · 16-core neural engine · 42 TOPS' },
  { value: '48MP', label: 'Periscope tele · 10× optical · night fusion' },
  { value: 'Grade 5', label: 'Aerospace titanium unibody · IP69 sealed' },
  { value: '31h', label: 'Video playback · 80W wired · 25W MagCharge' },
  { value: '187g', label: 'The lightest Pro chassis ever milled' },
];

export const chapters = [
  {
    id: 'hero',
    eyebrow: 'Introducing',
    titleLines: ['Titanium.', 'Forged in Light.'],
    copy: 'One block of aerospace-grade titanium. Ten days of milling. A surface that disappears into the dark.',
  },
  {
    id: 'chip',
    eyebrow: 'A19 Aura chip',
    titleLines: ['Silence,', 'at 42 trillion', 'operations.'],
    copy: 'The 3nm heart of AURA ONE renders cinematic ray tracing while staying colder than anything its size.',
  },
  {
    id: 'camera',
    eyebrow: 'Photon Fusion camera',
    titleLines: ['Collects', 'what the eye', 'misses.'],
    copy: 'A 48MP periscope with a f/1.4 aperture pulls detail out of near-total darkness — no tripod, no noise.',
  },
  {
    id: 'showroom',
    eyebrow: 'The Showroom',
    titleLines: ['Four finishes.', 'One obsession.'],
    copy: 'Drag to spin. Choose a finish and watch light behave differently on every alloy.',
  },
  {
    id: 'cta',
    eyebrow: 'Available now',
    titleLines: ['Begin your', 'orbit.'],
    copy: 'From $49.95/mo. for 24 months or $1,199. Free engraving. Always.',
  },
];

export const marqueeWords = [
  'TITANIUM GRADE 5',
  'A19 AURA',
  '120Hz PRO MOTION',
  'PERISCOPE 10×',
  'IP69',
  'MAGCHARGE 25W',
  '42 TOPS NEURAL',
];

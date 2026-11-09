/** Kleiner, deterministischer Zufallsgenerator (mulberry32) */
export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export type Rnd = () => number;

export const int = (r: Rnd, min: number, max: number) => Math.floor(r() * (max - min + 1)) + min;
export const pick = <T,>(r: Rnd, arr: readonly T[]): T => arr[Math.floor(r() * arr.length)];
export function shuffle<T>(r: Rnd, arr: readonly T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/** Formatiert Zahlen deutsch: 1.234,50 */
export function de(n: number, digits = 2): string {
  return n.toLocaleString('de-DE', { minimumFractionDigits: digits, maximumFractionDigits: digits });
}
export const eur = (n: number) => `${de(n)} €`;

/** Text für Vergleiche vereinfachen */
export function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[-_/]/g, ' ')
    .replace(/[^a-z0-9.,%:\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Zahl aus Eingabe lesen: "1.234,56 €", "1234.56", "12,5 %" */
export function parseNum(input: string): number | null {
  let s = input.trim().replace(/[€%\s]/g, '').replace(/[a-zA-Z]+$/g, '');
  if (!s) return null;
  if (s.includes(',') && s.includes('.')) {
    // deutsches Format: Punkt = Tausender
    if (s.lastIndexOf(',') > s.lastIndexOf('.')) s = s.replace(/\./g, '').replace(',', '.');
    else s = s.replace(/,/g, '');
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  } else if (/^\d{1,3}(\.\d{3})+$/.test(s)) {
    s = s.replace(/\./g, '');
  }
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}

export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export const DAY = 86400000;

export function fmtDuration(sec: number): string {
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  if (h > 0) return `${h} Std. ${m} Min.`;
  return `${m} Min.`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

/** IHK-Notenschlüssel (100-Punkte-Schlüssel) */
export function ihkNote(pct: number): { note: string; text: string } {
  const p = Math.floor(pct + 1e-9);
  if (p >= 92) return { note: '1', text: 'sehr gut' };
  if (p >= 81) return { note: '2', text: 'gut' };
  if (p >= 67) return { note: '3', text: 'befriedigend' };
  if (p >= 50) return { note: '4', text: 'ausreichend' };
  if (p >= 30) return { note: '5', text: 'mangelhaft' };
  return { note: '6', text: 'ungenügend' };
}

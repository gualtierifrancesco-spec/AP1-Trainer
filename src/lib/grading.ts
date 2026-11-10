import type { Answer, GradeResult, Question } from '../types';
import { norm, parseNum, de, rng, shuffle } from './util';
import type { OrderQuestion } from '../types';

/** Startreihenfolge einer Sortieraufgabe: fest je Aufgabe und nie schon richtig */
export function orderInitial(q: OrderQuestion): number[] {
  let h = 2166136261;
  for (let i = 0; i < q.id.length; i++) h = Math.imul(h ^ q.id.charCodeAt(i), 16777619);
  const idx = q.items.map((_, i) => i);
  let out = shuffle(rng(h >>> 0), idx);
  if (out.every((v, i) => v === i)) out = [...out.slice(1), out[0]];
  return out;
}

/** Alle Reihenfolgen, die als richtig gelten (erlaubte Vertauschungen eingerechnet) */
function acceptedOrders(q: OrderQuestion): number[][] {
  let orders = [q.items.map((_, i) => i)];
  for (const [a, b] of q.swaps ?? []) {
    orders = orders.flatMap((o) => {
      const sw = o.slice();
      [sw[a], sw[b]] = [sw[b], sw[a]];
      return [o, sw];
    });
  }
  return orders;
}

export function emptyAnswer(q: Question): Answer {
  switch (q.type) {
    case 'mc': return { type: 'mc', value: null };
    case 'ms': return { type: 'ms', value: [] };
    case 'open': return { type: 'open', value: '' };
    case 'calc': return { type: 'calc', value: q.fields.map(() => '') };
    case 'match': return { type: 'match', value: q.pairs.map(() => null) };
    case 'order': return { type: 'order', value: [] };
  }
}

export function isAnswered(a: Answer | undefined): boolean {
  if (!a) return false;
  switch (a.type) {
    case 'mc': return a.value !== null;
    case 'ms': return a.value.length > 0;
    case 'open': return a.value.trim().length > 0;
    case 'calc': return a.value.some((v) => v.trim() !== '');
    case 'match': return a.value.some((v) => v !== null);
    case 'order': return a.value.length > 0;
  }
}

const roundHalf = (n: number) => Math.round(n * 2) / 2;

function status(points: number, max: number, answered: boolean): GradeResult['status'] {
  if (!answered) return 'leer';
  if (points >= max - 1e-9) return 'richtig';
  if (points > 0) return 'teilweise';
  return 'falsch';
}

/** Prüft ein Kriterium eines offenen Erwartungshorizonts */
export function criterionMet(text: string, groups: string[][]): boolean {
  const t = ' ' + norm(text) + ' ';
  return groups.every((alts) => alts.some((alt) => t.includes(norm(alt))));
}

export function countDistinct(text: string, alts: string[]): number {
  const t = ' ' + norm(text) + ' ';
  return alts.filter((alt) => t.includes(norm(alt))).length;
}

export function normIp(s: string): string {
  return s.trim().replace(/\s+/g, '').replace(/^\//, '').replace(/,/g, '.');
}

export function grade(q: Question, a: Answer | undefined): GradeResult {
  const answered = isAnswered(a);
  const max = q.points;
  if (!a || !answered) {
    return { points: 0, max, status: 'leer', details: ['Keine Antwort abgegeben.'] };
  }
  switch (q.type) {
    case 'mc': {
      const ok = a.type === 'mc' && a.value === q.correct;
      return {
        points: ok ? max : 0,
        max,
        status: ok ? 'richtig' : 'falsch',
        details: [ok ? 'Richtige Antwort gewählt.' : `Richtig wäre: „${q.options[q.correct]}“.`],
      };
    }
    case 'ms': {
      if (a.type !== 'ms') break;
      const chosen = new Set(a.value);
      const correct = new Set(q.correct);
      let hits = 0;
      let wrong = 0;
      chosen.forEach((i) => (correct.has(i) ? hits++ : wrong++));
      // IHK-typisch: jede falsche Markierung hebt eine richtige auf
      const raw = Math.max(0, hits - wrong) / correct.size;
      const pts = roundHalf(raw * max);
      const details = [`${hits} von ${correct.size} richtigen Aussagen markiert.`];
      if (wrong) details.push(`${wrong} falsche Markierung(en) – jede hebt eine richtige auf.`);
      return { points: pts, max, status: status(pts, max, true), details };
    }
    case 'open': {
      if (a.type !== 'open') break;
      let pts = 0;
      const details: string[] = [];
      for (const c of q.criteria) {
        if (c.need) {
          // Eine Gruppe: jede Alternative ist ein eigener Punkt. Mehrere Gruppen: jede Gruppe ist ein Punkt mit Synonymen.
          const found = c.any.length === 1 ? countDistinct(a.value, c.any[0]) : c.any.filter((g) => criterionMet(a.value, [g])).length;
          const got = roundHalf((Math.min(found, c.need) / c.need) * c.points);
          pts += got;
          details.push(`${got >= c.points ? '✓' : got > 0 ? '◐' : '✗'} ${c.label}: ${found} erkannt (${got}/${c.points} P.)`);
          continue;
        }
        const met = criterionMet(a.value, c.any);
        if (met) pts += c.points;
        details.push(`${met ? '✓' : '✗'} ${c.label} (${met ? c.points : 0}/${c.points} P.)`);
      }
      pts = Math.min(max, pts);
      return { points: pts, max, status: status(pts, max, true), details };
    }
    case 'calc': {
      if (a.type !== 'calc') break;
      const per = max / q.fields.length;
      let pts = 0;
      const details: string[] = [];
      q.fields.forEach((f, i) => {
        const given = (a.value[i] ?? '').trim();
        let ok = false;
        if (typeof f.answer === 'number') {
          const n = parseNum(given);
          const tol = f.tolerance ?? 0.011;
          ok = n !== null && Math.abs(n - f.answer) <= tol;
        } else {
          ok = normIp(given).toLowerCase() === normIp(f.answer).toLowerCase();
        }
        if (ok) pts += per;
        const shown = typeof f.answer === 'number' ? de(f.answer, Number.isInteger(f.answer) ? 0 : 2) : f.answer;
        details.push(`${ok ? '✓' : '✗'} ${f.label}: ${given || '–'}${ok ? '' : ` (richtig: ${shown}${f.unit ? ' ' + f.unit : ''})`}`);
      });
      pts = roundHalf(pts);
      return { points: pts, max, status: status(pts, max, true), details };
    }
    case 'order': {
      if (a.type !== 'order') break;
      const best = Math.max(...acceptedOrders(q).map((o) => o.filter((v, i) => a.value[i] === v).length));
      const pts = roundHalf((best / q.items.length) * max);
      return {
        points: pts,
        max,
        status: status(pts, max, true),
        details: [`${best} von ${q.items.length} Anweisungen stehen an der richtigen Stelle.`],
      };
    }
    case 'match': {
      if (a.type !== 'match') break;
      let hits = 0;
      q.pairs.forEach((_, i) => {
        if (a.value[i] === i) hits++;
      });
      const pts = roundHalf((hits / q.pairs.length) * max);
      return {
        points: pts,
        max,
        status: status(pts, max, true),
        details: [`${hits} von ${q.pairs.length} Zuordnungen richtig.`],
      };
    }
  }
  return { points: 0, max, status: 'falsch', details: ['Antwortformat passt nicht zur Aufgabe.'] };
}

/** Musterlösung als Text */
export function solutionText(q: Question): string {
  switch (q.type) {
    case 'mc': return q.options[q.correct];
    case 'ms': return q.correct.map((i) => q.options[i]).join(' · ');
    case 'open': return q.solution;
    case 'calc':
      return q.fields
        .map((f) => `${f.label}: ${typeof f.answer === 'number' ? de(f.answer, Number.isInteger(f.answer) ? 0 : 2) : f.answer}${f.unit ? ' ' + f.unit : ''}`)
        .join(' · ');
    case 'match': return q.pairs.map(([l, r]) => `${l} → ${r}`).join(' · ');
    case 'order': return q.items.map((t, i) => `${i + 1}. ${t}`).join(' · ');
  }
}

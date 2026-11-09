import { POOL, FIXED, POOL_STATS, findQuestion } from '../src/data/bank';
import { GENERATORS, freshGenerated } from '../src/data/generators';
import { TOPICS, FLASHCARDS } from '../src/data/topics';
import { grade } from '../src/lib/grading';
import type { Answer, Question } from '../src/types';
import { de } from '../src/lib/util';

function perfectAnswer(q: Question): Answer {
  switch (q.type) {
    case 'mc': return { type: 'mc', value: q.correct };
    case 'ms': return { type: 'ms', value: q.correct };
    case 'open': return { type: 'open', value: q.solution };
    case 'calc': return { type: 'calc', value: q.fields.map((f) => (typeof f.answer === 'number' ? de(f.answer, 2) : f.answer)) };
    case 'match': return { type: 'match', value: q.pairs.map((_, i) => i) };
  }
}

describe('Fragenpool', () => {
  it('hat mindestens 500 Aufgaben', () => {
    console.log(POOL_STATS);
    expect(POOL.length).toBeGreaterThanOrEqual(500);
  });

  it('hat eindeutige IDs', () => {
    const ids = POOL.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('jede Aufgabe ist strukturell gültig', () => {
    const topicIds = new Set(TOPICS.map((t) => t.id));
    for (const q of POOL) {
      expect(topicIds.has(q.topic), q.id).toBe(true);
      expect(q.points, q.id).toBeGreaterThan(0);
      expect(q.explanation.length, q.id).toBeGreaterThan(10);
      if (q.type === 'mc') {
        expect(q.correct, q.id).toBeGreaterThanOrEqual(0);
        expect(q.correct, q.id).toBeLessThan(q.options.length);
        expect(new Set(q.options).size, q.id + ' doppelte Optionen').toBe(q.options.length);
      }
      if (q.type === 'ms') q.correct.forEach((c) => expect(c, q.id).toBeLessThan(q.options.length));
      if (q.type === 'calc') q.fields.forEach((f) => {
        if (typeof f.answer === 'number') expect(Number.isFinite(f.answer), q.id).toBe(true);
      });
      if (q.type === 'open') {
        const sum = q.criteria.reduce((s, c) => s + c.points, 0);
        expect(sum, q.id + ' Punkte Erwartungshorizont').toBe(q.points);
      }
    }
  });

  it('die Musterlösung erhält volle Punktzahl (Selbsttest der Bewertung)', () => {
    const fails: string[] = [];
    for (const q of POOL) {
      const g = grade(q, perfectAnswer(q));
      if (g.points !== q.points) fails.push(`${q.id}: ${g.points}/${q.points} ${g.details.join(' | ')}`);
    }
    expect(fails).toEqual([]);
  });

  it('Generatoren liefern bei 300 zufälligen Seeds gültige, bewertbare Aufgaben', () => {
    const fails: string[] = [];
    for (const g of GENERATORS) {
      for (let s = 1; s <= 300; s++) {
        const q = freshGenerated(g, s * 7919);
        const res = grade(q, perfectAnswer(q));
        if (res.points !== q.points) fails.push(`${q.id}: ${res.details.join(' | ')}`);
        if (q.type === 'mc' && new Set(q.options).size !== q.options.length) fails.push(q.id + ' doppelte Option');
        if (q.type === 'mc' && q.correct < 0) fails.push(q.id + ' keine richtige Option');
        const again = findQuestion(q.id);
        if (!again || JSON.stringify(again) !== JSON.stringify(q)) fails.push(q.id + ' nicht reproduzierbar');
      }
    }
    expect(fails.slice(0, 20)).toEqual([]);
  });

  it('jedes Thema hat Unterricht, Lernkarten und Fragen aller drei Stufen', () => {
    for (const t of TOPICS) {
      expect(t.sections.length, t.id).toBeGreaterThanOrEqual(3);
      expect(FLASHCARDS.filter((c) => c.topic === t.id).length, t.id).toBeGreaterThanOrEqual(5);
      const qs = POOL.filter((q) => q.topic === t.id);
      expect(qs.length, t.id).toBeGreaterThanOrEqual(15);
      for (const lvl of [1, 2, 3] as const) {
        expect(qs.some((q) => q.level === lvl), `${t.id} Stufe ${lvl}`).toBe(true);
      }
    }
    console.log('Feste Aufgaben:', FIXED.length);
  });
});

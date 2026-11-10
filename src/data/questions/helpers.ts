import type { CalcField, CalcQuestion, Criterion, FigureId, Level, MatchQuestion, MCQuestion, MSQuestion, OpenQuestion, OrderQuestion, Table, TopicId } from '../../types';

export interface Extra {
  scenario?: string;
  table?: Table;
  hints?: string[];
  code?: string;
  figure?: FigureId;
}

export const order = (
  id: string, topic: TopicId, level: Level, points: number, question: string,
  items: string[], indent: number[], swaps: [number, number][], explanation: string, extra: Extra = {},
): OrderQuestion => ({ id, topic, level, points, type: 'order', question, items, indent, swaps, explanation, ...extra });

export const mc = (
  id: string, topic: TopicId, level: Level, points: number, question: string,
  options: string[], correct: number, explanation: string, extra: Extra = {},
): MCQuestion => ({ id, topic, level, points, type: 'mc', question, options, correct, explanation, ...extra });

export const ms = (
  id: string, topic: TopicId, level: Level, points: number, question: string,
  options: string[], correct: number[], explanation: string, extra: Extra = {},
): MSQuestion => ({ id, topic, level, points, type: 'ms', question, options, correct, explanation, ...extra });

/** Kriterium kompakt: [Bezeichnung, Punkte, 'alt1|alt2', 'alt3|alt4'] – jede Gruppe muss vorkommen */
export type C = [string, number, ...string[]];
/** Beginnt die Bezeichnung mit „#n “, müssen n verschiedene Alternativen der ersten Gruppe vorkommen (anteilige Punkte). */
const crit = (c: C): Criterion => {
  const m = /^#(\d+) (.*)$/.exec(c[0]);
  return {
    label: m ? m[2] : c[0],
    points: c[1],
    any: (c.slice(2) as string[]).map((g) => g.split('|')),
    ...(m ? { need: Number(m[1]) } : {}),
  };
};

export const open = (
  id: string, topic: TopicId, level: Level, points: number, question: string,
  criteria: C[], solution: string, explanation: string, extra: Extra = {},
): OpenQuestion => ({ id, topic, level, points, type: 'open', question, criteria: criteria.map(crit), solution, explanation, ...extra });

export const match = (
  id: string, topic: TopicId, level: Level, points: number, question: string,
  pairs: [string, string][], explanation: string, extra: Extra = {},
): MatchQuestion => ({ id, topic, level, points, type: 'match', question, pairs, explanation, ...extra });

export const calc = (
  id: string, topic: TopicId, level: Level, points: number, question: string,
  fields: CalcField[], steps: string[], explanation: string, extra: Extra = {},
): CalcQuestion => ({ id, topic, level, points, type: 'calc', question, fields, steps, explanation, ...extra });

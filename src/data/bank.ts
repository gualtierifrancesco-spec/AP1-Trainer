import type { Question, TopicId, Level } from '../types';
import { hardwareQuestions, ergoQuestions } from './questions/hardware';
import { netzQuestions, osiQuestions, subnetFixed } from './questions/netzwerk';
import { softwareQuestions, securityQuestions, dsgvoQuestions } from './questions/sicherheit';
import { rechnenQuestions, wirtQuestions, projektQuestions } from './questions/kaufm';
import { scenarioQuestions } from './questions/szenarien';
import { GENERATORS, VARIANTS_PER_GENERATOR, generatorVariant, freshGenerated } from './generators';

export const FIXED: Question[] = [
  ...hardwareQuestions, ...ergoQuestions, ...netzQuestions, ...osiQuestions, ...subnetFixed,
  ...softwareQuestions, ...securityQuestions, ...dsgvoQuestions,
  ...rechnenQuestions, ...wirtQuestions, ...projektQuestions, ...scenarioQuestions,
];

export const VARIANTS: Question[] = GENERATORS.flatMap((g) =>
  Array.from({ length: VARIANTS_PER_GENERATOR }, (_, i) => generatorVariant(g, i)),
);

export const POOL: Question[] = [...FIXED, ...VARIANTS];
const POOL_MAP = new Map(POOL.map((q) => [q.id, q]));

export function findQuestion(id: string, saved?: Record<string, Question>): Question | undefined {
  const q = POOL_MAP.get(id) ?? saved?.[id];
  if (q) return q;
  const m = /^(g-[a-z0-9-]+)@(\d+)$/.exec(id);
  if (m) {
    const g = GENERATORS.find((x) => x.id === m[1]);
    if (g) return freshGenerated(g, Number(m[2]));
  }
  return undefined;
}

export function poolFor(topic?: TopicId, level?: Level): Question[] {
  return POOL.filter((q) => (!topic || q.topic === topic) && (!level || q.level === level));
}

export function generatorsFor(topic: TopicId) {
  return GENERATORS.filter((g) => g.topic === topic);
}

export const POOL_STATS = {
  fixed: FIXED.length,
  generators: GENERATORS.length,
  variants: VARIANTS.length,
  total: POOL.length,
};

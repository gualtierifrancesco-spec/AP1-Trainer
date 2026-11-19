import type { TopicId } from '../types';
import type { Topic } from './topicTypes';
import { topicsA } from './topics1';
import { topicsB } from './topics2';
import { AP1_FOCUS, AP1_SECTIONS, AP1_SECTIONS_B, AP1_TERMS, AP1_TERMS_B, AP1_TRAPS, AP1_TRAPS_B } from './ap1';

function withAp1(t: Topic): Topic {
  const sections = t.sections.slice();
  for (const { after, section } of [...(AP1_SECTIONS[t.id] ?? []), ...(AP1_SECTIONS_B[t.id] ?? [])]) {
    const i = after === null ? -1 : sections.findIndex((x) => x.title === after);
    if (after !== null && i < 0) throw new Error(`Abschnitt „${after}“ fehlt in ${t.id}`);
    sections.splice(i + 1, 0, section);
  }
  return {
    ...t,
    sections,
    terms: [...t.terms, ...(AP1_TERMS[t.id] ?? []), ...(AP1_TERMS_B[t.id] ?? [])],
    traps: [...t.traps, ...(AP1_TRAPS[t.id] ?? []), ...(AP1_TRAPS_B[t.id] ?? [])],
    ap1: AP1_FOCUS[t.id],
  };
}

export const TOPICS: Topic[] = [...topicsA, ...topicsB].map(withAp1);
export const TOPIC_MAP = Object.fromEntries(TOPICS.map((t) => [t.id, t])) as Record<TopicId, Topic>;

export interface Flashcard {
  id: string;
  topic: TopicId;
  kind: 'Begriff' | 'Formel' | 'Merksatz' | 'IHK-Falle';
  front: string;
  back: string;
}

/** Lernkarten werden aus Fachbegriffen, Formeln, Merksätzen und Fallen erzeugt */
export const FLASHCARDS: Flashcard[] = TOPICS.flatMap((t) => [
  ...t.terms.map((x, i) => ({ id: `${t.id}-t${i}`, topic: t.id, kind: 'Begriff' as const, front: x.term, back: x.def })),
  ...t.formulas.map((f, i) => {
    const [front, ...rest] = f.split(/ = | → /);
    return rest.length
      ? { id: `${t.id}-f${i}`, topic: t.id, kind: 'Formel' as const, front: `${front} = ?`, back: f }
      : { id: `${t.id}-f${i}`, topic: t.id, kind: 'Formel' as const, front: `Wichtige Werte: ${t.short}`, back: f };
  }),
  ...t.traps.map((x, i) => ({ id: `${t.id}-x${i}`, topic: t.id, kind: 'IHK-Falle' as const, front: `Typische Falle (${t.short})`, back: x })),
]);

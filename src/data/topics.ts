import type { TopicId } from '../types';
import type { Topic } from './topicTypes';
import { topicsA } from './topics1';
import { topicsB } from './topics2';

export const TOPICS: Topic[] = [...topicsA, ...topicsB];
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

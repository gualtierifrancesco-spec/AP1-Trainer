import type { AppState, GradeResult, Level, Question, QStat, TopicId, TopicProgress } from '../types';
import { TOPICS } from '../data/topics';
import { FIXED, findQuestion } from '../data/bank';
import { DAY } from './util';

/** Leitner-Intervalle in Tagen je Box */
export const INTERVALS = [0, 1, 3, 7, 14, 30];

export function nextBox(box: number, ratio: number): number {
  if (ratio >= 0.8) return Math.min(INTERVALS.length - 1, box + 1);
  if (ratio >= 0.5) return Math.max(0, box - 1);
  return 0;
}

/** Ergebnis einer Aufgabe in den Lernstand übernehmen (Spaced Repetition) */
export function recordResult(s: AppState, q: Question, res: GradeResult, now = Date.now()): AppState {
  // Auch nicht beantwortete Aufgaben zählen als Lücke und kommen in die Wiederholung
  const ratio = res.max ? res.points / res.max : 0;
  const prev: QStat = s.qstats[q.id] ?? { seen: 0, correct: 0, lastAt: 0, box: 0, due: 0, wrongCount: 0, topic: q.topic, level: q.level };
  const box = nextBox(prev.box, ratio);
  const stat: QStat = {
    ...prev,
    seen: prev.seen + 1,
    correct: prev.correct + ratio,
    lastAt: now,
    box,
    due: now + INTERVALS[box] * DAY,
    wrongCount: prev.wrongCount + (ratio < 0.8 ? 1 : 0),
  };
  // Generator-Aufgaben sind über ihre ID reproduzierbar und müssen nicht gespeichert werden
  const savedQuestions = s.savedQuestions;
  const tp: TopicProgress = s.topics[q.topic] ?? { lessonDone: false, checksPassed: 0, levelUnlocked: 1, lastStudied: 0 };
  return {
    ...s,
    qstats: { ...s.qstats, [q.id]: stat },
    savedQuestions,
    topics: { ...s.topics, [q.topic]: { ...tp, lastStudied: now } },
  };
}

export interface Mastery {
  pct: number | null;
  answered: number;
  byLevel: Record<Level, number | null>;
}

/** Beherrschung eines Themas in Prozent. Jüngere Antworten zählen stärker. */
export function topicMastery(s: AppState, topic: TopicId): Mastery {
  const stats = Object.values(s.qstats).filter((x) => x.topic === topic);
  const calc = (list: QStat[]) => {
    if (!list.length) return null;
    let w = 0, sum = 0;
    for (const st of list) {
      const weight = 1 + Math.min(4, st.box); // gefestigte Aufgaben zählen mehr
      sum += (st.correct / st.seen) * weight;
      w += weight;
    }
    return Math.round((sum / w) * 100);
  };
  return {
    pct: stats.length >= 3 ? calc(stats) : null,
    answered: stats.length,
    byLevel: { 1: calc(stats.filter((x) => x.level === 1)), 2: calc(stats.filter((x) => x.level === 2)), 3: calc(stats.filter((x) => x.level === 3)) },
  };
}

export function recommendedLevel(s: AppState, topic: TopicId): { level: Level; reason: string } {
  const m = topicMastery(s, topic);
  const tp = s.topics[topic];
  const n1 = Object.values(s.qstats).filter((x) => x.topic === topic && x.level === 1).length;
  const n2 = Object.values(s.qstats).filter((x) => x.topic === topic && x.level === 2).length;
  if (!tp?.lessonDone && n1 < 5) return { level: 1, reason: 'Starte mit dem Unterricht und den Grundlagen.' };
  if ((m.byLevel[1] ?? 0) < 70 || n1 < 5) return { level: 1, reason: 'Festige die Grundlagen: mindestens 5 Aufgaben mit 70 % auf Stufe 1.' };
  if ((m.byLevel[2] ?? 0) < 70 || n2 < 5) return { level: 2, reason: 'Grundlagen sitzen. Jetzt Zusammenhänge und Rechenaufgaben üben.' };
  return { level: 3, reason: 'Du bist bereit für IHK-Niveau mit Handlungssituationen.' };
}

export function dueReviews(s: AppState, now = Date.now()): Question[] {
  return Object.entries(s.qstats)
    .filter(([, st]) => st.wrongCount > 0 && st.due <= now)
    .sort((a, b) => a[1].box - b[1].box || a[1].due - b[1].due)
    .map(([id]) => findQuestion(id, s.savedQuestions))
    .filter((q): q is Question => !!q);
}

export function wrongQuestions(s: AppState): Question[] {
  return Object.entries(s.qstats)
    .filter(([, st]) => st.wrongCount > 0 && st.box < 3)
    .map(([id]) => findQuestion(id, s.savedQuestions))
    .filter((q): q is Question => !!q);
}

/** Gewicht für die Auswahl: schwache Themen kommen häufiger */
export function topicWeakness(s: AppState, topic: TopicId): number {
  const m = topicMastery(s, topic);
  if (m.pct === null) return 1.6;
  return 0.6 + ((100 - m.pct) / 100) * 2.4;
}

/** Wählt Übungsaufgaben: fällige Wiederholungen zuerst, dann ungesehene, dann schwache */
export function pickPractice(s: AppState, pool: Question[], count: number, rnd = Math.random): Question[] {
  const now = Date.now();
  const scored = pool.map((q) => {
    const st = s.qstats[q.id];
    let score = rnd();
    if (!st) score += 1.2;
    else {
      if (st.due <= now && st.wrongCount > 0) score += 2;
      score += (1 - st.correct / st.seen) * 1.5;
      if (now - st.lastAt < 10 * 60 * 1000) score -= 3; // gerade erst gesehen
    }
    score *= topicWeakness(s, q.topic) / 1.6;
    return { q, score };
  });
  scored.sort((a, b) => b.score - a.score);
  // je Generator höchstens 2, damit es abwechslungsreich bleibt
  const perGen: Record<string, number> = {};
  const out: Question[] = [];
  for (const { q } of scored) {
    const g = q.id.split(/[#@]/)[0];
    if (q.generated) {
      perGen[g] = (perGen[g] ?? 0) + 1;
      if (perGen[g] > 2) continue;
    }
    out.push(q);
    if (out.length >= count) break;
  }
  return out;
}

/** Gesamtbereitschaft für die Prüfung: Abdeckung × Beherrschung, gewichtet nach Prüfungsrelevanz */
export function readiness(s: AppState): { pct: number; coverage: number } {
  let wsum = 0, score = 0, cov = 0;
  for (const t of TOPICS) {
    const m = topicMastery(s, t.id);
    const totalFixed = FIXED.filter((q) => q.topic === t.id).length || 1;
    const coverage = Math.min(1, m.answered / Math.max(8, totalFixed * 0.5));
    wsum += t.examWeight;
    score += t.examWeight * coverage * ((m.pct ?? 0) / 100);
    cov += t.examWeight * coverage;
  }
  return { pct: Math.round((score / wsum) * 100), coverage: Math.round((cov / wsum) * 100) };
}

export function cardDue(s: AppState, id: string, now = Date.now()) {
  const c = s.cards[id];
  return !c || c.due <= now;
}

export function rateCard(s: AppState, id: string, known: boolean, now = Date.now()): AppState {
  const c = s.cards[id] ?? { box: 0, due: 0 };
  const box = known ? Math.min(INTERVALS.length - 1, c.box + 1) : 0;
  return { ...s, cards: { ...s.cards, [id]: { box, due: now + (known ? INTERVALS[box] : 0) * DAY } } };
}

export interface PlanItem {
  topic: TopicId;
  action: 'lernen' | 'üben' | 'wiederholen' | 'prüfen' | 'gefestigt';
  text: string;
  priority: number;
}

/** Dynamischer Lernplan */
export function learningPlan(s: AppState): PlanItem[] {
  const now = Date.now();
  return TOPICS.map((t) => {
    const m = topicMastery(s, t.id);
    const tp = s.topics[t.id];
    const due = Object.values(s.qstats).filter((x) => x.topic === t.id && x.wrongCount > 0 && x.due <= now).length;
    const since = tp?.lastStudied ? Math.floor((now - tp.lastStudied) / DAY) : null;
    const rec = recommendedLevel(s, t.id);
    let action: PlanItem['action'];
    let text: string;
    let priority = t.examWeight;
    if (!tp?.lessonDone && m.answered < 5) {
      action = 'lernen';
      text = 'Unterricht durcharbeiten. Du hast dieses Thema noch nicht gelernt.';
      priority += 30;
    } else if (due > 0) {
      action = 'wiederholen';
      text = `${due} Aufgabe(n) sind zur Wiederholung fällig.`;
      priority += 25 + due;
    } else if (m.pct === null || m.pct < 60) {
      action = 'üben';
      text = `Stufe ${rec.level} üben. ${m.pct === null ? 'Noch zu wenige Ergebnisse.' : `Aktuell ${m.pct} %.`}`;
      priority += 20 + (60 - (m.pct ?? 0)) / 3;
    } else if (m.pct < 85 || rec.level < 3) {
      action = 'prüfen';
      text = `Auf Stufe ${rec.level} vertiefen. Aktuell ${m.pct} %.`;
      priority += 10;
    } else {
      action = 'gefestigt';
      text = `Sicher (${m.pct} %). ${since !== null && since > 10 ? `Zuletzt vor ${since} Tagen geübt – kurz auffrischen.` : 'Gelegentlich wiederholen.'}`;
      priority += since !== null && since > 10 ? 8 : 0;
    }
    return { topic: t.id, action, text, priority };
  }).sort((a, b) => b.priority - a.priority);
}

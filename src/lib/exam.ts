import type { AppState, ExamBlock, ExamRecord, Question, TopicId, Answer } from '../types';
import { FIXED } from '../data/bank';
import type { FixedExamDef } from '../data/questions/muster';
import { GENERATORS, freshGenerated } from '../data/generators';
import { topicWeakness } from './progress';
import { grade, emptyAnswer } from './grading';
import { pick, rng, shuffle, uid, type Rnd } from './util';

interface BlockDef {
  title: string;
  topics: TopicId[];
  situations: ((c: string) => string)[];
}

const BLOCKS: BlockDef[] = [
  {
    title: 'Arbeitsplatz und Hardware',
    topics: ['hardware', 'ergonomie', 'projekt'],
    situations: [
      (c) => `Die ${c} richtet neue Arbeitsplätze für eine Abteilung ein. Du sollst die Hardware auswählen und die Arbeitsplätze nach geltenden Arbeitsschutzanforderungen gestalten.`,
      (c) => `Ein Mitarbeiter der ${c} braucht einen neuen PC. Du ermittelst den Bedarf, wählst die Komponenten aus und bereitest die Übergabe vor.`,
    ],
  },
  {
    title: 'Netzwerk',
    topics: ['netzwerk', 'osi', 'subnetting'],
    situations: [
      (c) => `Die ${c} bekommt eine neue Netzwerkstruktur. Du planst die Adressierung und bindest die neuen Arbeitsplätze an.`,
      (c) => `Bei der ${c} gibt es Probleme im Netzwerk. Außerdem sollen Abteilungen in eigene Subnetze getrennt werden.`,
    ],
  },
  {
    title: 'IT-Sicherheit, Datenschutz und Software',
    topics: ['sicherheit', 'datenschutz', 'software'],
    situations: [
      (c) => `Die ${c} verarbeitet personenbezogene Kundendaten. Du sollst die neuen Arbeitsplätze absichern und die Software lizenzgerecht installieren.`,
      (c) => `Nach einem Sicherheitsvorfall bei einem Mitbewerber möchte die ${c} ihre IT-Sicherheit und den Datenschutz überprüfen lassen.`,
    ],
  },
  {
    title: 'Beschaffung und Wirtschaftlichkeit',
    topics: ['rechnen', 'wirtschaftlichkeit', 'projekt'],
    situations: [
      (c) => `Für die neuen Arbeitsplätze der ${c} liegen mehrere Angebote vor. Du vergleichst sie rechnerisch und triffst eine begründete Entscheidung.`,
      (c) => `Die Geschäftsleitung der ${c} möchte wissen, ob sich Kauf oder Leasing der neuen IT lohnt.`,
    ],
  },
];

const COMPANIES = ['Hansen Elektrotechnik GmbH', 'Kanzlei Vogt & Partner', 'Zahnarztpraxis Dr. Meier', 'Brauerei Schäfer KG', 'Reisebüro Sonnenweg', 'Wuppertaler Stadtwerke-Service GmbH', 'Optik Lindner', 'Druckerei Weber OHG', 'Pflegedienst Herzlich', 'Gartenbau Klein'];

const TARGET = 25;

/** Sammelt Kandidaten für einen Block: feste Aufgaben + frische Generator-Aufgaben */
function candidates(topics: TopicId[], r: Rnd, used: Set<string>): Question[] {
  const fixed = FIXED.filter((q) => topics.includes(q.topic) && !used.has(q.id));
  const gens = GENERATORS.filter((g) => topics.includes(g.topic));
  const fresh = gens.map((g) => freshGenerated(g, Math.floor(r() * 1e9)));
  return [...fixed, ...fresh];
}

function selectBlock(s: AppState, def: BlockDef, r: Rnd, used: Set<string>, usedGens: Set<string>, recent: Set<string>): Question[] {
  const pool = candidates(def.topics, r, used).filter((q) => !q.generated || !usedGens.has(q.id.split('@')[0]));
  const weighted = pool.map((q) => {
    let w = topicWeakness(s, q.topic);
    if (recent.has(q.id)) w *= 0.15; // in letzten Prüfungen gesehen
    if (q.level === 3) w *= 1.25;
    if (q.level === 1) w *= 0.6;
    // Die echte AP1 besteht fast nur aus offenen Aufgaben und Rechnungen
    if (q.type === 'open') w *= 2.4;
    else if (q.type === 'calc' || q.type === 'order') w *= 1.6;
    else if (q.type === 'match') w *= 0.9;
    else w *= 0.45;
    // Gewichtung nach Thema im Block (Hauptthema zuerst)
    w *= def.topics[0] === q.topic ? 1.15 : 1;
    return { q, key: Math.pow(r(), 1 / w) };
  });
  weighted.sort((a, b) => b.key - a.key);

  const chosen: Question[] = [];
  let pts = 0;
  const types = new Set<string>();
  const topicCount: Record<string, number> = {};
  for (const { q } of weighted) {
    if (pts >= TARGET) break;
    if (pts + q.points > TARGET + 1) continue;
    if ((topicCount[q.topic] ?? 0) >= 4) continue;
    // Vielfalt: höchstens 2 Aufgaben desselben Typs, bis mindestens 3 Typen dabei sind
    const sameType = chosen.filter((c) => c.type === q.type).length;
    if (sameType >= 3 && types.size < 2) continue;
    chosen.push(q);
    pts += q.points;
    types.add(q.type);
    topicCount[q.topic] = (topicCount[q.topic] ?? 0) + 1;
    used.add(q.id);
    if (q.generated) usedGens.add(q.id.split('@')[0]);
  }
  // Auffüllen, falls Punkte fehlen
  if (pts < TARGET - 1) {
    for (const { q } of weighted) {
      if (pts >= TARGET - 1) break;
      if (used.has(q.id) || pts + q.points > TARGET + 1) continue;
      chosen.push(q);
      pts += q.points;
      used.add(q.id);
    }
  }
  // Reihenfolge: leichter zuerst, Szenario-Aufgaben am Ende
  return chosen.sort((a, b) => a.level - b.level || a.points - b.points);
}

export function createExam(s: AppState, seed = Date.now()): ExamRecord {
  const r = rng(seed);
  const company = pick(r, COMPANIES);
  const used = new Set<string>();
  const usedGens = new Set<string>();
  const recent = new Set(s.exams.slice(-3).flatMap((e) => e.blocks.flatMap((b) => b.questionIds)));
  const questions: Record<string, Question> = {};
  const blocks: ExamBlock[] = shuffle(r, BLOCKS.slice(0, 3)).concat(BLOCKS[3]).map((def, i) => {
    const qs = selectBlock(s, def, r, used, usedGens, recent);
    qs.forEach((q) => (questions[q.id] = q));
    return { title: `Aufgabe ${i + 1}: ${def.title}`, situation: pick(r, def.situations)(company), questionIds: qs.map((q) => q.id) };
  });
  const answers: Record<string, Answer> = {};
  Object.values(questions).forEach((q) => (answers[q.id] = emptyAnswer(q)));
  return {
    id: uid(),
    createdAt: Date.now(),
    durationMin: s.examMinutes,
    remainingSec: s.examMinutes * 60,
    company,
    blocks,
    questions,
    answers,
    flagged: [],
  };
}

/** Feste Musterprüfung im Format der echten AP1 */
export function createFixedExam(s: AppState, def: FixedExamDef): ExamRecord {
  const questions: Record<string, Question> = {};
  const answers: Record<string, Answer> = {};
  const blocks: ExamBlock[] = def.blocks.map((b) => {
    b.ids.forEach((id) => {
      const q = FIXED.find((x) => x.id === id);
      if (!q) throw new Error(`Aufgabe fehlt: ${id}`);
      questions[id] = q;
      answers[id] = emptyAnswer(q);
    });
    return { title: b.title, situation: b.situation, questionIds: b.ids.slice() };
  });
  return {
    id: uid(),
    createdAt: Date.now(),
    durationMin: def.durationMin ?? s.examMinutes,
    remainingSec: (def.durationMin ?? s.examMinutes) * 60,
    company: `${def.title} · ${def.company}`,
    blocks,
    questions,
    answers,
    flagged: [],
  };
}

export function gradeExam(e: ExamRecord): ExamRecord {
  const results: ExamRecord['results'] = {};
  let score = 0, max = 0;
  for (const q of Object.values(e.questions)) {
    const res = grade(q, e.answers[q.id]);
    results[q.id] = res;
    const ov = e.overrides?.[q.id];
    score += ov ?? res.points;
    max += res.max;
  }
  return { ...e, results, score, max, finishedAt: e.finishedAt ?? Date.now() };
}

export function examScore(e: ExamRecord): { score: number; max: number; pct: number } {
  const score = e.score ?? 0;
  const max = e.max ?? 1;
  return { score, max, pct: max ? (score / max) * 100 : 0 };
}

export function examTopicBreakdown(e: ExamRecord): Record<string, { got: number; max: number }> {
  const out: Record<string, { got: number; max: number }> = {};
  for (const q of Object.values(e.questions)) {
    const res = e.results?.[q.id];
    if (!res) continue;
    const o = (out[q.topic] ??= { got: 0, max: 0 });
    o.got += e.overrides?.[q.id] ?? res.points;
    o.max += res.max;
  }
  return out;
}

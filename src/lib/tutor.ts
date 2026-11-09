import type { Answer, GradeResult, Question, TopicId } from '../types';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import type { LessonSection, CheckQ } from '../data/topicTypes';
import { poolFor } from '../data/bank';
import { norm } from './util';
import { solutionText } from './grading';

export interface TutorContext {
  topic: TopicId;
  question?: Question;
  answer?: Answer;
  result?: GradeResult;
}

export interface TutorMsg {
  role: 'user' | 'tutor';
  text: string;
  quiz?: CheckQ;
}

export interface TutorMemory {
  pending?: { quiz: CheckQ; tries: number };
  lastSection?: { topic: TopicId; index: number };
  stepIndex: number;
  hintIndex: number;
  simpleLevel: number;
}

export const newMemory = (): TutorMemory => ({ stepIndex: 0, hintIndex: 0, simpleLevel: 0 });

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

function has(t: string, ...words: string[]) {
  return words.some((w) => t.includes(norm(w)));
}

function findSection(text: string, preferTopic: TopicId): { topic: TopicId; index: number; s: LessonSection } | null {
  const t = ' ' + norm(text) + ' ';
  let best: { topic: TopicId; index: number; s: LessonSection; score: number } | null = null;
  for (const tp of TOPICS) {
    tp.sections.forEach((s, index) => {
      let score = 0;
      for (const k of s.keys) if (t.includes(norm(k))) score += norm(k).length > 4 ? 3 : 2;
      if (t.includes(norm(s.title))) score += 4;
      if (tp.id === preferTopic) score += 0.5;
      if (score > 0 && (!best || score > best.score)) best = { topic: tp.id, index, s, score };
    });
  }
  return best;
}

function findTerm(text: string) {
  const t = ' ' + norm(text) + ' ';
  for (const tp of TOPICS) for (const term of tp.terms) {
    const k = norm(term.term);
    if (k.length >= 3 && t.includes(k)) return { topic: tp.id, ...term };
  }
  return null;
}

function firstParagraph(s: LessonSection) {
  return s.text.split('\n\n')[0];
}

function quizText(q: CheckQ) {
  return `${q.q} ${q.options.map((o, i) => `${LETTERS[i]}) ${o}`).join('  ')}`;
}

function parseChoice(input: string, q: CheckQ): number | null {
  const t = input.trim().toUpperCase();
  const m = /^([A-F])\b|^\(?([A-F])\)/.exec(t);
  if (m) {
    const i = LETTERS.indexOf(m[1] ?? m[2]);
    return i < q.options.length ? i : null;
  }
  const n = norm(input);
  const idx = q.options.findIndex((o) => norm(o) === n || (n.length > 3 && norm(o).includes(n)));
  return idx >= 0 ? idx : null;
}

function practiceQuiz(topic: TopicId, minLevel: number): CheckQ | null {
  const list = poolFor(topic).filter((q) => q.type === 'mc' && q.level >= minLevel);
  if (!list.length) return null;
  const q = list[Math.floor(Math.random() * list.length)];
  if (q.type !== 'mc') return null;
  return { q: (q.scenario ? q.scenario + ' ' : '') + q.question, options: q.options, correct: q.correct, explain: q.explanation };
}

/** Regelbasierter Offline-Ausbilder. Er gibt Hinweise und Rückfragen, statt sofort Lösungen zu verraten. */
export function offlineTutor(input: string, ctx: TutorContext, mem: TutorMemory): { reply: TutorMsg; mem: TutorMemory } {
  const t = norm(input);
  const topic = TOPIC_MAP[ctx.topic];
  const q = ctx.question;

  // 1. Antwort auf eine offene Rückfrage
  if (mem.pending) {
    const choice = parseChoice(input, mem.pending.quiz);
    if (choice !== null) {
      const quiz = mem.pending.quiz;
      if (choice === quiz.correct) {
        return { reply: { role: 'tutor', text: `Richtig, ${LETTERS[choice]} stimmt. ${quiz.explain} Möchtest du ein weiteres Beispiel oder eine schwierigere Aufgabe?` }, mem: { ...mem, pending: undefined } };
      }
      if (mem.pending.tries === 0) {
        return { reply: { role: 'tutor', text: `Noch nicht ganz. Überleg noch einmal, warum ${LETTERS[choice]} nicht passt. Lies die Frage langsam und streiche zuerst die Antworten, die sicher falsch sind. Welche bleibt übrig?` }, mem: { ...mem, pending: { ...mem.pending, tries: 1 } } };
      }
      return { reply: { role: 'tutor', text: `Die richtige Antwort ist ${LETTERS[quiz.correct]}: ${quiz.options[quiz.correct]}. ${quiz.explain} Das ist nicht schlimm, genau so lernt man. Schreib „Beispiel“, wenn du es noch einmal anders erklärt haben möchtest.` }, mem: { ...mem, pending: undefined } };
    }
  }

  // 2. Warum ist meine Antwort falsch?
  if (has(t, 'warum', 'falsch', 'fehler', 'verstehe nicht warum')) {
    if (q && ctx.result) {
      const yours = describeAnswer(q, ctx.answer);
      if (ctx.result.status === 'richtig') {
        return { reply: { role: 'tutor', text: `Deine Antwort war richtig. ${q.explanation} Kannst du in einem Satz sagen, warum die anderen Möglichkeiten nicht passen?` }, mem };
      }
      return {
        reply: { role: 'tutor', text: `Du hast ${yours} geantwortet. ${ctx.result.details.join(' ')} Der Kern der Aufgabe ist: ${q.explanation} Versuch jetzt selbst zu erklären, an welcher Stelle dein Gedanke abgebogen ist. Schreib es mir, dann prüfe ich es.` },
        mem,
      };
    }
    if (q) return { reply: { role: 'tutor', text: 'Beantworte die Aufgabe zuerst. Danach erkläre ich dir genau, was richtig oder falsch war.' }, mem };
  }

  // 3. Tipp zur aktuellen Aufgabe
  if (q && has(t, 'tipp', 'hinweis', 'hilfe', 'hilf mir', 'komme nicht weiter', 'weiss nicht')) {
    const hints = q.hints?.length ? q.hints : q.type === 'calc' ? q.steps.slice(0, -1).map((s) => `Fang so an: ${s.split('=')[0].trim()} …`) : [`Denk an dieses Thema: ${topic.title}. Was ist dort der wichtigste Begriff?`];
    const i = Math.min(mem.hintIndex, hints.length - 1);
    const more = i < hints.length - 1 ? ' Schreib „Tipp“, wenn du noch einen Hinweis brauchst.' : ' Mehr verrate ich noch nicht. Probier es jetzt selbst.';
    return { reply: { role: 'tutor', text: `${hints[i]}${more}` }, mem: { ...mem, hintIndex: i + 1 } };
  }

  // 4. Rechenweg Schritt für Schritt
  if (has(t, 'rechenweg', 'schritt', 'wie rechne', 'wie berechne', 'weiter', 'naechster')) {
    const steps = q?.type === 'calc' ? q.steps : topic.steps?.steps;
    if (steps?.length) {
      const i = has(t, 'weiter', 'naechster') ? mem.stepIndex : 0;
      if (i >= steps.length) return { reply: { role: 'tutor', text: 'Das war der letzte Schritt. Rechne die Aufgabe jetzt einmal komplett selbst durch, ohne nachzusehen.' }, mem: { ...mem, stepIndex: 0 } };
      const intro = i === 0 ? (q?.type === 'calc' ? 'Wir gehen den Rechenweg gemeinsam durch. ' : `${topic.steps!.title}. `) : '';
      return { reply: { role: 'tutor', text: `${intro}Schritt ${i + 1} von ${steps.length}: ${steps[i]}${i + 1 < steps.length ? ' Versuch den nächsten Schritt selbst, bevor du „weiter“ schreibst.' : ''}` }, mem: { ...mem, stepIndex: i + 1 } };
    }
  }

  // 5. Schwierigere oder neue Aufgabe
  if (has(t, 'schwierig', 'schwerer', 'aufgabe', 'uebung', 'teste mich', 'frag mich', 'quiz')) {
    const lvl = has(t, 'schwierig', 'schwerer') ? Math.min(3, (q?.level ?? 1) + 1) : 1;
    const quiz = practiceQuiz(ctx.topic, lvl);
    if (quiz) return { reply: { role: 'tutor', text: `Hier ist eine Aufgabe für dich. Antworte mit dem Buchstaben. ${quizText(quiz)}`, quiz }, mem: { ...mem, pending: { quiz, tries: 0 } } };
  }

  // 6. Zusammenfassung, Formeln, Fallen
  if (has(t, 'zusammenfassung', 'zusammenfassen', 'kurz', 'ueberblick')) return { reply: { role: 'tutor', text: topic.summary }, mem };
  if (has(t, 'formel')) return { reply: { role: 'tutor', text: `Die wichtigsten Formeln für ${topic.title}: ${topic.formulas.join('. ')}.` }, mem };
  if (has(t, 'falle', 'aufpassen', 'typische fehler')) return { reply: { role: 'tutor', text: `Darauf solltest du in der Prüfung achten. ${topic.traps.join(' ')}` }, mem };

  // 7. Einfacher erklären oder Beispiel
  const wantsSimple = has(t, 'einfach', 'noch nie', 'anfaenger', 'verstehe nicht', 'kapiere nicht', 'erklaer es mir', 'kind');
  const wantsExample = has(t, 'beispiel', 'anderes', 'praxis', 'alltag');
  const found = findSection(input, ctx.topic);
  const ref = found ?? (mem.lastSection ? { ...mem.lastSection, s: TOPIC_MAP[mem.lastSection.topic].sections[mem.lastSection.index] } : q ? bestSectionForQuestion(q) : null);

  if ((wantsSimple || wantsExample) && ref) {
    const s = ref.s;
    if (wantsExample) {
      const ex = s.example ?? TOPIC_MAP[ref.topic].sections.find((x) => x.example)?.example;
      const text = ex ? `Ein Beispiel aus dem Arbeitsalltag: ${ex}` : `Stell es dir so vor: ${s.simple ?? firstParagraph(s)}`;
      return withCheck(`${text}`, s, { ...mem, lastSection: { topic: ref.topic, index: ref.index } });
    }
    const level = mem.lastSection?.index === ref.index && mem.lastSection.topic === ref.topic ? mem.simpleLevel + 1 : 0;
    const text = level === 0 && s.simple ? s.simple : level <= 1 ? `Ganz von vorne: ${firstParagraph(s)}` : `Noch einmal anders: ${s.simple ?? firstParagraph(s)} Am besten lernst du es, wenn du selbst etwas ausprobierst. Öffne dazu die Übung im Unterricht.`;
    return withCheck(text, s, { ...mem, lastSection: { topic: ref.topic, index: ref.index }, simpleLevel: level });
  }

  // 8. Begriff erklären
  const term = findTerm(input);
  if (term && (!found || norm(input).split(' ').length <= 4)) {
    const sec = findSection(term.term, term.topic);
    const extra = sec?.s.simple ? ` Einfach gesagt: ${sec.s.simple}` : '';
    return { reply: { role: 'tutor', text: `${term.term}: ${term.def}${extra} Willst du ein Beispiel dazu?` }, mem: sec ? { ...mem, lastSection: { topic: sec.topic, index: sec.index } } : mem };
  }

  // 9. Allgemeine Frage zu einem Abschnitt
  if (found) {
    const para = found.s.text.split('\n\n').slice(0, 2).join(' ');
    return withCheck(para, found.s, { ...mem, lastSection: { topic: found.topic, index: found.index }, simpleLevel: 0 });
  }

  return {
    reply: {
      role: 'tutor',
      text: `Dazu habe ich im Offline-Modus keine passende Erklärung gefunden. Versuch es mit einem Fachbegriff, zum Beispiel „Was ist ${topic.terms[0]?.term ?? 'eine Subnetzmaske'}?“. Du kannst auch schreiben: einfacher erklären, Beispiel, Rechenweg, Tipp, Zusammenfassung oder schwierigere Aufgabe.`,
    },
    mem,
  };
}

function withCheck(text: string, s: LessonSection, mem: TutorMemory) {
  if (s.check) {
    return {
      reply: { role: 'tutor' as const, text: `${text} Prüfen wir, ob es sitzt. ${quizText(s.check)}`, quiz: s.check },
      mem: { ...mem, pending: { quiz: s.check, tries: 0 } },
    };
  }
  return { reply: { role: 'tutor' as const, text }, mem };
}

function bestSectionForQuestion(q: Question) {
  const hay = `${q.question} ${q.scenario ?? ''} ${q.explanation}`;
  const topic = TOPIC_MAP[q.topic];
  let best = { index: 0, score: -1 };
  topic.sections.forEach((s, index) => {
    const n = norm(hay);
    const score = s.keys.filter((k) => n.includes(norm(k))).length;
    if (score > best.score) best = { index, score };
  });
  return { topic: q.topic, index: best.index, s: topic.sections[best.index] };
}

export function describeAnswer(q: Question, a?: Answer): string {
  if (!a) return 'nichts';
  switch (a.type) {
    case 'mc': return q.type === 'mc' && a.value !== null ? `„${q.options[a.value]}“` : 'nichts';
    case 'ms': return q.type === 'ms' && a.value.length ? a.value.map((i) => `„${q.options[i]}“`).join(', ') : 'nichts';
    case 'open': return a.value.trim() ? `„${a.value.trim().slice(0, 300)}“` : 'nichts';
    case 'calc': return q.type === 'calc' ? q.fields.map((f, i) => `${f.label} = ${a.value[i] || '–'}`).join(', ') : '';
    case 'match': return q.type === 'match' ? q.pairs.map(([l], i) => `${l} → ${a.value[i] !== null && a.value[i] !== undefined ? q.pairs[a.value[i]!][1] : '–'}`).join('; ') : '';
  }
}

/* ---------------- KI-Ausbilder über Claude (nur im Claude-Artefakt verfügbar) ---------------- */

type SampleFn = (input: string | { role: 'user' | 'assistant'; content: string }[], opts?: Record<string, unknown>) => Promise<{ text: string }>;

declare global {
  interface Window {
    claude?: { use: (name: string) => Promise<unknown> };
  }
}

let samplePromise: Promise<SampleFn | null> | null = null;
export function getSample(): Promise<SampleFn | null> {
  if (samplePromise) return samplePromise;
  samplePromise = (async () => {
    try {
      if (typeof window === 'undefined' || !window.claude?.use) return null;
      const s = (await window.claude.use('sample')) as SampleFn | null;
      return s ?? null;
    } catch {
      return null;
    }
  })();
  return samplePromise;
}

export function buildRules(ctx: TutorContext): string {
  const topic = TOPIC_MAP[ctx.topic];
  const q = ctx.question;
  const lines = [
    'Du bist ein geduldiger IT-Ausbilder für die IHK-Abschlussprüfung Teil 1 „Einrichten eines IT-gestützten Arbeitsplatzes“ (Kaufmann/Kauffrau für IT-System-Management).',
    'Dein Schüler macht eine Umschulung und hat manche Themen noch nie gelernt.',
    'Regeln: Antworte auf Deutsch in einfacher Sprache und kurzen Sätzen. Schreib Fließtext, keine Stichpunkte, keine Aufzählungen, keine Überschriften, kein Markdown. Höchstens 6 bis 8 Sätze.',
    'Erkläre Fachbegriffe sofort. Nutze Beispiele aus dem Büroalltag.',
    'Verrate bei Aufgaben nicht sofort die Lösung. Gib zuerst einen Hinweis und stelle eine gezielte Rückfrage, damit er selbst darauf kommt. Erst wenn er zweimal nicht weiterkommt oder ausdrücklich nach der Lösung fragt, erklärst du den vollständigen Weg.',
    'Wenn er etwas Falsches sagt, benenne das Missverständnis freundlich und genau.',
    'Bleib fachlich korrekt (Stand deutsche Vorschriften: DSGVO, BDSG, ArbStättV Anhang 6, 19 % USt). Wenn du unsicher bist, sag das.',
    `Aktuelles Thema: ${topic.title}. Kurzfassung des Lernstoffs: ${topic.summary}`,
  ];
  if (q) {
    lines.push(`Aktuelle Aufgabe: ${q.scenario ? q.scenario + ' ' : ''}${q.question}`);
    if (q.table) lines.push(`Tabelle: ${q.table.headers.join(' | ')} / ${q.table.rows.map((r) => r.join(' | ')).join(' / ')}`);
    if (q.type === 'mc' || q.type === 'ms') lines.push(`Antwortmöglichkeiten: ${q.options.map((o, i) => `${LETTERS[i]}) ${o}`).join('; ')}`);
    lines.push(`Nur für dich als Ausbilder, nicht sofort verraten: Musterlösung: ${solutionText(q)}. Erklärung: ${q.explanation}${q.type === 'calc' ? ' Rechenweg: ' + q.steps.join(' ') : ''}`);
    if (ctx.answer && ctx.result) lines.push(`Seine Antwort: ${describeAnswer(q, ctx.answer)}. Bewertung: ${ctx.result.points} von ${ctx.result.max} Punkten (${ctx.result.status}). ${ctx.result.details.join(' ')}`);
  }
  lines.push('Bestätige diese Regeln nicht. Antworte direkt auf seine nächste Nachricht.');
  return lines.join('\n');
}

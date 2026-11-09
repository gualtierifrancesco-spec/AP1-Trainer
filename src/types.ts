export type TopicId =
  | 'hardware'
  | 'ergonomie'
  | 'netzwerk'
  | 'osi'
  | 'subnetting'
  | 'software'
  | 'sicherheit'
  | 'datenschutz'
  | 'rechnen'
  | 'wirtschaftlichkeit'
  | 'projekt';

/** 1 = Anfänger, 2 = Fortgeschritten, 3 = IHK-Niveau */
export type Level = 1 | 2 | 3;

export interface Table {
  caption?: string;
  headers: string[];
  rows: (string | number)[][];
}

interface QBase {
  id: string;
  topic: TopicId;
  level: Level;
  points: number;
  /** Optionale Ausgangssituation / Handlungssituation */
  scenario?: string;
  question: string;
  table?: Table;
  /** Ausführliche Erklärung in einfacher Sprache */
  explanation: string;
  /** Tipps für den IT-Ausbilder, ohne die Lösung zu verraten */
  hints?: string[];
  /** Kennzeichnet Generator-Aufgaben */
  generated?: boolean;
}

export interface MCQuestion extends QBase {
  type: 'mc';
  options: string[];
  correct: number;
}

export interface MSQuestion extends QBase {
  type: 'ms';
  options: string[];
  correct: number[];
}

export interface Criterion {
  label: string;
  /** Jede Gruppe ist eine Liste von Alternativen; das Kriterium gilt als erfüllt,
   *  wenn in JEDER Gruppe mindestens eine Alternative vorkommt. */
  any: string[][];
  points: number;
  /** Anzahl verschiedener Treffer in der ersten Gruppe, die verlangt werden (anteilige Punkte) */
  need?: number;
}

export interface OpenQuestion extends QBase {
  type: 'open';
  criteria: Criterion[];
  solution: string;
}

export interface CalcField {
  label: string;
  /** Zahl oder exakte Zeichenkette (z. B. IP-Adresse) */
  answer: number | string;
  unit?: string;
  /** absolute Toleranz bei Zahlen (Standard 0,01) */
  tolerance?: number;
}

export interface CalcQuestion extends QBase {
  type: 'calc';
  fields: CalcField[];
  steps: string[];
}

export interface MatchQuestion extends QBase {
  type: 'match';
  pairs: [string, string][];
}

export type Question = MCQuestion | MSQuestion | OpenQuestion | CalcQuestion | MatchQuestion;

export type Answer =
  | { type: 'mc'; value: number | null }
  | { type: 'ms'; value: number[] }
  | { type: 'open'; value: string }
  | { type: 'calc'; value: string[] }
  | { type: 'match'; value: (number | null)[] };

export interface GradeResult {
  points: number;
  max: number;
  status: 'richtig' | 'teilweise' | 'falsch' | 'leer';
  details: string[];
}

export interface ExamBlock {
  title: string;
  situation: string;
  questionIds: string[];
}

export interface ExamRecord {
  id: string;
  createdAt: number;
  finishedAt?: number;
  durationMin: number;
  /** verbleibende Sekunden, wenn pausiert/gespeichert */
  remainingSec: number;
  company: string;
  blocks: ExamBlock[];
  /** Fragen werden mitgespeichert, weil Generator-Aufgaben zufällig sind */
  questions: Record<string, Question>;
  answers: Record<string, Answer>;
  flagged: string[];
  results?: Record<string, GradeResult>;
  overrides?: Record<string, number>;
  score?: number;
  max?: number;
}

export interface QStat {
  seen: number;
  correct: number;
  lastAt: number;
  /** Leitner-Box 0..5 */
  box: number;
  due: number;
  wrongCount: number;
  topic: TopicId;
  level: Level;
}

export interface CardStat {
  box: number;
  due: number;
}

export interface TopicProgress {
  lessonDone: boolean;
  checksPassed: number;
  levelUnlocked: Level;
  lastStudied: number;
  finalTest?: Record<Level, number>;
}

export interface AppState {
  version: 1;
  theme: 'system' | 'light' | 'dark';
  examMinutes: number;
  qstats: Record<string, QStat>;
  /** zufällige Generator-Aufgaben, die falsch waren, damit sie wiederholt werden können */
  savedQuestions: Record<string, Question>;
  cards: Record<string, CardStat>;
  topics: Partial<Record<TopicId, TopicProgress>>;
  exams: ExamRecord[];
  activeExamId?: string;
  studySeconds: number;
  dailySeconds: Record<string, number>;
}

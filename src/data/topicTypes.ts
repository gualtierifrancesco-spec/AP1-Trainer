import type { FigureId, TopicId } from '../types';
import type { Ap1Focus } from './ap1';

export type VisualId =
  | 'pc-parts' | 'ergo' | 'topo' | 'osi' | 'ip-binary' | 'os-layers'
  | 'cia' | 'backup' | 'dsgvo' | 'bezug' | 'tco' | 'projekt';

export type WidgetId =
  | 'hardware-match' | 'ergo-check' | 'net-builder' | 'osi-explorer' | 'subnet-trainer'
  | 'license-sort' | 'phishing' | 'dsgvo-cases' | 'calc-stepper' | 'nwa' | 'sla-calc';

export interface CheckQ {
  q: string;
  options: string[];
  correct: number;
  explain: string;
}

export interface LessonSection {
  title: string;
  /** Absätze, getrennt durch Leerzeile */
  text: string;
  /** Noch einfachere Erklärung für den IT-Ausbilder */
  simple?: string;
  example?: string;
  visual?: VisualId;
  /** Abbildung wie in der Prüfung */
  figure?: FigureId;
  /** Konsolenausgabe oder Datenblatt-Ausschnitt */
  code?: string;
  check?: CheckQ;
  /** Schlagwörter, über die der IT-Ausbilder diesen Abschnitt findet */
  keys: string[];
}

export interface Topic {
  id: TopicId;
  title: string;
  short: string;
  area: 'Hardware & Arbeitsplatz' | 'Netzwerk' | 'Software & Sicherheit' | 'Kaufmännisch & Projekt';
  /** Gewicht in der Prüfung (Anteil an der Punkteverteilung) */
  examWeight: number;
  intro: string;
  sections: LessonSection[];
  steps?: { title: string; steps: string[] };
  widget: WidgetId;
  widgetTitle: string;
  terms: { term: string; def: string }[];
  formulas: string[];
  merksaetze: string[];
  traps: string[];
  summary: string;
  /** So kommt das Thema in der AP1 dran (wird in topics.ts ergänzt) */
  ap1?: Ap1Focus;
}

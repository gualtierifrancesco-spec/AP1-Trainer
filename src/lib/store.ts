import { useSyncExternalStore } from 'react';
import type { AppState } from '../types';
import { todayKey } from './util';

const KEY = 'ap1-trainer-v1';

export const defaultState = (): AppState => ({
  version: 1,
  theme: 'system',
  examMinutes: 90,
  qstats: {},
  savedQuestions: {},
  cards: {},
  topics: {},
  exams: [],
  studySeconds: 0,
  dailySeconds: {},
});

export interface StorageLike {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
  removeItem(k: string): void;
}

function storage(): StorageLike | null {
  try {
    const s = globalThis.localStorage;
    const probe = '__ap1_probe__';
    s.setItem(probe, '1');
    s.removeItem(probe);
    return s;
  } catch {
    return null;
  }
}

export function parseState(raw: string | null): AppState {
  if (!raw) return defaultState();
  try {
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== 1) return defaultState();
    return { ...defaultState(), ...parsed };
  } catch {
    return defaultState();
  }
}

let current: AppState = parseState(storage()?.getItem(KEY) ?? null);
const listeners = new Set<() => void>();
let saveTimer: ReturnType<typeof setTimeout> | null = null;
export let storageAvailable = storage() !== null;

function persist() {
  const s = storage();
  storageAvailable = s !== null;
  if (!s) return;
  try {
    s.setItem(KEY, JSON.stringify(current));
  } catch {
    // Speicher voll: alte Prüfungen kürzen und erneut versuchen
    try {
      current = { ...current, exams: current.exams.slice(-15) };
      s.setItem(KEY, JSON.stringify(current));
    } catch {
      /* ignorieren */
    }
  }
}

export function getState(): AppState {
  return current;
}

export function setState(updater: (s: AppState) => AppState, immediate = false) {
  current = updater(current);
  listeners.forEach((l) => l());
  if (saveTimer) clearTimeout(saveTimer);
  if (immediate) persist();
  else saveTimer = setTimeout(persist, 250);
}

export function flush() {
  if (saveTimer) clearTimeout(saveTimer);
  persist();
}

export function replaceState(next: AppState) {
  setState(() => next, true);
}

export function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getState, getState);
}

/** Lernzeit zählen */
export function addStudyTime(sec: number) {
  const k = todayKey();
  setState((s) => ({
    ...s,
    studySeconds: s.studySeconds + sec,
    dailySeconds: { ...s.dailySeconds, [k]: (s.dailySeconds[k] ?? 0) + sec },
  }));
}

export function exportState(): string {
  return JSON.stringify(current);
}

export function importState(raw: string): boolean {
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || typeof parsed.qstats !== 'object') return false;
    replaceState({ ...defaultState(), ...parsed });
    return true;
  } catch {
    return false;
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('pagehide', flush);
  window.addEventListener('beforeunload', flush);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') flush();
  });
}

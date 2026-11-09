import { useSyncExternalStore } from 'react';

/**
 * KI-Stimme (Piper), die komplett im Browser rechnet. Die Dateien liegen unter tts/
 * und werden beim ersten Einschalten geladen (rund 95 MB), danach offline aus dem Speicher.
 */

export type NeuralStatus = 'unknown' | 'unavailable' | 'available' | 'loading' | 'ready' | 'error';

export interface NeuralState {
  status: NeuralStatus;
  progress: number;
  stage: string;
  error?: string;
}

export const NEURAL_VOICE_NAME = 'Thorsten';
export const NEURAL_SIZE_MB = 95;
const CONFIG = 'tts/de_DE-thorsten-medium.onnx.json';

let state: NeuralState = { status: 'unknown', progress: 0, stage: '' };
const listeners = new Set<() => void>();
function set(next: Partial<NeuralState>) {
  state = { ...state, ...next };
  listeners.forEach((l) => l());
}
export const neuralState = () => state;
export function useNeuralState(): NeuralState {
  return useSyncExternalStore((fn) => { listeners.add(fn); return () => listeners.delete(fn); }, () => state, () => state);
}

let worker: Worker | null = null;
let readyPromise: Promise<void> | null = null;
let nextId = 1;
const pending = new Map<number, { resolve: (wav: ArrayBuffer) => void; reject: (e: Error) => void }>();

/** Prüft, ob die Stimm-Dateien bei dieser Installation vorhanden sind (z. B. nicht in der Claude-Vorschau). */
export async function checkNeural(): Promise<boolean> {
  if (state.status !== 'unknown') return state.status !== 'unavailable';
  try {
    if (typeof Worker === 'undefined' || typeof WebAssembly === 'undefined' || !/^https?:$/.test(location.protocol)) throw new Error('nicht unterstützt');
    const res = await fetch(new URL(CONFIG, document.baseURI).href, { method: 'GET', cache: 'no-cache' });
    const type = res.headers.get('content-type') ?? '';
    if (!res.ok || type.includes('text/html')) throw new Error('nicht vorhanden');
    set({ status: 'available' });
    return true;
  } catch {
    set({ status: 'unavailable' });
    return false;
  }
}

function failAll(message: string) {
  pending.forEach((p) => p.reject(new Error(message)));
  pending.clear();
}

/** Lädt Stimme und Rechenkern. Mehrfache Aufrufe teilen sich denselben Ladevorgang. */
export function loadNeural(): Promise<void> {
  if (readyPromise) return readyPromise;
  readyPromise = new Promise<void>((resolve, reject) => {
    try {
      worker = new Worker(new URL('tts/tts-worker.js', document.baseURI).href);
    } catch (e) {
      set({ status: 'error', error: 'Die KI-Stimme kann auf diesem Gerät nicht gestartet werden.' });
      readyPromise = null;
      reject(e as Error);
      return;
    }
    set({ status: 'loading', progress: 0, stage: 'Sprachdaten', error: undefined });
    worker.onmessage = (e: MessageEvent) => {
      const m = e.data;
      if (m.type === 'progress') set({ progress: m.p, stage: m.stage });
      else if (m.type === 'ready') { set({ status: 'ready', progress: 1, stage: '' }); resolve(); }
      else if (m.type === 'audio') { pending.get(m.id)?.resolve(m.wav); pending.delete(m.id); }
      else if (m.type === 'error') {
        if (m.id !== undefined) { pending.get(m.id)?.reject(new Error(m.error)); pending.delete(m.id); }
        else {
          set({ status: 'error', error: 'Die KI-Stimme konnte nicht geladen werden. Prüfe die Internetverbindung und versuch es noch einmal.' });
          readyPromise = null;
          worker?.terminate();
          worker = null;
          failAll(m.error);
          reject(new Error(m.error));
        }
      }
    };
    worker.onerror = () => {
      set({ status: 'error', error: 'Die KI-Stimme ist abgestürzt. Vermutlich reicht der Arbeitsspeicher nicht. Die App nutzt wieder die Stimme des Geräts.' });
      readyPromise = null;
      worker?.terminate();
      worker = null;
      failAll('worker');
      reject(new Error('worker'));
    };
    worker.postMessage({ type: 'init' });
  });
  return readyPromise;
}

/** Erzeugt Sprache für einen Textteil. Ergebnis ist eine WAV-Datei. */
export async function synthesize(text: string, rate: number): Promise<ArrayBuffer> {
  await loadNeural();
  if (!worker) throw new Error('worker');
  const id = nextId++;
  return new Promise<ArrayBuffer>((resolve, reject) => {
    pending.set(id, { resolve, reject });
    worker!.postMessage({ type: 'synth', id, text, rate });
  });
}

/* ---------------- Wiedergabe ---------------- */

// Sehr kurze stille WAV-Datei zum Freischalten der Wiedergabe innerhalb eines Tipps
const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAIlYAAESsAAACABAAZGF0YQAAAAA=';
let audio: HTMLAudioElement | null = null;
let currentUrl: string | null = null;

export function getAudio(): HTMLAudioElement {
  if (!audio) {
    audio = new Audio();
    audio.preload = 'auto';
    audio.setAttribute('playsinline', '');
  }
  return audio;
}

/** Muss direkt im Tipp/Klick aufgerufen werden: iOS erlaubt späteres Abspielen nur auf einem so freigeschalteten Element. */
export function unlockAudio() {
  try {
    // iOS: als Medienwiedergabe kennzeichnen, damit der Stumm-Schalter das Vorlesen nicht abschaltet
    const nav = navigator as Navigator & { audioSession?: { type: string } };
    if (nav.audioSession) nav.audioSession.type = 'playback';
  } catch { /* nicht unterstützt */ }
  const a = getAudio();
  if (!a.paused && currentUrl) return;
  try {
    a.src = SILENCE;
    const p = a.play();
    if (p) p.catch(() => undefined);
  } catch { /* ignorieren */ }
}

export function playWav(wav: ArrayBuffer): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const a = getAudio();
    if (currentUrl) URL.revokeObjectURL(currentUrl);
    currentUrl = URL.createObjectURL(new Blob([wav], { type: 'audio/wav' }));
    const clean = () => { a.onended = null; a.onerror = null; };
    a.onended = () => { clean(); resolve(); };
    a.onerror = () => { clean(); reject(new Error('audio')); };
    a.src = currentUrl;
    const p = a.play();
    if (p) p.catch((e) => { clean(); reject(e); });
  });
}

export function stopAudio() {
  if (!audio) return;
  audio.onended = null;
  audio.onerror = null;
  try { audio.pause(); } catch { /* ignorieren */ }
  if (currentUrl) { URL.revokeObjectURL(currentUrl); currentUrl = null; }
}

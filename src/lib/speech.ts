import { useEffect, useState, useSyncExternalStore } from 'react';
import type { Question } from '../types';
import { getState } from './store';

/** Vorlesen über die Sprachausgabe des Geräts (Web Speech API). Kostenlos, auf dem iPhone auch offline. */

const LETTERS = 'ABCDEFGH';

export const speechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

let currentId: string | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export function useSpeakingId(): string | null {
  return useSyncExternalStore(
    (fn) => { listeners.add(fn); return () => listeners.delete(fn); },
    () => currentId,
    () => null,
  );
}

export function germanVoices(): SpeechSynthesisVoice[] {
  if (!speechSupported()) return [];
  return window.speechSynthesis.getVoices().filter((v) => v.lang.toLowerCase().startsWith('de'));
}

/** Stimmen laden asynchron (vor allem in Chrome). */
export function useGermanVoices() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(germanVoices());
  useEffect(() => {
    if (!speechSupported()) return;
    const upd = () => setVoices(germanVoices());
    upd();
    window.speechSynthesis.addEventListener('voiceschanged', upd);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', upd);
  }, []);
  return voices;
}

/** Schreibweisen so umformen, dass die Stimme sie sinnvoll ausspricht. */
export function prepareForSpeech(text: string): string {
  return text
    .replace(/z\. ?B\./g, 'zum Beispiel')
    .replace(/d\. ?h\./g, 'das heißt')
    .replace(/u\. ?a\./g, 'unter anderem')
    .replace(/i\. ?d\. ?R\./g, 'in der Regel')
    .replace(/ca\./g, 'circa')
    .replace(/inkl\./g, 'inklusive')
    .replace(/ggf\./g, 'gegebenenfalls')
    .replace(/Abs\./g, 'Absatz')
    .replace(/Art\. (\d)/g, 'Artikel $1')
    .replace(/§ ?(\d)/g, 'Paragraf $1')
    .replace(/(\d+\.\d+\.\d+\.\d+)\/(\d+)/g, '$1 Schrägstrich $2')
    .replace(/(^|[\s(])\/(\d{1,2})\b/g, '$1Schrägstrich $2')
    .replace(/(\d) ?× ?(\d)/g, '$1 mal $2')
    .replace(/×/g, ' mal ')
    .replace(/÷/g, ' geteilt durch ')
    .replace(/(\s)−(\s)/g, '$1minus$2')
    .replace(/→/g, ', ergibt ')
    .replace(/↔/g, ' mit ')
    .replace(/≈/g, ' ungefähr ')
    .replace(/≥/g, ' mindestens ')
    .replace(/(\d)\^(\d+)/g, '$1 hoch $2')
    .replace(/\^/g, ' hoch ')
    .replace(/–/g, ', ')
    .replace(/[„“"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function questionToSpeech(q: Question): string {
  const parts: string[] = [];
  if (q.scenario) parts.push(q.scenario);
  parts.push(q.question);
  if (q.table) {
    if (q.table.caption) parts.push(`Tabelle: ${q.table.caption}.`);
    const [first, ...rest] = q.table.headers;
    for (const row of q.table.rows) {
      const [label, ...cells] = row;
      const head = first ? `${first} ${label}` : String(label);
      parts.push(`${head}: ${cells.map((c, i) => `${rest[i] ?? ''} ${c}`.trim()).join(', ')}.`);
    }
  }
  if (q.type === 'mc' || q.type === 'ms') {
    if (q.type === 'ms') parts.push('Mehrere Antworten können richtig sein.');
    q.options.forEach((o, i) => parts.push(`${LETTERS[i]}: ${o}.`));
  }
  if (q.type === 'calc') parts.push(`Gesucht: ${q.fields.map((f) => f.label + (f.unit ? ` in ${f.unit}` : '')).join(', ')}.`);
  if (q.type === 'match') {
    parts.push('Ordne zu.');
    parts.push(q.pairs.map(([l]) => l).join(', ') + '.');
  }
  return parts.join(' ');
}

/** Lange Texte in Sätze teilen: iOS bricht sehr lange Äußerungen sonst manchmal ab. */
function chunks(text: string): string[] {
  const sentences = text.match(/[^.!?]+[.!?]*/g) ?? [text];
  const out: string[] = [];
  let buf = '';
  for (const s of sentences) {
    if ((buf + s).length > 220 && buf) { out.push(buf.trim()); buf = ''; }
    buf += s;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

export function stopSpeaking() {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
  currentId = null;
  emit();
}

export function speak(id: string, text: string) {
  if (!speechSupported()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const st = getState();
  const voices = germanVoices();
  const voice = voices.find((v) => v.voiceURI === st.speechVoice) ?? voices.find((v) => v.lang === 'de-DE') ?? voices[0];
  const parts = chunks(prepareForSpeech(text));
  currentId = id;
  emit();
  parts.forEach((p, i) => {
    const u = new SpeechSynthesisUtterance(p);
    u.lang = 'de-DE';
    if (voice) u.voice = voice;
    u.rate = st.speechRate ?? 1;
    if (i === parts.length - 1) {
      u.onend = () => { if (currentId === id) { currentId = null; emit(); } };
    }
    u.onerror = () => { if (currentId === id) { currentId = null; emit(); } };
    synth.speak(u);
  });
}

export function toggleSpeak(id: string, text: string) {
  if (currentId === id) stopSpeaking();
  else speak(id, text);
}

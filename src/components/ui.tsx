import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { TutorContext } from '../lib/tutor';

export function useHashRoute(): [string, (r: string) => void] {
  const read = () => decodeURIComponent(location.hash.replace(/^#/, '')) || 'start';
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => {
      setRoute(read());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  const go = (r: string) => {
    if (r === route) return;
    location.hash = r;
  };
  return [route, go];
}

export function go(r: string) {
  location.hash = r;
}

export function Bar({ pct, tone }: { pct: number; tone?: 'good' | 'warn' | 'bad' }) {
  return <div className={`bar ${tone ?? ''}`} role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} /></div>;
}

export const toneFor = (pct: number | null) => (pct === null ? undefined : pct >= 75 ? 'good' : pct >= 50 ? 'warn' : 'bad');

/* ---- Toast ---- */
let toastSetter: ((t: string | null) => void) | null = null;
export function toast(text: string) {
  toastSetter?.(text);
  setTimeout(() => toastSetter?.(null), 2600);
}
export function ToastHost() {
  const [t, setT] = useState<string | null>(null);
  useEffect(() => {
    toastSetter = setT;
    return () => { toastSetter = null; };
  }, []);
  return t ? <div className="toast" role="status">{t}</div> : null;
}

/* ---- Ausbilder-Kontext ---- */
interface TutorApi {
  ctx: TutorContext;
  setCtx: (c: TutorContext) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
  ask: (text: string, c?: TutorContext) => void;
  pendingAsk: string | null;
  clearAsk: () => void;
}
const TutorCtx = createContext<TutorApi | null>(null);
export function TutorProvider({ children }: { children: ReactNode }) {
  const [ctx, setCtx] = useState<TutorContext>({ topic: 'hardware' });
  const [open, setOpen] = useState(false);
  const [pendingAsk, setPendingAsk] = useState<string | null>(null);
  const ask = (text: string, c?: TutorContext) => {
    if (c) setCtx(c);
    setPendingAsk(text);
    setOpen(true);
  };
  return <TutorCtx.Provider value={{ ctx, setCtx, open, setOpen, ask, pendingAsk, clearAsk: () => setPendingAsk(null) }}>{children}</TutorCtx.Provider>;
}
export function useTutor() {
  const t = useContext(TutorCtx);
  if (!t) throw new Error('TutorProvider fehlt');
  return t;
}
/** Setzt den Kontext des Ausbilders für die aktuelle Seite */
export function useTutorContext(c: TutorContext) {
  const { setCtx } = useTutor();
  const key = `${c.topic}|${c.question?.id ?? ''}|${c.result?.points ?? ''}|${JSON.stringify(c.answer ?? '')}`;
  useEffect(() => {
    setCtx(c);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

/** Zählt aktive Lernzeit, solange die Seite sichtbar ist */
export function useStudyTimer(addSeconds: (s: number) => void) {
  useEffect(() => {
    let last = Date.now();
    let lastInput = Date.now();
    const mark = () => { lastInput = Date.now(); };
    ['pointerdown', 'keydown', 'scroll'].forEach((e) => window.addEventListener(e, mark, { passive: true }));
    const id = setInterval(() => {
      const now = Date.now();
      const idle = now - lastInput > 5 * 60 * 1000;
      if (document.visibilityState === 'visible' && !idle) addSeconds(Math.round((now - last) / 1000));
      last = now;
    }, 30000);
    return () => {
      clearInterval(id);
      ['pointerdown', 'keydown', 'scroll'].forEach((e) => window.removeEventListener(e, mark));
    };
  }, [addSeconds]);
}

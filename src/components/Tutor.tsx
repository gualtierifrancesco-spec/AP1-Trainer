import { useEffect, useRef, useState } from 'react';
import { TOPIC_MAP } from '../data/topics';
import { buildRules, getSample, newMemory, offlineTutor, type TutorMemory, type TutorMsg } from '../lib/tutor';
import { useTutor } from './ui';

const QUICK = ['Erkläre es mir einfacher', 'Zeig mir ein Beispiel', 'Gib mir einen Tipp', 'Zeig mir den Rechenweg', 'Warum ist meine Antwort falsch?', 'Gib mir eine schwierigere Aufgabe', 'Erkläre es, als hätte ich noch nie davon gehört'];

type Mode = 'ki' | 'offline';

export function Tutor() {
  const { ctx, open, setOpen, pendingAsk, clearAsk } = useTutor();
  const [msgs, setMsgs] = useState<TutorMsg[]>([]);
  const [mem, setMem] = useState<TutorMemory>(newMemory());
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [aiAvailable, setAiAvailable] = useState<boolean | null>(null);
  const [mode, setMode] = useState<Mode>('offline');
  const [aiNote, setAiNote] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const ctlRef = useRef<AbortController | null>(null);
  const ctxKey = `${ctx.topic}|${ctx.question?.id ?? ''}`;

  useEffect(() => {
    let alive = true;
    getSample().then((s) => {
      if (!alive) return;
      setAiAvailable(!!s);
      if (s) setMode('ki');
    });
    return () => { alive = false; };
  }, []);

  // Neuer Kontext → neues Gespräch
  useEffect(() => {
    const t = TOPIC_MAP[ctx.topic];
    setMsgs([{ role: 'tutor', text: ctx.question ? `Ich sehe die Aufgabe zu ${t.title}. Wobei kann ich helfen? Ich verrate die Lösung nicht sofort, sondern helfe dir, selbst darauf zu kommen.` : `Hallo! Ich bin dein IT-Ausbilder für ${t.title}. Frag mich alles, zum Beispiel „Was ist ${t.terms[0]?.term}?“.` }]);
    setMem(newMemory());
  }, [ctxKey]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [msgs, busy]);

  useEffect(() => {
    if (open && pendingAsk) {
      send(pendingAsk);
      clearAsk();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, pendingAsk]);

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    const next = [...msgs, { role: 'user' as const, text: t }];
    setMsgs(next);
    setInput('');
    if (mode === 'ki' && aiAvailable) {
      const sample = await getSample();
      if (sample) {
        setBusy(true);
        ctlRef.current = new AbortController();
        const turns = next.slice(-12).map((m) => ({ role: m.role === 'user' ? ('user' as const) : ('assistant' as const), content: m.text }));
        while (turns.length && turns[0].role !== 'user') turns.shift();
        const input = [{ role: 'user' as const, content: buildRules(ctx) }, ...turns];
        setMsgs((m) => [...m, { role: 'tutor', text: 'Denke nach …' }]);
        try {
          await sample(input, {
            cache: false,
            modelTier: 'default',
            signal: ctlRef.current.signal,
            onText: ({ text }: { text: string }) => setMsgs((m) => [...m.slice(0, -1), { role: 'tutor', text }]),
          });
        } catch (e) {
          const code = (e as { code?: string }).code;
          const partial = (e as { text?: string }).text;
          if (code === 'not_granted' || code === 'sampling_disabled' || code === 'capability_disabled' || code === 'not_declared') {
            setAiAvailable(false);
            setMode('offline');
            setAiNote('Der KI-Ausbilder wurde nicht freigegeben. Ich antworte jetzt im Offline-Modus.');
          } else if (code === 'rate_limited') {
            setAiNote('Gerade zu viele Anfragen. Versuch es gleich noch einmal oder nutze den Offline-Modus.');
          } else if (code !== 'cancelled') {
            setAiNote('Die Verbindung zum KI-Ausbilder ist abgebrochen. Du kannst es erneut versuchen.');
          }
          if (code === 'not_granted' || code === 'sampling_disabled') {
            const { reply, mem: m2 } = offlineTutor(t, ctx, mem);
            setMem(m2);
            setMsgs((m) => [...m.slice(0, -1), reply]);
          } else {
            setMsgs((m) => [...m.slice(0, -1), { role: 'tutor', text: partial || 'Antwort unterbrochen.' }]);
          }
        } finally {
          setBusy(false);
        }
        return;
      }
    }
    const { reply, mem: m2 } = offlineTutor(t, ctx, mem);
    setMem(m2);
    setMsgs((m) => [...m, reply]);
  }

  if (!open) return null;
  const t = TOPIC_MAP[ctx.topic];
  return (
    <>
      <div className="scrim" onClick={() => setOpen(false)} />
      <aside className="tutor" aria-label="Frag meinen IT-Ausbilder">
        <div className="tutor-head">
          <div>
            <h3>Frag meinen IT-Ausbilder</h3>
            <p className="small muted">{t.title}{ctx.question ? ' · zur aktuellen Aufgabe' : ''}</p>
          </div>
          <button className="btn ghost sm" onClick={() => setOpen(false)} aria-label="Ausbilder schließen">Schließen</button>
        </div>
        <div className="row small" style={{ padding: '8px 16px', borderBottom: '1px solid var(--line)' }}>
          <span className="muted">Modus:</span>
          <div className="chips">
            <button className="chip" aria-pressed={mode === 'ki'} disabled={!aiAvailable} onClick={() => setMode('ki')} title={aiAvailable ? 'Antworten von Claude über dein Claude-Konto' : 'Nur verfügbar, wenn die App in Claude geöffnet ist'}>KI (Claude)</button>
            <button className="chip" aria-pressed={mode === 'offline'} onClick={() => setMode('offline')}>Offline</button>
          </div>
          {aiAvailable === false && <span className="muted">KI nur in der Claude-Version verfügbar</span>}
        </div>
        {aiNote && <p className="small" style={{ padding: '8px 16px', background: 'var(--warn-soft)', color: 'var(--warn)' }}>{aiNote}</p>}
        <div className="tutor-log" ref={logRef} aria-live="polite">
          {msgs.map((m, i) => (
            <div key={i} className={`bubble ${m.role}`}>
              {m.text}
              {m.quiz && m.role === 'tutor' && i === msgs.length - 1 && mem.pending && (
                <div className="chips" style={{ marginTop: 8 }}>
                  {m.quiz.options.map((_, j) => (
                    <button key={j} className="chip" onClick={() => send('ABCDEF'[j])}>{'ABCDEF'[j]}</button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="tutor-quick">
          {QUICK.map((q) => <button key={q} className="chip" onClick={() => send(q)} disabled={busy}>{q}</button>)}
        </div>
        <form className="tutor-form" onSubmit={(e) => { e.preventDefault(); send(input); }}>
          <input id="tutor-input" type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Deine Frage …" aria-label="Frage an den Ausbilder" />
          {busy ? <button type="button" className="btn" onClick={() => ctlRef.current?.abort()}>Stopp</button> : <button className="btn primary" type="submit">Senden</button>}
        </form>
      </aside>
    </>
  );
}

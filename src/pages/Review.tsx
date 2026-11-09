import { useState } from 'react';
import type { Question } from '../types';
import { useAppState } from '../lib/store';
import { dueReviews, wrongQuestions, INTERVALS } from '../lib/progress';
import { TOPIC_MAP } from '../data/topics';
import { QuizRunner, QuizSummaryView, type QuizSummary } from '../components/QuizRunner';
import { go } from '../components/ui';

export function Review() {
  const s = useAppState();
  const due = dueReviews(s);
  const wrong = wrongQuestions(s);
  const [run, setRun] = useState<Question[] | null>(null);
  const [sum, setSum] = useState<QuizSummary | null>(null);

  if (run && !sum) return <div className="wrap narrow"><QuizRunner title="Wiederholung" questions={run} onFinish={setSum} onCancel={() => setRun(null)} /></div>;
  if (sum) return <div className="wrap narrow"><QuizSummaryView s={sum} onAgain={() => { setSum(null); setRun(dueReviews(s).slice(0, 15)); }} onBack={() => { setRun(null); setSum(null); }} /></div>;

  const byTopic = wrong.reduce<Record<string, number>>((a, q) => ({ ...a, [q.topic]: (a[q.topic] ?? 0) + 1 }), {});
  return (
    <div className="wrap narrow">
      <div className="stack tight">
        <span className="eyebrow">Persönlicher Wiederholungsbereich</span>
        <h1>Wiederholen</h1>
        <p className="lead">Jede falsch oder nur teilweise richtig beantwortete Aufgabe landet hier. Beantwortest du sie richtig, kommt sie erst nach {INTERVALS.slice(1).join(', ')} Tagen wieder. Ist sie wieder falsch, beginnt sie von vorne. So bleibt das Wissen langfristig hängen.</p>
      </div>
      <div className="card stack">
        <div className="row between">
          <h3>{due.length} Aufgabe(n) heute fällig</h3>
          <button className="btn primary" disabled={!due.length} onClick={() => setRun(due.slice(0, 15))}>Jetzt wiederholen</button>
        </div>
        {!due.length && <p className="muted">{wrong.length ? 'Für heute ist alles erledigt. Morgen kommen die nächsten Aufgaben.' : 'Noch keine Fehler gesammelt. Übe im Lernmodus oder mach eine Prüfung.'}</p>}
      </div>
      {wrong.length > 0 && (
        <div className="card stack">
          <div className="row between"><h3>Noch nicht gefestigt: {wrong.length}</h3><button className="btn sm" onClick={() => setRun(wrong.slice(0, 20))}>Alle üben</button></div>
          {Object.entries(byTopic).sort((a, b) => b[1] - a[1]).map(([t, n]) => (
            <div key={t} className="row between">
              <span>{TOPIC_MAP[t as keyof typeof TOPIC_MAP].title}</span>
              <span className="row"><span className="badge flag">{n}</span><button className="btn sm" onClick={() => setRun(wrong.filter((q) => q.topic === t))}>Üben</button><button className="btn ghost sm" onClick={() => go(`thema-${t}`)}>Unterricht</button></span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import type { Answer, GradeResult, Question } from '../types';
import { QuestionView } from './QuestionView';
import { emptyAnswer, grade, isAnswered } from '../lib/grading';
import { setState } from '../lib/store';
import { recordResult } from '../lib/progress';
import { Bar, useTutor, useTutorContext } from './ui';

export interface QuizSummary {
  points: number;
  max: number;
  results: { q: Question; res: GradeResult }[];
}

interface Props {
  questions: Question[];
  onFinish: (s: QuizSummary) => void;
  onCancel?: () => void;
  title?: string;
}

/** Lernmodus: Aufgabe beantworten, sofort Lösung sehen, Ergebnis wird für Wiederholung gespeichert */
export function QuizRunner({ questions, onFinish, onCancel, title }: Props) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [checked, setChecked] = useState<Record<string, GradeResult>>({});
  const [overrides, setOverrides] = useState<Record<string, number | undefined>>({});
  const tutor = useTutor();
  const q = questions[i];
  const a = answers[q.id] ?? emptyAnswer(q);
  const res = checked[q.id];
  useTutorContext({ topic: q.topic, question: q, answer: res ? a : undefined, result: res });

  const check = () => {
    const r = grade(q, a);
    setChecked((c) => ({ ...c, [q.id]: r }));
    setState((s) => recordResult(s, q, r));
  };

  const applyOverride = (p: number | undefined) => {
    setOverrides((o) => ({ ...o, [q.id]: p }));
    if (p !== undefined) {
      const fixed: GradeResult = { ...res, points: p, status: p >= q.points ? 'richtig' : p > 0 ? 'teilweise' : 'falsch' };
      // Selbstkorrektur ersetzt die automatische Bewertung im Lernstand
      setState((s) => {
        const st = s.qstats[q.id];
        const base = st ? { ...s, qstats: { ...s.qstats, [q.id]: { ...st, seen: st.seen - 1, correct: st.correct - res.points / res.max, wrongCount: st.wrongCount - (res.points / res.max < 0.8 ? 1 : 0) } } } : s;
        return recordResult(base, q, fixed);
      });
    }
  };

  const finish = () => {
    const results = questions.filter((x) => checked[x.id]).map((x) => ({ q: x, res: { ...checked[x.id], points: overrides[x.id] ?? checked[x.id].points } }));
    onFinish({ points: results.reduce((n, r) => n + r.res.points, 0), max: results.reduce((n, r) => n + r.res.max, 0), results });
  };

  const doneCount = Object.keys(checked).length;
  return (
    <div className="stack">
      <div className="row between">
        <div className="stack tight" style={{ flex: 1, minWidth: 200 }}>
          <span className="small muted">{title ?? 'Lernmodus'} · Aufgabe {i + 1} von {questions.length}</span>
          <Bar pct={(doneCount / questions.length) * 100} />
        </div>
        {onCancel && <button className="btn ghost sm" onClick={onCancel}>Beenden</button>}
      </div>
      <div className="card">
        <QuestionView q={q} answer={a} onChange={res ? undefined : (v) => setAnswers((x) => ({ ...x, [q.id]: v }))} reveal={!!res} result={res}
          override={overrides[q.id]} onOverride={res ? applyOverride : undefined} />
      </div>
      <div className="row between">
        <div className="row">
          <button className="btn" disabled={i === 0} onClick={() => setI(i - 1)}>Zurück</button>
          <button className="btn ghost" onClick={() => tutor.ask(res ? (res.status === 'richtig' ? 'Erkläre mir die Lösung noch einmal einfach.' : 'Warum ist meine Antwort falsch?') : 'Gib mir einen Tipp', { topic: q.topic, question: q, answer: res ? a : undefined, result: res })}>
            {res ? 'Ausbilder fragen' : 'Tipp vom Ausbilder'}
          </button>
        </div>
        <div className="row">
          {!res && <button className="btn primary" disabled={!isAnswered(a)} onClick={check}>Antwort prüfen</button>}
          {!res && <button className="btn ghost" onClick={check}>Weiß ich nicht</button>}
          {res && i < questions.length - 1 && <button className="btn primary" onClick={() => setI(i + 1)}>Nächste Aufgabe</button>}
          {res && i === questions.length - 1 && <button className="btn primary" onClick={finish}>Abschließen</button>}
        </div>
      </div>
    </div>
  );
}

export function QuizSummaryView({ s, onAgain, onBack, extra }: { s: QuizSummary; onAgain: () => void; onBack: () => void; extra?: React.ReactNode }) {
  const pct = s.max ? Math.round((s.points / s.max) * 100) : 0;
  const wrong = s.results.filter((r) => r.res.status !== 'richtig');
  return (
    <div className="card stack">
      <span className="eyebrow">Ergebnis</span>
      <div className="row between"><h2 className="tnum">{s.points} von {s.max} Punkten</h2><span className={`badge ${pct >= 75 ? 'good' : pct >= 50 ? 'warn' : 'bad'}`}>{pct} %</span></div>
      <Bar pct={pct} tone={pct >= 75 ? 'good' : pct >= 50 ? 'warn' : 'bad'} />
      {extra}
      {wrong.length > 0 ? (
        <p className="muted">{wrong.length} Aufgabe(n) wurden in deinen Wiederholungsbereich übernommen. Sie kommen nach dem Prinzip der verteilten Wiederholung wieder: zuerst heute, dann nach 1, 3, 7, 14 und 30 Tagen.</p>
      ) : (
        <p className="muted">Alles richtig. Die Aufgaben kommen erst nach längerer Zeit wieder, um das Wissen zu festigen.</p>
      )}
      <div className="row"><button className="btn primary" onClick={onAgain}>Neue Runde</button><button className="btn" onClick={onBack}>Zurück</button></div>
    </div>
  );
}

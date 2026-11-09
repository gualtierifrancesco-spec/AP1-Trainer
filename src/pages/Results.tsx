import { useState } from 'react';
import { setState, useAppState, getState } from '../lib/store';
import { examScore, examTopicBreakdown, gradeExam, createExam } from '../lib/exam';
import { ihkNote, de } from '../lib/util';
import { TOPIC_MAP } from '../data/topics';
import { QuestionView } from '../components/QuestionView';
import { Bar, go, toneFor, useTutor } from '../components/ui';
import type { TopicId } from '../types';

export function Results({ id }: { id: string }) {
  const s = useAppState();
  const e = s.exams.find((x) => x.id === id);
  const tutor = useTutor();
  const [filter, setFilter] = useState<'alle' | 'falsch' | 'markiert'>('alle');
  if (!e || !e.results) {
    return <div className="wrap narrow"><div className="empty"><p>Diese Auswertung gibt es nicht (mehr).</p><button className="btn" onClick={() => go('pruefung')}>Zur Prüfung</button></div></div>;
  }
  const sc = examScore(e);
  const note = ihkNote(sc.pct);
  const res = e.results;
  const all = Object.values(e.questions);
  const right = all.filter((q) => res[q.id].status === 'richtig').length;
  const partial = all.filter((q) => res[q.id].status === 'teilweise').length;
  const wrong = all.filter((q) => res[q.id].status === 'falsch').length;
  const empty = all.filter((q) => res[q.id].status === 'leer').length;
  const topics = Object.entries(examTopicBreakdown(e)).map(([t, v]) => ({ t: t as TopicId, pct: v.max ? Math.round((v.got / v.max) * 100) : 0, ...v })).sort((a, b) => b.pct - a.pct);
  const strong = topics.filter((x) => x.pct >= 75);
  const weak = topics.filter((x) => x.pct < 60);
  const minutes = Math.round((e.durationMin * 60 - e.remainingSec) / 60);

  const setOverride = (qid: string, p: number | undefined) => {
    setState((st) => ({
      ...st,
      exams: st.exams.map((x) => {
        if (x.id !== e.id) return x;
        const ov = { ...(x.overrides ?? {}) };
        if (p === undefined) delete ov[qid]; else ov[qid] = p;
        return gradeExam({ ...x, overrides: ov });
      }),
    }), true);
  };

  const newExam = () => {
    const ex = createExam(getState());
    setState((st) => ({ ...st, exams: [...st.exams.slice(-29), ex], activeExamId: ex.id }), true);
    go('pruefung');
  };

  return (
    <div className="wrap">
      <div className="page-head">
        <div className="stack tight">
          <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={() => go('pruefung')}>← Prüfungen</button>
          <span className="eyebrow">Auswertung · {new Date(e.finishedAt!).toLocaleString('de-DE', { dateStyle: 'medium', timeStyle: 'short' })}</span>
          <h1>Ergebnis: {note.text} (Note {note.note})</h1>
          <p className="lead">{e.company} · Bearbeitungszeit {minutes} von {e.durationMin} Minuten</p>
        </div>
        <button className="btn primary" onClick={newExam}>Neue Prüfung</button>
      </div>

      <div className="grid g4">
        <div className="card stat"><span className="l">Erreicht</span><span className="v">{de(sc.score, 1)}</span><span className="small muted">von {sc.max} Punkten</span></div>
        <div className="card stat"><span className="l">Leistung</span><span className="v">{de(sc.pct, 1)} %</span><Bar pct={sc.pct} tone={toneFor(sc.pct)} /></div>
        <div className="card stat"><span className="l">IHK-Note</span><span className="v">{note.note}</span><span className="small muted">{note.text}</span></div>
        <div className="card stat"><span className="l">Aufgaben</span><span className="small"><span className="badge good">{right} richtig</span> <span className="badge warn">{partial} teilweise</span></span><span className="small"><span className="badge bad">{wrong} falsch</span> <span className="badge">{empty} leer</span></span></div>
      </div>

      <div className="grid g2">
        <div className="card stack">
          <h3>Ergebnis nach Thema</h3>
          {topics.map((x) => (
            <div className="meter-row" key={x.t}><span>{TOPIC_MAP[x.t].short}</span><Bar pct={x.pct} tone={toneFor(x.pct)} /><span className="pct">{x.pct} %</span></div>
          ))}
          <p className="small muted">IHK-Notenschlüssel: ab 92 % sehr gut, ab 81 % gut, ab 67 % befriedigend, ab 50 % ausreichend, ab 30 % mangelhaft.</p>
        </div>
        <div className="card stack">
          <h3>Das kannst du schon</h3>
          <p>{strong.length ? strong.map((x) => TOPIC_MAP[x.t].title).join(', ') + '.' : 'Noch kein Thema mit mindestens 75 %. Das kommt mit Übung.'}</p>
          <h3>Das solltest du noch lernen</h3>
          {weak.length ? (
            <div className="stack tight">
              {weak.map((x) => (
                <div key={x.t} className="row between">
                  <span>{TOPIC_MAP[x.t].title} ({x.pct} %)</span>
                  <span className="row"><button className="btn sm" onClick={() => go(`thema-${x.t}`)}>Unterricht</button><button className="btn sm" onClick={() => go(`ueben-${x.t}`)}>Üben</button></span>
                </div>
              ))}
            </div>
          ) : <p>Keine großen Lücken. Wiederhole die falsch beantworteten Aufgaben.</p>}
          <p className="small muted">Falsche Aufgaben sind jetzt in deinem Wiederholungsbereich, und schwache Themen kommen in den nächsten Prüfungen häufiger.</p>
        </div>
      </div>

      <div className="row between">
        <h2>Alle Aufgaben mit Musterlösung</h2>
        <div className="chips">
          {(['alle', 'falsch', 'markiert'] as const).map((f) => <button key={f} className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f === 'alle' ? 'Alle' : f === 'falsch' ? 'Nicht volle Punkte' : 'Markierte'}</button>)}
        </div>
      </div>
      {e.blocks.map((b, bi) => {
        const ids = b.questionIds.filter((qid) => filter === 'alle' || (filter === 'falsch' ? res[qid].status !== 'richtig' : e.flagged.includes(qid)));
        if (!ids.length) return null;
        const got = b.questionIds.reduce((n, qid) => n + (e.overrides?.[qid] ?? res[qid].points), 0);
        const mx = b.questionIds.reduce((n, qid) => n + res[qid].max, 0);
        return (
          <section key={bi} className="stack">
            <div className="card tint stack tight"><div className="row between"><b>{b.title}</b><span className="badge tnum">{de(got, 1)} / {mx} P.</span></div><p className="small">{b.situation}</p></div>
            {ids.map((qid) => {
              const q = e.questions[qid];
              const qi = b.questionIds.indexOf(qid);
              return (
                <div key={qid} className="card stack">
                  <QuestionView q={q} answer={e.answers[qid]} result={res[qid]} reveal label={`${bi + 1}${String.fromCharCode(97 + qi)})`} override={e.overrides?.[qid]} onOverride={(p) => setOverride(qid, p)} />
                  <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={() => tutor.ask(res[qid].status === 'richtig' ? 'Erkläre mir die Lösung noch einmal einfach.' : 'Warum ist meine Antwort falsch?', { topic: q.topic, question: q, answer: e.answers[qid], result: res[qid] })}>Ausbilder zu dieser Aufgabe fragen</button>
                </div>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

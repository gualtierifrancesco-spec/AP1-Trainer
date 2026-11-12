import { useEffect, useMemo, useRef, useState } from 'react';
import type { Answer, AppState, ExamRecord } from '../types';
import { getState, setState, useAppState, flush } from '../lib/store';
import { createExam, createFixedExam, examScore, gradeExam } from '../lib/exam';
import { MUSTER_EXAMS } from '../data/questions/muster';
import { recordResult } from '../lib/progress';
import { isAnswered } from '../lib/grading';
import { QuestionView } from '../components/QuestionView';
import { go } from '../components/ui';
import { ihkNote, de } from '../lib/util';

export function ExamPage() {
  const s = useAppState();
  const active = s.exams.find((e) => e.id === s.activeExamId && !e.finishedAt);
  return active ? <RunningExam exam={active} /> : <ExamSetup />;
}

function ExamSetup() {
  const s = useAppState();
  const done = s.exams.filter((e) => e.finishedAt).slice().reverse();
  const start = () => {
    const e = createExam(getState());
    setState((st) => ({ ...st, exams: [...st.exams.slice(-29), e], activeExamId: e.id }), true);
  };
  return (
    <div className="wrap narrow">
      <div className="stack tight">
        <span className="eyebrow">Prüfungsmodus</span>
        <h1>Prüfungssimulation AP1</h1>
        <p className="lead">Die echte AP1 dauert 90 Minuten und wird schriftlich bearbeitet. Diese Simulation bildet das nach: vier Aufgabenblöcke zu je etwa 25 Punkten, eine durchgehende Handlungssituation, gemischte Aufgabentypen. Die Lösung siehst du erst nach der Abgabe.</p>
      </div>
      <div className="card stack">
        <div className="grid g3">
          <div className="stat"><span className="l">Zeit</span><span className="v">{s.examMinutes} Min.</span></div>
          <div className="stat"><span className="l">Punkte</span><span className="v">≈ 100</span></div>
          <div className="stat"><span className="l">Blöcke</span><span className="v">4</span></div>
        </div>
        <div className="field" style={{ maxWidth: 320 }}>
          <label htmlFor="exam-min">Prüfungszeit (Minuten)</label>
          <select id="exam-min" value={s.examMinutes} onChange={(e) => setState((st) => ({ ...st, examMinutes: Number(e.target.value) }))}>
            {[30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} Minuten{m === 90 ? ' (wie in der IHK-Prüfung)' : ''}</option>)}
          </select>
        </div>
        <p className="small muted">Jede Prüfung wird neu zusammengestellt. Aufgaben aus deinen letzten drei Prüfungen kommen seltener vor, schwache Themen häufiger. Rechenaufgaben bekommen jedes Mal neue Zahlen. Dein Bearbeitungsstand wird laufend gespeichert. Schließt du die App, pausiert der Timer, und du kannst später weitermachen.</p>
        <button className="btn primary" style={{ alignSelf: 'flex-start' }} onClick={start}>Neue Prüfung starten</button>
      </div>
      <div className="card stack">
        <h3>Musterprüfung im Format der echten AP1</h3>
        <p className="small muted">Ein fester Aufgabensatz mit 100 Punkten, aufgebaut wie eine echte Prüfung: eine durchgehende Ausgangssituation, fast nur offene Fragen, dazu Abbildungen, Konsolenausgaben, englische Fachtexte und ein Struktogramm. Alle Aufgaben sind eigens für diese App geschrieben.</p>
        {MUSTER_EXAMS.map((m) => (
          <button key={m.id} className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => {
            const e = createFixedExam(getState(), m);
            setState((st) => ({ ...st, exams: [...st.exams.slice(-29), e], activeExamId: e.id }), true);
          }}>{m.title} starten</button>
        ))}
      </div>
      {done.length > 0 && (
        <div className="card stack">
          <h3>Bisherige Prüfungen</h3>
          {done.map((e) => {
            const sc = examScore(e);
            const n = ihkNote(sc.pct);
            return (
              <button key={e.id} className="card flat topic-card" onClick={() => go(`auswertung-${e.id}`)}>
                <div className="row between">
                  <span><b>{new Date(e.finishedAt!).toLocaleDateString('de-DE')} </b><span className="muted small">{e.company}</span></span>
                  <span className="row"><span className="tnum">{de(sc.score, 1)} / {sc.max} P.</span><span className={`badge ${sc.pct >= 67 ? 'good' : sc.pct >= 50 ? 'warn' : 'bad'}`}>Note {n.note}</span></span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function RunningExam({ exam }: { exam: ExamRecord }) {
  const flat = useMemo(() => exam.blocks.flatMap((b, bi) => b.questionIds.map((id, qi) => ({ id, bi, qi }))), [exam.blocks]);
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(exam.remainingSec);
  const [confirm, setConfirm] = useState(false);
  const leftRef = useRef(left);
  leftRef.current = left;

  const update = (fn: (e: ExamRecord) => ExamRecord, immediate = false) =>
    setState((st) => ({ ...st, exams: st.exams.map((e) => (e.id === exam.id ? fn(e) : e)) }), immediate);

  const submit = () => {
    const current = getState().exams.find((e) => e.id === exam.id)!;
    const graded = gradeExam({ ...current, remainingSec: leftRef.current });
    setState((st) => {
      let next: AppState = { ...st, exams: st.exams.map((e) => (e.id === exam.id ? graded : e)), activeExamId: undefined };
      for (const q of Object.values(graded.questions)) next = recordResult(next, q, graded.results![q.id]);
      return next;
    }, true);
    go(`auswertung-${exam.id}`);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setLeft((l) => {
        const n = Math.max(0, l - 1);
        if (n % 5 === 0) update((e) => ({ ...e, remainingSec: n }));
        return n;
      });
    }, 1000);
    return () => { clearInterval(t); update((e) => ({ ...e, remainingSec: leftRef.current })); flush(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (left === 0) submit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left]);

  const cur = flat[idx];
  const q = exam.questions[cur.id];
  const block = exam.blocks[cur.bi];
  const answered = flat.filter((f) => isAnswered(exam.answers[f.id])).length;
  const flagged = exam.flagged.includes(q.id);
  const setAnswer = (a: Answer) => update((e) => ({ ...e, answers: { ...e.answers, [q.id]: a } }));
  const toggleFlag = () => update((e) => ({ ...e, flagged: flagged ? e.flagged.filter((x) => x !== q.id) : [...e.flagged, q.id] }), true);
  const unanswered = flat.length - answered;
  const max = Object.values(exam.questions).reduce((n, x) => n + x.points, 0);

  return (
    <div className="wrap">
      <div className="exam-top">
        <div className="stack tight">
          <span className="small muted">Prüfung · {exam.company}</span>
          <span className="small"><b className="tnum">{answered}</b> von {flat.length} beantwortet · {max} Punkte</span>
        </div>
        <span className={`timer ${left < 300 ? 'low' : ''}`} aria-live="off" aria-label="Verbleibende Zeit">{fmt(left)}</span>
        <div className="row">
          <button className="btn sm" onClick={() => { flush(); go('start'); }}>Pausieren</button>
          <button className="btn primary sm" onClick={() => setConfirm(true)}>Abgeben</button>
        </div>
      </div>

      {confirm && (
        <div className="confirm" role="alertdialog" aria-label="Prüfung abgeben">
          <h3>Prüfung wirklich abgeben?</h3>
          <p>{unanswered > 0 ? `${unanswered} Aufgabe(n) sind noch nicht beantwortet. ` : 'Alle Aufgaben sind beantwortet. '}{exam.flagged.length > 0 ? `${exam.flagged.length} Aufgabe(n) hast du markiert. ` : ''}Nach der Abgabe kannst du nichts mehr ändern.</p>
          <div className="row"><button className="btn primary" onClick={submit}>Ja, jetzt abgeben</button><button className="btn" onClick={() => setConfirm(false)}>Weiter bearbeiten</button></div>
        </div>
      )}

      <div className="exam-layout">
        <div className="stack">
          <div className="card tint stack tight">
            <b>{block.title}</b>
            <p className="small">{block.situation}</p>
          </div>
          <div className="card">
            <QuestionView key={q.id} q={q} answer={exam.answers[q.id]} onChange={setAnswer} label={`${cur.bi + 1}${String.fromCharCode(97 + cur.qi)})`} showMeta={false} hideScenario={q.scenario === block.situation} />
          </div>
          <div className="row between">
            <button className="btn" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>Zurück</button>
            <button className={`btn ${flagged ? 'flagged' : ''}`} onClick={toggleFlag}>{flagged ? '★ Markiert' : '☆ Markieren'}</button>
            {idx < flat.length - 1 ? <button className="btn primary" onClick={() => setIdx(idx + 1)}>Weiter</button> : <button className="btn primary" onClick={() => setConfirm(true)}>Abgeben</button>}
          </div>
        </div>
        <aside className="card stack">
          <b>Aufgabenübersicht</b>
          {exam.blocks.map((b, bi) => (
            <div key={bi} className="stack tight">
              <span className="block-title">{b.title}</span>
              <div className="qmap">
                {b.questionIds.map((id, qi) => {
                  const i = flat.findIndex((f) => f.id === id);
                  return (
                    <button key={id} className={`${isAnswered(exam.answers[id]) ? 'done' : ''} ${i === idx ? 'cur' : ''} ${exam.flagged.includes(id) ? 'flag' : ''}`} onClick={() => setIdx(i)} aria-label={`Aufgabe ${bi + 1}${String.fromCharCode(97 + qi)}`}>
                      {bi + 1}{String.fromCharCode(97 + qi)}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="legend"><span><i style={{ background: 'var(--accent-soft)', border: '1px solid var(--accent)' }} />beantwortet</span><span><i style={{ background: 'var(--flag)', borderRadius: '50%' }} />markiert</span></div>
        </aside>
      </div>
    </div>
  );
}

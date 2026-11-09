import { useMemo } from 'react';
import type { Answer, GradeResult, Question } from '../types';
import { TOPIC_MAP } from '../data/topics';
import { rng, shuffle } from '../lib/util';
import { emptyAnswer, solutionText } from '../lib/grading';
import { questionToSpeech } from '../lib/speech';
import { SpeakButton } from './SpeakButton';

const LETTERS = 'ABCDEFGH';
const TYPE_LABEL: Record<Question['type'], string> = {
  mc: 'Einfachauswahl',
  ms: 'Mehrfachauswahl',
  open: 'Offene Frage',
  calc: 'Rechenaufgabe',
  match: 'Zuordnung',
};
export const LEVEL_LABEL = { 1: 'Anfänger', 2: 'Fortgeschritten', 3: 'IHK-Niveau' } as const;

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

interface Props {
  q: Question;
  answer?: Answer;
  onChange?: (a: Answer) => void;
  result?: GradeResult;
  /** Lösung und Bewertung anzeigen */
  reveal?: boolean;
  label?: string;
  override?: number;
  onOverride?: (pts: number | undefined) => void;
  showMeta?: boolean;
}

export function QuestionView({ q, answer, onChange, result, reveal, label, override, onOverride, showMeta = true }: Props) {
  const a = answer ?? emptyAnswer(q);
  const locked = !onChange || reveal;
  const rights = useMemo(() => (q.type === 'match' ? shuffle(rng(hash(q.id)), q.pairs.map((p, i) => ({ text: p[1], i }))) : []), [q]);

  return (
    <div className="q">
      <div className="q-head">
        {label && <span className="q-num">{label}</span>}
        {showMeta && <span className="badge accent">{TOPIC_MAP[q.topic].short}</span>}
        {showMeta && <span className="badge">{TYPE_LABEL[q.type]}</span>}
        {showMeta && <span className="badge">{LEVEL_LABEL[q.level]}</span>}
        <span className="row" style={{ marginLeft: 'auto', gap: 6 }}>
          <SpeakButton id={`q-${q.id}`} text={() => questionToSpeech(q)} />
          <span className="badge tnum">{q.points} Punkte</span>
        </span>
      </div>
      {q.scenario && <p className="scenario">{q.scenario}</p>}
      <p className="q-text">{q.question}</p>
      {q.table && (
        <div className="tbl-wrap">
          <table className="tbl">
            {q.table.caption && <caption>{q.table.caption}</caption>}
            <thead><tr>{q.table.headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{q.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}>{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      )}

      {q.type === 'mc' && a.type === 'mc' && (
        <div className="opts" role="radiogroup">
          {q.options.map((o, i) => {
            const sel = a.value === i;
            const cls = reveal ? (i === q.correct ? 'ok' : sel ? 'no' : '') : sel ? 'sel' : '';
            return (
              <button key={i} type="button" role="radio" aria-checked={sel} className={`opt ${cls}`} disabled={locked}
                onClick={() => onChange?.({ type: 'mc', value: i })}>
                <span className="key">{LETTERS[i]}</span><span>{o}</span>
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'ms' && a.type === 'ms' && (
        <div className="opts">
          <p className="small muted">Mehrere Antworten können richtig sein. Jede falsche Markierung hebt eine richtige auf.</p>
          {q.options.map((o, i) => {
            const sel = a.value.includes(i);
            const isOk = q.correct.includes(i);
            const cls = reveal ? (isOk ? 'ok' : sel ? 'no' : '') : sel ? 'sel' : '';
            return (
              <button key={i} type="button" role="checkbox" aria-checked={sel} className={`opt ${cls}`} disabled={locked}
                onClick={() => onChange?.({ type: 'ms', value: sel ? a.value.filter((x) => x !== i) : [...a.value, i].sort() })}>
                <span className="key ms-key">{sel ? '✓' : LETTERS[i]}</span><span>{o}</span>
              </button>
            );
          })}
        </div>
      )}

      {q.type === 'open' && a.type === 'open' && (
        <div className="field">
          <label htmlFor={`open-${q.id}`}>Deine Antwort</label>
          <textarea id={`open-${q.id}`} value={a.value} disabled={locked} placeholder="Antworte in ganzen Sätzen. Nenne Fachbegriffe und begründe."
            onChange={(e) => onChange?.({ type: 'open', value: e.target.value })} />
        </div>
      )}

      {q.type === 'calc' && a.type === 'calc' && (
        <div className="calc-grid">
          {q.fields.map((f, i) => (
            <div className="field" key={i}>
              <label htmlFor={`calc-${q.id}-${i}`}>{f.label}</label>
              <div className="calc-in">
                <input id={`calc-${q.id}-${i}`} type="text" inputMode={typeof f.answer === 'number' ? 'decimal' : 'text'} autoComplete="off" value={a.value[i] ?? ''} disabled={locked}
                  placeholder={typeof f.answer === 'number' ? 'z. B. 1.234,56' : 'z. B. 192.168.1.0'}
                  onChange={(e) => {
                    const v = a.value.slice();
                    v[i] = e.target.value;
                    onChange?.({ type: 'calc', value: v });
                  }} />
                {f.unit && <span className="unit">{f.unit}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {q.type === 'match' && a.type === 'match' && (
        <div className="match">
          {q.pairs.map(([left], i) => {
            const v = a.value[i];
            const ok = reveal && v === i;
            return (
              <div key={i} style={{ display: 'contents' }}>
                <span className="l">{left}</span>
                <select id={`match-${q.id}-${i}`} aria-label={`Zuordnung für ${left}`} value={v ?? ''} disabled={locked}
                  style={reveal ? { borderColor: ok ? 'var(--good)' : 'var(--bad)' } : undefined}
                  onChange={(e) => {
                    const val = a.value.slice();
                    val[i] = e.target.value === '' ? null : Number(e.target.value);
                    onChange?.({ type: 'match', value: val });
                  }}>
                  <option value="">– bitte wählen –</option>
                  {rights.map((r) => <option key={r.i} value={r.i}>{r.text}</option>)}
                </select>
              </div>
            );
          })}
        </div>
      )}

      {reveal && <Solution q={q} result={result} override={override} onOverride={onOverride} />}
    </div>
  );
}

function Solution({ q, result, override, onOverride }: { q: Question; result?: GradeResult; override?: number; onOverride?: (p: number | undefined) => void }) {
  const status = result?.status ?? 'leer';
  const pts = override ?? result?.points ?? 0;
  const title = { richtig: 'Richtig', teilweise: 'Teilweise richtig', falsch: 'Leider falsch', leer: 'Nicht beantwortet' }[status];
  return (
    <div className={`feedback ${status}`}>
      <div className="row between">
        <span className="row" style={{ gap: 6 }}><h4>{title}</h4><SpeakButton id={`sol-${q.id}`} label="Lösung vorlesen" text={() => `${title}. Musterlösung: ${solutionText(q)}. ${q.type === 'calc' ? 'Rechenweg: ' + q.steps.join('. ') + '. ' : ''}Erklärung: ${q.explanation}`} /></span>
        <span className="badge tnum">{pts} / {q.points} Punkte{override !== undefined ? ' (selbst korrigiert)' : ''}</span>
      </div>
      {result && result.details.length > 0 && (
        <ul className="detail-list">{result.details.map((d, i) => <li key={i}>{d}</li>)}</ul>
      )}
      <div>
        <b>Musterlösung: </b>
        {q.type === 'match' ? (
          <ul className="detail-list">{q.pairs.map(([l, r], i) => <li key={i}>{l} → {r}</li>)}</ul>
        ) : (
          <span>{solutionText(q)}</span>
        )}
      </div>
      {q.type === 'calc' && (
        <div>
          <b>Rechenweg</b>
          <ol className="steps">{q.steps.map((s, i) => <li key={i}>{s}</li>)}</ol>
        </div>
      )}
      {q.type === 'open' && (
        <div className="small">
          <b>Erwartungshorizont: </b>
          {q.criteria.map((c) => `${c.label} (${c.points} P.)`).join(' · ')}
        </div>
      )}
      <p><b>Erklärung: </b>{q.explanation}</p>
      {q.type === 'open' && onOverride && (
        <div className="row small">
          <span>Fachlich richtig, aber anders formuliert? Punkte selbst vergeben:</span>
          <select aria-label="Punkte selbst vergeben" value={override ?? ''} onChange={(e) => onOverride(e.target.value === '' ? undefined : Number(e.target.value))} style={{ width: 'auto' }}>
            <option value="">automatisch ({result?.points ?? 0})</option>
            {Array.from({ length: q.points + 1 }, (_, i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </div>
      )}
    </div>
  );
}

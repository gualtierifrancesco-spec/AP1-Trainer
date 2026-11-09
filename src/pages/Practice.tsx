import { useState } from 'react';
import type { Level, Question, TopicId } from '../types';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import { POOL } from '../data/bank';
import { GENERATORS, freshGenerated } from '../data/generators';
import { useAppState } from '../lib/store';
import { pickPractice, recommendedLevel, topicMastery } from '../lib/progress';
import { QuizRunner, QuizSummaryView, type QuizSummary } from '../components/QuizRunner';
import { LEVEL_LABEL } from '../components/QuestionView';
import { go, toast } from '../components/ui';

type LevelSel = Level | 'auto' | 'alle';

export function Practice({ preset }: { preset?: TopicId }) {
  const s = useAppState();
  const [topics, setTopics] = useState<TopicId[]>(preset ? [preset] : []);
  const [level, setLevel] = useState<LevelSel>('auto');
  const [count, setCount] = useState(10);
  const [onlyType, setOnlyType] = useState<'alle' | 'calc' | 'open'>('alle');
  const [run, setRun] = useState<Question[] | null>(null);
  const [summary, setSummary] = useState<QuizSummary | null>(null);

  const start = () => {
    const sel = topics.length ? topics : TOPICS.map((t) => t.id);
    let pool = POOL.filter((q) => sel.includes(q.topic) && !q.id.includes('#'));
    // frische Generator-Aufgaben statt fester Varianten, damit sich Zahlen nicht wiederholen
    const gens = GENERATORS.filter((g) => sel.includes(g.topic));
    pool = pool.concat(gens.flatMap((g) => [1, 2].map(() => freshGenerated(g, Math.floor(Math.random() * 1e9)))));
    pool = pool.filter((q) => {
      if (onlyType !== 'alle' && q.type !== onlyType) return false;
      if (level === 'alle') return true;
      const lv = level === 'auto' ? recommendedLevel(s, q.topic).level : level;
      return level === 'auto' ? q.level <= lv && q.level >= Math.max(1, lv - 1) : q.level === lv;
    });
    const qs = pickPractice(s, pool, count);
    if (!qs.length) { toast('Für diese Auswahl gibt es keine Aufgaben. Wähle eine andere Stufe oder einen anderen Typ.'); return; }
    setSummary(null);
    setRun(qs);
  };

  if (run && !summary) return <div className="wrap narrow"><QuizRunner questions={run} onFinish={setSummary} onCancel={() => setRun(null)} /></div>;
  if (summary) return <div className="wrap narrow"><QuizSummaryView s={summary} onAgain={start} onBack={() => { setRun(null); setSummary(null); }} /></div>;

  return (
    <div className="wrap narrow">
      <div className="stack tight">
        <span className="eyebrow">Lernmodus</span>
        <h1>Üben ohne Zeitdruck</h1>
        <p className="lead">Nach jeder Antwort siehst du sofort die Lösung, den Rechenweg und eine Erklärung. Falsche Antworten landen automatisch in deinem Wiederholungsbereich. Schwache Themen kommen häufiger dran.</p>
      </div>
      <div className="card stack">
        <h3>Themen</h3>
        <div className="chips">
          <button className="chip" aria-pressed={topics.length === 0} onClick={() => setTopics([])}>Alle Themen</button>
          {TOPICS.map((t) => {
            const m = topicMastery(s, t.id);
            return (
              <button key={t.id} className="chip" aria-pressed={topics.includes(t.id)} onClick={() => setTopics(topics.includes(t.id) ? topics.filter((x) => x !== t.id) : [...topics, t.id])}>
                {t.short}{m.pct !== null ? ` · ${m.pct} %` : ''}
              </button>
            );
          })}
        </div>
        <h3>Lernstufe</h3>
        <div className="chips">
          <button className="chip" aria-pressed={level === 'auto'} onClick={() => setLevel('auto')}>Automatisch (empfohlen)</button>
          {([1, 2, 3] as Level[]).map((l) => <button key={l} className="chip" aria-pressed={level === l} onClick={() => setLevel(l)}>Stufe {l}: {LEVEL_LABEL[l]}</button>)}
          <button className="chip" aria-pressed={level === 'alle'} onClick={() => setLevel('alle')}>Gemischt</button>
        </div>
        {level === 'auto' && topics.length === 1 && <p className="small muted">{recommendedLevel(s, topics[0]).reason}</p>}
        <h3>Aufgabentyp</h3>
        <div className="chips">
          <button className="chip" aria-pressed={onlyType === 'alle'} onClick={() => setOnlyType('alle')}>Alle Typen</button>
          <button className="chip" aria-pressed={onlyType === 'calc'} onClick={() => setOnlyType('calc')}>Nur Rechenaufgaben</button>
          <button className="chip" aria-pressed={onlyType === 'open'} onClick={() => setOnlyType('open')}>Nur offene Fragen</button>
        </div>
        <h3>Anzahl</h3>
        <div className="chips">{[5, 10, 15, 20].map((n) => <button key={n} className="chip" aria-pressed={count === n} onClick={() => setCount(n)}>{n} Aufgaben</button>)}</div>
        <div className="row"><button className="btn primary" onClick={start}>Los geht's</button>
          {topics.length === 1 && <button className="btn" onClick={() => go(`thema-${topics[0]}`)}>Unterricht zu {TOPIC_MAP[topics[0]].short}</button>}</div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import type { Level, TopicId } from '../types';
import { TOPICS, TOPIC_MAP, FLASHCARDS } from '../data/topics';
import { poolFor } from '../data/bank';
import { useAppState, setState } from '../lib/store';
import { pickPractice, recommendedLevel, topicMastery } from '../lib/progress';
import { Bar, go, toneFor, useTutor, useTutorContext } from '../components/ui';
import { Visual } from '../components/Visuals';
import { Widget } from '../widgets';
import { QuizRunner, QuizSummaryView, type QuizSummary } from '../components/QuizRunner';
import { LEVEL_LABEL } from '../components/QuestionView';
import { SpeakButton } from '../components/SpeakButton';

export function TopicList() {
  const s = useAppState();
  const areas = Array.from(new Set(TOPICS.map((t) => t.area)));
  return (
    <div className="wrap">
      <div className="page-head">
        <div className="stack tight">
          <span className="eyebrow">Unterricht</span>
          <h1>Alle Themen der AP1</h1>
          <p className="lead">Jedes Thema beginnt bei null. Du liest die Grundlagen, beantwortest kleine Verständnisfragen, probierst es interaktiv aus und machst zum Schluss einen Abschlusstest.</p>
        </div>
      </div>
      {areas.map((area) => (
        <section key={area} className="stack">
          <h2>{area}</h2>
          <div className="grid g3">
            {TOPICS.filter((t) => t.area === area).map((t) => {
              const m = topicMastery(s, t.id);
              const tp = s.topics[t.id];
              const rec = recommendedLevel(s, t.id);
              return (
                <button key={t.id} className="card topic-card" onClick={() => go(`thema-${t.id}`)}>
                  <div className="row between"><h3>{t.title}</h3>{tp?.lessonDone && <span className="badge good">gelernt</span>}</div>
                  <p className="small muted">{t.intro.split('. ').slice(0, 2).join('. ')}.</p>
                  <div className="row between small"><span>Stufe {rec.level}: {LEVEL_LABEL[rec.level]}</span><span className="tnum">{m.pct === null ? 'noch offen' : `${m.pct} %`}</span></div>
                  <Bar pct={m.pct ?? 0} tone={toneFor(m.pct)} />
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

type Tab = 'unterricht' | 'interaktiv' | 'wissen' | 'test';

export function TopicView({ id }: { id: TopicId }) {
  const t = TOPIC_MAP[id];
  const s = useAppState();
  const [tab, setTab] = useState<Tab>('unterricht');
  const [sec, setSec] = useState(0);
  const [checkAns, setCheckAns] = useState<Record<number, number>>({});
  const [testQs, setTestQs] = useState<ReturnType<typeof pickPractice> | null>(null);
  const [testDone, setTestDone] = useState<QuizSummary | null>(null);
  const [testLevel, setTestLevel] = useState<Level>(1);
  const tutor = useTutor();
  useTutorContext({ topic: id });
  const m = topicMastery(s, id);
  const rec = recommendedLevel(s, id);
  const tp = s.topics[id] ?? { lessonDone: false, checksPassed: 0, levelUnlocked: 1 as Level, lastStudied: 0 };
  const section = t.sections[sec];
  const isLast = sec === t.sections.length - 1;

  const markDone = () => setState((st) => ({ ...st, topics: { ...st.topics, [id]: { ...tp, lessonDone: true, lastStudied: Date.now() } } }));

  const startTest = (lvl: Level) => {
    setTestLevel(lvl);
    setTestDone(null);
    const pool = poolFor(id).filter((q) => q.level === lvl);
    const fallback = poolFor(id).filter((q) => q.level <= lvl);
    setTestQs(pickPractice(s, pool.length >= 6 ? pool : fallback, 8));
  };

  return (
    <div className="wrap narrow">
      <div className="stack tight">
        <button className="btn ghost sm" style={{ alignSelf: 'flex-start' }} onClick={() => go('lernen')}>← Alle Themen</button>
        <span className="eyebrow">{t.area}</span>
        <h1>{t.title}</h1>
        <div className="row small">
          <span className="badge accent">Empfohlen: Stufe {rec.level} · {LEVEL_LABEL[rec.level]}</span>
          <span className="badge">{m.pct === null ? 'Noch keine Ergebnisse' : `Beherrschung ${m.pct} %`}</span>
          <span className="muted">{rec.reason}</span>
        </div>
      </div>

      <div className="tabs" role="tablist">
        {([['unterricht', 'Unterricht'], ['interaktiv', 'Ausprobieren'], ['wissen', 'Zusammenfassung'], ['test', 'Abschlusstest']] as [Tab, string][]).map(([k, l]) => (
          <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'unterricht' && (
        <div className="stack">
          {sec === 0 && <p className="lead">{t.intro}</p>}
          <div className="row between">
            <div className="lesson-nav" aria-label="Abschnitte">
              {t.sections.map((x, i) => (
                <button key={i} className={`${i === sec ? 'on' : ''} ${checkAns[i] === x.check?.correct ? 'done' : ''}`} onClick={() => setSec(i)} aria-label={`Abschnitt ${i + 1}: ${x.title}`}>{i + 1}</button>
              ))}
            </div>
            <span className="small muted">Abschnitt {sec + 1} von {t.sections.length}</span>
          </div>
          <article className="card lesson-sec">
            <div className="row between"><h2>{section.title}</h2><SpeakButton id={`sec-${id}-${sec}`} label="Abschnitt vorlesen" text={() => [sec === 0 ? t.intro : '', section.title + '.', section.text, section.simple ? 'Einfach gesagt: ' + section.simple : '', section.example ? 'Beispiel aus dem Arbeitsalltag: ' + section.example : ''].filter(Boolean).join(' ')} /></div>
            {section.text.split('\n\n').map((p, i) => <p key={i}>{p}</p>)}
            {section.visual && <div className="visual"><Visual id={section.visual} /></div>}
            {section.simple && <div className="simple"><b>Einfach gesagt</b>{section.simple}</div>}
            {section.example && <div className="example"><b>Beispiel aus dem Arbeitsalltag</b>{section.example}</div>}
            {section.check && (
              <div className="card tint stack">
                <b>Kurze Verständnisfrage</b>
                <p>{section.check.q}</p>
                <div className="opts">
                  {section.check.options.map((o, i) => {
                    const chosen = checkAns[sec];
                    const answered = chosen !== undefined;
                    const cls = answered ? (i === section.check!.correct ? 'ok' : i === chosen ? 'no' : '') : '';
                    return (
                      <button key={i} className={`opt ${cls}`} disabled={answered} onClick={() => {
                        setCheckAns((c) => ({ ...c, [sec]: i }));
                        if (i === section.check!.correct) setState((st) => ({ ...st, topics: { ...st.topics, [id]: { ...tp, checksPassed: tp.checksPassed + 1, lastStudied: Date.now() } } }));
                      }}>
                        <span className="key">{'ABCD'[i]}</span><span>{o}</span>
                      </button>
                    );
                  })}
                </div>
                {checkAns[sec] !== undefined && (
                  <p className={checkAns[sec] === section.check.correct ? '' : ''}><b>{checkAns[sec] === section.check.correct ? 'Richtig. ' : 'Nicht ganz. '}</b>{section.check.explain}</p>
                )}
                {checkAns[sec] !== undefined && checkAns[sec] !== section.check.correct && (
                  <div className="row"><button className="btn sm" onClick={() => setCheckAns((c) => { const n = { ...c }; delete n[sec]; return n; })}>Noch einmal versuchen</button>
                    <button className="btn ghost sm" onClick={() => tutor.ask(`Erkläre mir ${section.title} noch einfacher`)}>Ausbilder fragen</button></div>
                )}
              </div>
            )}
          </article>
          {isLast && t.steps && (
            <div className="card stack">
              <h3>{t.steps.title}</h3>
              <ol className="steps">{t.steps.steps.map((x, i) => <li key={i}>{x}</li>)}</ol>
            </div>
          )}
          <div className="row between">
            <button className="btn" disabled={sec === 0} onClick={() => setSec(sec - 1)}>Zurück</button>
            <button className="btn ghost" onClick={() => tutor.ask(`Erkläre mir ${section.title} noch einfacher`)}>Noch einfacher erklären</button>
            {!isLast ? (
              <button className="btn primary" onClick={() => setSec(sec + 1)}>Weiter</button>
            ) : (
              <button className="btn primary" onClick={() => { markDone(); setTab('interaktiv'); }}>Unterricht abschließen</button>
            )}
          </div>
        </div>
      )}

      {tab === 'interaktiv' && (
        <div className="stack">
          <div className="card stack">
            <h2>{t.widgetTitle}</h2>
            <Widget id={t.widget} />
          </div>
          <div className="row"><button className="btn primary" onClick={() => setTab('test')}>Zum Abschlusstest</button><button className="btn" onClick={() => go(`ueben-${id}`)}>Im Lernmodus üben</button></div>
        </div>
      )}

      {tab === 'wissen' && (
        <div className="stack">
          <div className="card stack"><div className="row between"><h3>Kurz zusammengefasst</h3><SpeakButton id={`sum-${id}`} text={() => `${t.title}. ${t.summary} Merksätze: ${t.merksaetze.join(' ')} Typische Fallen: ${t.traps.join(' ')}`} /></div><p>{t.summary}</p></div>
          <div className="card stack">
            <h3>Fachbegriffe</h3>
            <div className="term-list">{t.terms.map((x) => <div className="term" key={x.term}><b>{x.term}</b><p className="small">{x.def}</p></div>)}</div>
          </div>
          <div className="grid g2">
            <div className="card stack"><h3>Wichtige Formeln und Werte</h3>{t.formulas.map((f) => <div className="formula" key={f}>{f}</div>)}</div>
            <div className="card stack"><h3>Merksätze</h3>{t.merksaetze.map((f) => <p key={f}>{f}</p>)}</div>
          </div>
          <div className="card stack" style={{ borderColor: 'var(--flag)' }}><h3>Typische IHK-Fallen</h3>{t.traps.map((f) => <p key={f}>{f}</p>)}</div>
          <div className="row"><button className="btn primary" onClick={() => go(`karten-${id}`)}>Lernkarten zu diesem Thema ({FLASHCARDS.filter((c) => c.topic === id).length})</button></div>
        </div>
      )}

      {tab === 'test' && (
        <div className="stack">
          {!testQs && (
            <div className="card stack">
              <h3>Abschlusstest: {t.short}</h3>
              <p className="muted">8 Aufgaben zur gewählten Stufe. Ab 70 % auf einer Stufe empfiehlt dir die App die nächste.</p>
              <div className="grid g3">
                {([1, 2, 3] as Level[]).map((l) => (
                  <button key={l} className="card flat topic-card" onClick={() => startTest(l)} style={rec.level === l ? { borderColor: 'var(--accent)' } : undefined}>
                    <div className="row between"><b>Stufe {l}</b>{rec.level === l && <span className="badge accent">empfohlen</span>}</div>
                    <span className="small">{LEVEL_LABEL[l]}</span>
                    <span className="small muted">{m.byLevel[l] === null ? 'noch nicht geübt' : `bisher ${m.byLevel[l]} %`}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          {testQs && !testDone && <QuizRunner title={`Abschlusstest Stufe ${testLevel}`} questions={testQs} onCancel={() => setTestQs(null)} onFinish={(r) => {
            setTestDone(r);
            const pct = r.max ? Math.round((r.points / r.max) * 100) : 0;
            setState((st) => {
              const cur = st.topics[id] ?? tp;
              return { ...st, topics: { ...st.topics, [id]: { ...cur, lessonDone: true, finalTest: { ...(cur.finalTest ?? { 1: 0, 2: 0, 3: 0 }), [testLevel]: Math.max(pct, cur.finalTest?.[testLevel] ?? 0) }, levelUnlocked: (pct >= 70 && testLevel < 3 ? Math.max(cur.levelUnlocked, testLevel + 1) : cur.levelUnlocked) as Level } } };
            });
          }} />}
          {testDone && (
            <QuizSummaryView s={testDone} onAgain={() => startTest(testLevel)} onBack={() => setTestQs(null)}
              extra={(() => {
                const pct = testDone.max ? (testDone.points / testDone.max) * 100 : 0;
                return pct >= 70 && testLevel < 3 ? <p><b>Stark!</b> Du kannst jetzt mit Stufe {testLevel + 1} ({LEVEL_LABEL[(testLevel + 1) as Level]}) weitermachen.</p>
                  : pct < 70 ? <p>Wiederhole den Unterricht oder frag den Ausbilder zu den falschen Aufgaben. Dann versuch es noch einmal.</p>
                  : <p>Du beherrschst dieses Thema auf IHK-Niveau.</p>;
              })()} />
          )}
        </div>
      )}
    </div>
  );
}

import { useAppState } from '../lib/store';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import { learningPlan, readiness, topicMastery, recommendedLevel } from '../lib/progress';
import { Bar, go, toneFor } from '../components/ui';
import { DAY } from '../lib/util';

const ACTION_LABEL = { lernen: 'Neu lernen', wiederholen: 'Wiederholen', 'üben': 'Üben', 'prüfen': 'Vertiefen', gefestigt: 'Gefestigt' } as const;
const ACTION_TONE = { lernen: 'accent', wiederholen: 'flag', 'üben': 'warn', 'prüfen': '', gefestigt: 'good' } as const;

export function Plan() {
  const s = useAppState();
  const plan = learningPlan(s);
  const ready = readiness(s);
  const learned = TOPICS.filter((t) => s.topics[t.id]?.lessonDone);
  const open = TOPICS.filter((t) => !s.topics[t.id]?.lessonDone);
  const verdict = ready.pct >= 75 ? 'Du bist gut vorbereitet. Simuliere jetzt regelmäßig komplette Prüfungen.' : ready.pct >= 50 ? 'Du bist auf einem guten Weg. Schließe die Lücken bei den schwachen Themen.' : ready.coverage < 40 ? 'Arbeite zuerst den Unterricht zu allen Themen durch. Danach wird die Analyse genauer.' : 'Konzentriere dich auf die Themen mit rotem Balken. Übe dort täglich ein paar Aufgaben.';

  return (
    <div className="wrap narrow">
      <div className="stack tight">
        <span className="eyebrow">Mein persönlicher Lernplan</span>
        <h1>Was du als Nächstes tun solltest</h1>
        <p className="lead">Der Plan passt sich nach jeder Übung und jeder Prüfung an. Themen mit schwachen Ergebnissen und viel Prüfungsgewicht stehen oben.</p>
      </div>

      <div className="card stack">
        <div className="row between"><h3>Prüfungsvorbereitung insgesamt</h3><span className="badge tnum">{ready.pct} %</span></div>
        <Bar pct={ready.pct} tone={toneFor(ready.pct)} />
        <p>{verdict}</p>
        <p className="small muted">Bereitschaft = wie viel Stoff du geübt hast ({ready.coverage} %) × wie gut du ihn beherrschst, gewichtet nach Prüfungsrelevanz.</p>
      </div>

      <div className="card stack">
        <h3>Reihenfolge für deine nächsten Lerneinheiten</h3>
        {plan.map((p, i) => {
          const t = TOPIC_MAP[p.topic];
          return (
            <div key={p.topic} className="row between" style={{ borderTop: i ? '1px solid var(--line)' : undefined, paddingTop: i ? 10 : 0 }}>
              <div className="stack tight" style={{ flex: 1, minWidth: 220 }}>
                <span className="row"><b>{i + 1}. {t.title}</b><span className={`badge ${ACTION_TONE[p.action]}`}>{ACTION_LABEL[p.action]}</span></span>
                <span className="small muted">{p.text}</span>
              </div>
              <button className="btn sm" onClick={() => go(p.action === 'lernen' ? `thema-${p.topic}` : p.action === 'wiederholen' ? 'wiederholen' : `ueben-${p.topic}`)}>Starten</button>
            </div>
          );
        })}
      </div>

      <div className="card stack">
        <h3>Schwächenanalyse</h3>
        {TOPICS.map((t) => {
          const m = topicMastery(s, t.id);
          const last = s.topics[t.id]?.lastStudied;
          const rec = recommendedLevel(s, t.id);
          return (
            <div key={t.id} className="stack tight">
              <div className="meter-row"><span>{t.short}</span><Bar pct={m.pct ?? 0} tone={toneFor(m.pct)} /><span className="pct">{m.pct === null ? '–' : `${m.pct} %`}</span></div>
              <span className="small muted">Stufe 1: {m.byLevel[1] ?? '–'}{m.byLevel[1] !== null ? ' %' : ''} · Stufe 2: {m.byLevel[2] ?? '–'}{m.byLevel[2] !== null ? ' %' : ''} · Stufe 3: {m.byLevel[3] ?? '–'}{m.byLevel[3] !== null ? ' %' : ''} · {m.answered} Aufgaben · zuletzt {last ? `vor ${Math.floor((Date.now() - last) / DAY)} Tag(en)` : 'nie'} · empfohlen Stufe {rec.level} · Prüfungsgewicht {t.examWeight} %</span>
            </div>
          );
        })}
      </div>

      <div className="grid g2">
        <div className="card stack"><h3>Bereits gelernt</h3><p>{learned.length ? learned.map((t) => t.short).join(', ') : 'Noch kein Unterricht abgeschlossen.'}</p></div>
        <div className="card stack"><h3>Noch zu lernen</h3><p>{open.length ? open.map((t) => t.short).join(', ') : 'Alle Themen durchgearbeitet.'}</p></div>
      </div>
      <p className="small muted">Alle Themen sind prüfungsrelevant für die AP1. Das Prüfungsgewicht ist eine Schätzung auf Basis der Prüfungsanforderungen (§ 8 der Ausbildungsverordnung) und typischer AP1-Aufgaben, keine offizielle IHK-Angabe.</p>
    </div>
  );
}

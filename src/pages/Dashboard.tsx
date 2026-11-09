import { useAppState } from '../lib/store';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import { POOL_STATS } from '../data/bank';
import { dueReviews, learningPlan, readiness, topicMastery } from '../lib/progress';
import { examScore } from '../lib/exam';
import { fmtDuration, ihkNote, todayKey, de } from '../lib/util';
import { Bar, go, toneFor } from '../components/ui';

export function Dashboard() {
  const s = useAppState();
  const ready = readiness(s);
  const done = s.exams.filter((e) => e.finishedAt);
  const last = done[done.length - 1];
  const best = done.reduce<typeof last | undefined>((b, e) => (!b || examScore(e).pct > examScore(b).pct ? e : b), undefined);
  const answered = Object.values(s.qstats).reduce((n, x) => n + x.seen, 0);
  const distinct = Object.keys(s.qstats).length;
  const avg = (() => {
    const st = Object.values(s.qstats);
    if (!st.length) return null;
    return Math.round((st.reduce((a, x) => a + x.correct, 0) / st.reduce((a, x) => a + x.seen, 0)) * 100);
  })();
  const masteries = TOPICS.map((t) => ({ t, m: topicMastery(s, t.id) })).filter((x) => x.m.pct !== null);
  const weakest = [...masteries].sort((a, b) => a.m.pct! - b.m.pct!).slice(0, 3);
  const strongest = [...masteries].sort((a, b) => b.m.pct! - a.m.pct!).slice(0, 3);
  const plan = learningPlan(s).slice(0, 3);
  const due = dueReviews(s).length;
  const today = s.dailySeconds[todayKey()] ?? 0;
  const week = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return { d, sec: s.dailySeconds[todayKey(d)] ?? 0 };
  });
  const maxWeek = Math.max(1800, ...week.map((w) => w.sec));
  const isNew = answered === 0 && done.length === 0;

  return (
    <div className="wrap">
      <div className="page-head">
        <div className="stack tight">
          <span className="eyebrow">AP1 · Einrichten eines IT-gestützten Arbeitsplatzes</span>
          <h1>{isNew ? 'Willkommen im Prüfungstrainer' : 'Dein Lernstand'}</h1>
          <p className="lead">
            {isNew
              ? 'Hier lernst du den gesamten Stoff der AP1 Schritt für Schritt und testest dich danach unter echten Prüfungsbedingungen: 90 Minuten, 100 Punkte, vier Aufgabenblöcke.'
              : `Prüfungsbereitschaft ${ready.pct} %. Du hast ${ready.coverage} % des Stoffs schon geübt.`}
          </p>
        </div>
        <div className="row">
          <button className="btn" onClick={() => go('lernen')}>Unterricht starten</button>
          <button className="btn primary" onClick={() => go('pruefung')}>Prüfung simulieren</button>
        </div>
      </div>

      <div className="grid g4">
        <div className="card stat"><span className="l">Gesamtfortschritt</span><span className="v">{ready.pct} %</span><Bar pct={ready.pct} tone={toneFor(ready.pct)} /></div>
        <div className="card stat"><span className="l">Bearbeitete Aufgaben</span><span className="v">{answered}</span><span className="small muted">{distinct} verschiedene von {POOL_STATS.total}</span></div>
        <div className="card stat"><span className="l">Ø Punktzahl</span><span className="v">{avg === null ? '–' : `${avg} %`}</span><span className="small muted">über alle Übungen</span></div>
        <div className="card stat"><span className="l">Lernzeit</span><span className="v">{fmtDuration(s.studySeconds)}</span><span className="small muted">heute {fmtDuration(today)}</span></div>
      </div>

      <div className="grid g3">
        <div className="card stack">
          <h3>Letzte Prüfung</h3>
          {last ? (() => { const sc = examScore(last); const n = ihkNote(sc.pct); return (
            <>
              <div className="row between"><span className="note-grade tnum">{de(sc.score, 1)}</span><span className="badge">{n.note} · {n.text}</span></div>
              <p className="small muted">von {sc.max} Punkten · {new Date(last.finishedAt!).toLocaleDateString('de-DE')}</p>
              <button className="btn sm" onClick={() => go(`auswertung-${last.id}`)}>Auswertung ansehen</button>
            </>); })() : <p className="muted">Noch keine Prüfung abgelegt.</p>}
        </div>
        <div className="card stack">
          <h3>Beste Prüfung</h3>
          {best ? (() => { const sc = examScore(best); const n = ihkNote(sc.pct); return (
            <>
              <div className="row between"><span className="note-grade tnum">{Math.round(sc.pct)} %</span><span className="badge good">{n.note} · {n.text}</span></div>
              <p className="small muted">{done.length} Prüfung(en) insgesamt</p>
            </>); })() : <p className="muted">Sobald du Prüfungen abgibst, siehst du hier dein bestes Ergebnis.</p>}
        </div>
        <div className="card stack">
          <h3>Lernzeit der letzten 7 Tage</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, alignItems: 'end', height: 90 }}>
            {week.map((w, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }} title={fmtDuration(w.sec)}>
                <div style={{ width: '70%', height: `${Math.max(4, (w.sec / maxWeek) * 70)}px`, background: w.sec ? 'var(--accent)' : 'var(--line)', borderRadius: 3 }} />
                <span className="small muted">{w.d.toLocaleDateString('de-DE', { weekday: 'short' }).slice(0, 2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid g2">
        <div className="card stack">
          <div className="row between"><h3>Als Nächstes</h3><button className="btn ghost sm" onClick={() => go('plan')}>Ganzer Lernplan</button></div>
          {due > 0 && (
            <button className="card flat topic-card" onClick={() => go('wiederholen')} style={{ borderColor: 'var(--flag)' }}>
              <div className="row between"><b>{due} Wiederholung(en) fällig</b><span className="badge flag">Wiederholen</span></div>
            </button>
          )}
          {plan.map((p) => (
            <button key={p.topic} className="card flat topic-card" onClick={() => go(p.action === 'lernen' ? `thema-${p.topic}` : p.action === 'wiederholen' ? 'wiederholen' : `ueben-${p.topic}`)}>
              <div className="row between"><b>{TOPIC_MAP[p.topic].title}</b><span className="badge accent">{p.action}</span></div>
              <span className="small muted">{p.text}</span>
            </button>
          ))}
        </div>
        <div className="card stack">
          <h3>Stärken und Schwächen</h3>
          {masteries.length === 0 ? (
            <p className="muted">Nach ein paar Übungen siehst du hier, welche Themen du beherrschst und welche du noch lernen musst.</p>
          ) : (
            <>
              <span className="area-label">Schwächste Themen</span>
              {weakest.map(({ t, m }) => (
                <div className="meter-row" key={t.id}><span>{t.short}</span><Bar pct={m.pct!} tone={toneFor(m.pct)} /><span className="pct">{m.pct} %</span></div>
              ))}
              <span className="area-label" style={{ marginTop: 6 }}>Stärkste Themen</span>
              {strongest.map(({ t, m }) => (
                <div className="meter-row" key={t.id}><span>{t.short}</span><Bar pct={m.pct!} tone={toneFor(m.pct)} /><span className="pct">{m.pct} %</span></div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="card stack">
        <div className="row between"><h3>Persönlicher Lernfortschritt nach Thema</h3><span className="small muted">{POOL_STATS.fixed} ausformulierte Aufgaben · {POOL_STATS.generators} Rechen-Generatoren</span></div>
        {TOPICS.map((t) => {
          const m = topicMastery(s, t.id);
          return (
            <div className="meter-row" key={t.id}>
              <button className="btn ghost sm" style={{ justifyContent: 'flex-start', padding: 0 }} onClick={() => go(`thema-${t.id}`)}>{t.short}</button>
              <Bar pct={m.pct ?? 0} tone={toneFor(m.pct)} />
              <span className="pct">{m.pct === null ? '–' : `${m.pct} %`}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

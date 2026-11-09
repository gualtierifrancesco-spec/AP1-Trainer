import { useCallback, useEffect } from 'react';
import { addStudyTime, useAppState } from './lib/store';
import { dueReviews } from './lib/progress';
import { ToastHost, TutorProvider, useHashRoute, useStudyTimer, useTutor } from './components/ui';
import { Tutor } from './components/Tutor';
import { Dashboard } from './pages/Dashboard';
import { TopicList, TopicView } from './pages/Topics';
import { Practice } from './pages/Practice';
import { ExamPage } from './pages/Exam';
import { Results } from './pages/Results';
import { Review } from './pages/Review';
import { Flashcards } from './pages/Flashcards';
import { Plan } from './pages/Plan';
import { Options } from './pages/Options';
import type { TopicId } from './types';
import { TOPIC_MAP } from './data/topics';
import { stopSpeaking } from './lib/speech';
import { checkNeural } from './lib/neuralTts';

const NAV = [
  { id: 'start', label: 'Dashboard', icon: '▦' },
  { id: 'lernen', label: 'Unterricht', icon: '◧' },
  { id: 'ueben', label: 'Lernmodus', icon: '✎' },
  { id: 'pruefung', label: 'Prüfung', icon: '⏱' },
  { id: 'wiederholen', label: 'Wiederholen', icon: '↻' },
  { id: 'karten', label: 'Lernkarten', icon: '▤' },
  { id: 'plan', label: 'Lernplan', icon: '☰' },
  { id: 'optionen', label: 'Einstellungen', icon: '⚙' },
];
const TABS = ['start', 'lernen', 'ueben', 'pruefung', 'mehr'];
const MORE = ['wiederholen', 'karten', 'plan', 'optionen', 'mehr'];

function section(route: string) {
  const base = route.split('-')[0];
  if (base === 'thema') return 'lernen';
  if (base === 'auswertung') return 'pruefung';
  return base;
}

function Shell() {
  const [route, go] = useHashRoute();
  const s = useAppState();
  const due = dueReviews(s).length;
  const tutor = useTutor();
  const add = useCallback((sec: number) => addStudyTime(sec), []);
  useStudyTimer(add);

  useEffect(() => {
    const root = document.documentElement;
    if (s.theme === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', s.theme);
  }, [s.theme]);

  useEffect(() => { stopSpeaking(); }, [route]);
  useEffect(() => { void checkNeural(); }, []);

  const cur = section(route);
  const examRunning = route === 'pruefung' && !!s.activeExamId;

  let page;
  const [base, ...rest] = route.split('-');
  const arg = rest.join('-');
  switch (base) {
    case 'lernen': page = <TopicList />; break;
    case 'thema': page = TOPIC_MAP[arg as TopicId] ? <TopicView key={arg} id={arg as TopicId} /> : <TopicList />; break;
    case 'ueben': page = <Practice key={arg} preset={TOPIC_MAP[arg as TopicId] ? (arg as TopicId) : undefined} />; break;
    case 'pruefung': page = <ExamPage />; break;
    case 'auswertung': page = <Results id={arg} />; break;
    case 'wiederholen': page = <Review />; break;
    case 'karten': page = <Flashcards key={arg} preset={TOPIC_MAP[arg as TopicId] ? (arg as TopicId) : undefined} />; break;
    case 'plan': page = <Plan />; break;
    case 'optionen': page = <Options />; break;
    case 'mehr': page = <More due={due} />; break;
    default: page = <Dashboard />;
  }

  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">
          <div className="brand-mark">AP1</div>
          <div><b>Prüfungstrainer</b><span>IT-System-Management</span></div>
        </div>
        <nav className="nav" aria-label="Hauptnavigation">
          {NAV.map((n) => (
            <button key={n.id} aria-current={cur === n.id ? 'page' : undefined} onClick={() => go(n.id)}>
              <span aria-hidden="true" style={{ width: 18, textAlign: 'center' }}>{n.icon}</span>{n.label}
              {n.id === 'wiederholen' && due > 0 && <span className="badge flag">{due}</span>}
            </button>
          ))}
        </nav>
        <div className="side-foot">Einrichten eines IT-gestützten Arbeitsplatzes · Teil 1 der Abschlussprüfung</div>
      </aside>
      <main className="main">{page}</main>
      <nav className="tabbar" aria-label="Navigation">
        {TABS.map((id) => {
          const n = NAV.find((x) => x.id === id) ?? { id: 'mehr', label: due ? `Mehr (${due})` : 'Mehr', icon: '⋯' };
          const on = id === 'mehr' ? MORE.includes(cur) : cur === id;
          return (
            <button key={id} aria-current={on ? 'page' : undefined} onClick={() => go(id)}>
              <span aria-hidden="true" style={{ fontSize: '1.1rem' }}>{n.icon}</span>{n.label}
            </button>
          );
        })}
      </nav>
      {!examRunning && !tutor.open && (
        <button className="tutor-fab" onClick={() => tutor.setOpen(true)} aria-label="Frag meinen IT-Ausbilder">
          <span aria-hidden="true">💬</span><span className="hide-sm">Frag meinen IT-Ausbilder</span>
        </button>
      )}
      <Tutor />
      <ToastHost />
    </div>
  );
}

function More({ due }: { due: number }) {
  return (
    <div className="wrap narrow">
      <h1>Mehr</h1>
      <div className="stack">
        {NAV.filter((n) => MORE.includes(n.id)).map((n) => (
          <button key={n.id} className="card flat topic-card" onClick={() => (location.hash = n.id)}>
            <div className="row between"><h3>{n.icon} {n.label}</h3>{n.id === 'wiederholen' && due > 0 && <span className="badge flag">{due} fällig</span>}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <TutorProvider>
      <Shell />
    </TutorProvider>
  );
}

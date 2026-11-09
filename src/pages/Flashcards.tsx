import { useMemo, useState } from 'react';
import type { TopicId } from '../types';
import { FLASHCARDS, TOPICS, TOPIC_MAP } from '../data/topics';
import { setState, useAppState } from '../lib/store';
import { cardDue, rateCard } from '../lib/progress';
import { shuffle, rng } from '../lib/util';
import { SpeakButton } from '../components/SpeakButton';

export function Flashcards({ preset }: { preset?: TopicId }) {
  const s = useAppState();
  const [topic, setTopic] = useState<TopicId | 'alle'>(preset ?? 'alle');
  const [onlyDue, setOnlyDue] = useState(true);
  const [seed, setSeed] = useState(1);
  const [flipped, setFlipped] = useState(false);
  const [mode, setMode] = useState<'karten' | 'liste'>('karten');

  const deck = useMemo(() => {
    const base = FLASHCARDS.filter((c) => topic === 'alle' || c.topic === topic);
    return shuffle(rng(seed), base);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, seed]);
  const queue = deck.filter((c) => !onlyDue || cardDue(s, c.id));
  const card = queue[0];
  const known = deck.filter((c) => (s.cards[c.id]?.box ?? 0) >= 2).length;

  const rate = (ok: boolean) => {
    if (!card) return;
    setFlipped(false);
    setState((st) => rateCard(st, card.id, ok));
    if (!ok) setSeed((x) => x + 1);
  };

  return (
    <div className="wrap narrow">
      <div className="stack tight">
        <span className="eyebrow">Lernkarten</span>
        <h1>Schnell wiederholen</h1>
        <p className="lead">Begriffe, Formeln und typische IHK-Fallen. Karte antippen zum Umdrehen. Gewusste Karten kommen später wieder, nicht gewusste sofort.</p>
      </div>
      <div className="card stack">
        <div className="field" style={{ maxWidth: 360 }}>
          <label htmlFor="fc-topic">Thema</label>
          <select id="fc-topic" value={topic} onChange={(e) => { setTopic(e.target.value as TopicId | 'alle'); setFlipped(false); }}>
            <option value="alle">Alle Themen ({FLASHCARDS.length} Karten)</option>
            {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div className="row">
          <div className="chips">
            <button className="chip" aria-pressed={mode === 'karten'} onClick={() => setMode('karten')}>Karteikarten</button>
            <button className="chip" aria-pressed={mode === 'liste'} onClick={() => setMode('liste')}>Spickzettel vor der Prüfung</button>
          </div>
          {mode === 'karten' && <label className="row small"><input id="fc-due" type="checkbox" checked={onlyDue} onChange={(e) => setOnlyDue(e.target.checked)} /> nur fällige Karten</label>}
          <span className="small muted tnum" style={{ marginLeft: 'auto' }}>{known} von {deck.length} gefestigt · {queue.length} offen</span>
        </div>
      </div>

      {mode === 'karten' && (card ? (
        <div className="stack">
          <div className={`flash ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)} role="button" tabIndex={0} aria-label="Karte umdrehen" onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); setFlipped(!flipped); } }}>
            <div className="flash-inner">
              <div className="flash-face">
                <span className="badge accent">{card.kind} · {TOPIC_MAP[card.topic].short}</span>
                <span className="big">{card.front}</span>
                <SpeakButton id={`fc-f-${card.id}`} text={card.front} />
                <span className="small muted">Tippen zum Umdrehen</span>
              </div>
              <div className="flash-face back">
                <span className="badge">{card.kind}</span>
                <p style={{ fontSize: '1.1rem' }}>{card.back}</p>
                <SpeakButton id={`fc-b-${card.id}`} text={card.back} />
              </div>
            </div>
          </div>
          <div className="row" style={{ justifyContent: 'center' }}>
            <button className="btn" onClick={() => rate(false)}>Wusste ich nicht</button>
            <button className="btn primary" onClick={() => rate(true)}>Wusste ich</button>
          </div>
        </div>
      ) : (
        <div className="card empty">
          <p>Alle Karten dieser Auswahl sind für heute erledigt.</p>
          <button className="btn" onClick={() => setOnlyDue(false)}>Trotzdem alle Karten üben</button>
        </div>
      ))}

      {mode === 'liste' && (
        <div className="stack">
          {(topic === 'alle' ? TOPICS : [TOPIC_MAP[topic]]).map((t) => (
            <div key={t.id} className="card stack">
              <h3>{t.title}</h3>
              <p>{t.summary}</p>
              {t.formulas.map((f) => <div key={f} className="formula">{f}</div>)}
              <p><b>Merksätze: </b>{t.merksaetze.join(' ')}</p>
              <p style={{ color: 'var(--flag)' }}><b>Fallen: </b>{t.traps.join(' ')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

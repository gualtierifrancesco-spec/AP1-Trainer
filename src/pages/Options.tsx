import { useState } from 'react';
import { defaultState, exportState, importState, replaceState, setState, storageAvailable, useAppState } from '../lib/store';
import { POOL_STATS } from '../data/bank';
import { FLASHCARDS, TOPICS } from '../data/topics';
import { toast } from '../components/ui';
import { pickVoice, speak, speechSupported, useGermanVoices, voiceQuality } from '../lib/speech';
import { loadNeural, NEURAL_SIZE_MB, NEURAL_VOICE_NAME, unlockAudio, useNeuralState } from '../lib/neuralTts';
import { Bar } from '../components/ui';

export function Options() {
  const s = useAppState();
  const [backup, setBackup] = useState('');
  const [importText, setImportText] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);
  const voices = useGermanVoices();
  const neural = useNeuralState();
  const neuralOn = s.speechEngine === 'neural' && neural.status !== 'unavailable';
  const enableNeural = () => {
    unlockAudio();
    setState((st) => ({ ...st, speechEngine: 'neural' }), true);
    loadNeural().then(() => speak('test', 'Hallo, ich bin die neue Stimme. Wir lernen jetzt gemeinsam für die AP1.'), () => undefined);
  };

  const copy = async () => {
    const data = exportState();
    setBackup(data);
    try {
      await navigator.clipboard.writeText(data);
      toast('Sicherung in die Zwischenablage kopiert.');
    } catch {
      toast('Kopieren nicht möglich. Markiere den Text unten und kopiere ihn selbst.');
    }
  };

  return (
    <div className="wrap narrow">
      <div className="stack tight"><span className="eyebrow">Einstellungen</span><h1>Einstellungen</h1></div>

      <div className="card stack">
        <h3>Darstellung</h3>
        <div className="chips">
          {(['system', 'light', 'dark'] as const).map((t) => (
            <button key={t} className="chip" aria-pressed={s.theme === t} onClick={() => setState((st) => ({ ...st, theme: t }), true)}>{t === 'system' ? 'Wie das Gerät' : t === 'light' ? 'Hell' : 'Dunkel'}</button>
          ))}
        </div>
      </div>

      <div className="card stack">
        <h3>Vorlesen</h3>
        {neural.status !== 'unavailable' && neural.status !== 'unknown' && (
          <div className="card tint stack">
            <div className="row between"><b>Natürliche KI-Stimme „{NEURAL_VOICE_NAME}“</b>{neuralOn && neural.status === 'ready' && <span className="badge good">aktiv</span>}</div>
            <p className="small">Diese Stimme rechnet direkt auf deinem Gerät. Sie klingt deutlich natürlicher als die eingebaute Stimme, ist kostenlos und funktioniert nach dem Laden auch offline. Einmalig werden etwa {NEURAL_SIZE_MB} MB geladen, am besten im WLAN. Vor jedem Text rechnet sie ein paar Sekunden.</p>
            {neural.status === 'loading' && (
              <div className="stack tight"><Bar pct={neural.progress * 100} /><span className="small muted tnum">{neural.stage === 'Stimme' ? `Stimme wird geladen: ${Math.round(neural.progress * 100)} %` : neural.stage === 'Starte' ? 'Stimme wird gestartet …' : 'Sprachdaten werden geladen …'}</span></div>
            )}
            {neural.status === 'error' && <p className="small" style={{ color: 'var(--bad)' }}>{neural.error}</p>}
            <div className="row">
              {!neuralOn && <button className="btn primary" onClick={enableNeural}>KI-Stimme einschalten</button>}
              {neuralOn && neural.status !== 'loading' && <button className="btn" onClick={() => { if (neural.status === 'ready') speak('test', 'So klinge ich. Ein Netz mit /26 hat 62 nutzbare Hosts.'); else enableNeural(); }}>{neural.status === 'ready' ? '🔊 Probe hören' : neural.status === 'error' ? 'Noch einmal versuchen' : 'Stimme jetzt laden'}</button>}
              {neuralOn && <button className="btn ghost" onClick={() => setState((st) => ({ ...st, speechEngine: 'device' }), true)}>Zurück zur Stimme des Geräts</button>}
            </div>
          </div>
        )}
        {!speechSupported() ? (
          <p className="muted">Dieser Browser hat keine Sprachausgabe. Auf iPhone, Android und in Chrome, Edge oder Safari funktioniert es.</p>
        ) : (
          <>
            <p className="small muted">Neben jeder Aufgabe, jedem Unterrichtsabschnitt, jeder Lernkarte und jeder Antwort des Ausbilders gibt es einen 🔊-Knopf. Die Stimme kommt vom Gerät und funktioniert auf dem iPhone auch offline.</p>
            <span className="small" style={{ fontWeight: 700 }}>Geschwindigkeit</span>
            <div className="chips">
              {[[0.8, 'Langsam'], [0.95, 'Ruhig'], [1.05, 'Normal'], [1.2, 'Schneller']].map(([r, l]) => (
                <button key={r} className="chip" aria-pressed={(s.speechRate ?? 0.95) === r} onClick={() => setState((st) => ({ ...st, speechRate: r as number }), true)}>{l}</button>
              ))}
            </div>
            {voices.length > 0 && !neuralOn && (
              <div className="field" style={{ maxWidth: 420 }}>
                <label htmlFor="opt-voice">Stimme des Geräts</label>
                <select id="opt-voice" value={s.speechVoice ?? ''} onChange={(e) => { const v = e.target.value || undefined; setState((st) => ({ ...st, speechVoice: v }), true); setTimeout(() => speak('test', 'Hallo, so klinge ich. Wir lernen heute gemeinsam für die AP1.'), 50); }}>
                  <option value="">Automatisch: {pickVoice()?.name ?? 'Stimme des Geräts'}</option>
                  {voices.map((v) => { const q = voiceQuality(v); return <option key={v.voiceURI} value={v.voiceURI}>{q === 'gut' ? '★ ' : ''}{v.name}{q === 'roboter' ? ' (Roboter-Stimme)' : ''}{v.localService ? '' : ' (online)'}</option>; })}
                </select>
                {!voices.some((v) => voiceQuality(v) === 'gut') && (
                  <p className="small muted">Dieses Gerät gibt Web-Apps keine hochwertige deutsche Stimme frei. Auf dem iPhone ist das eine Einschränkung von Apple: Nachgeladene Stimmen (Erweitert, Premium, Siri) stehen nur Apple-Apps zur Verfügung. Am PC in Chrome oder Edge klingen die Stimmen meist deutlich besser.</p>
                )}
              </div>
            )}
            <label className="row small"><input id="opt-auto" type="checkbox" checked={!!s.speechAuto} onChange={(e) => setState((st) => ({ ...st, speechAuto: e.target.checked }), true)} /> Aufgaben im Lernmodus automatisch vorlesen</label>
            <button className="btn" style={{ alignSelf: 'flex-start' }} onClick={() => speak('test', 'Hallo! So klinge ich. Ein Netz mit /26 hat 2^6 − 2, also 62 nutzbare Hosts.')}>🔊 Stimme testen</button>
          </>
        )}
      </div>

      <div className="card stack">
        <h3>Prüfungszeit</h3>
        <div className="field" style={{ maxWidth: 300 }}>
          <label htmlFor="opt-min">Dauer einer Simulation</label>
          <select id="opt-min" value={s.examMinutes} onChange={(e) => setState((st) => ({ ...st, examMinutes: Number(e.target.value) }), true)}>
            {[30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} Minuten</option>)}
          </select>
        </div>
      </div>

      <div className="card stack">
        <h3>Lernfortschritt sichern</h3>
        <p className="small muted">Dein Fortschritt wird nur auf diesem Gerät in diesem Browser gespeichert. {storageAvailable ? '' : 'Achtung: Der Browser erlaubt gerade keine Speicherung. Dein Fortschritt geht beim Schließen verloren.'} Mit einer Sicherung kannst du ihn auf ein anderes Gerät übertragen.</p>
        <div className="row"><button className="btn" onClick={copy}>Sicherung erstellen und kopieren</button></div>
        {backup && <textarea id="opt-backup" readOnly value={backup} onFocus={(e) => e.target.select()} aria-label="Sicherungsdaten" />}
        <div className="field">
          <label htmlFor="opt-import">Sicherung einfügen und wiederherstellen</label>
          <textarea id="opt-import" value={importText} onChange={(e) => setImportText(e.target.value)} placeholder="Hier den kopierten Sicherungstext einfügen" />
        </div>
        <div className="row"><button className="btn" disabled={!importText.trim()} onClick={() => { const ok = importState(importText); toast(ok ? 'Lernfortschritt wiederhergestellt.' : 'Das ist keine gültige Sicherung.'); if (ok) setImportText(''); }}>Wiederherstellen</button></div>
      </div>

      <div className="card stack">
        <h3>Alles zurücksetzen</h3>
        {!confirmReset ? (
          <button className="btn danger" style={{ alignSelf: 'flex-start' }} onClick={() => setConfirmReset(true)}>Lernfortschritt löschen</button>
        ) : (
          <div className="confirm">
            <p>Damit werden alle Ergebnisse, Prüfungen, Lernkarten-Stände und die Lernzeit gelöscht. Das kann nicht rückgängig gemacht werden.</p>
            <div className="row"><button className="btn danger" onClick={() => { replaceState(defaultState()); setConfirmReset(false); toast('Alles zurückgesetzt.'); }}>Ja, endgültig löschen</button><button className="btn" onClick={() => setConfirmReset(false)}>Abbrechen</button></div>
          </div>
        )}
      </div>

      <div className="card stack">
        <h3>Über diese App</h3>
        <p className="small">{TOPICS.length} Themen mit Unterricht, {FLASHCARDS.length} Lernkarten, {POOL_STATS.fixed} eigenständig formulierte Aufgaben und {POOL_STATS.generators} Rechen-Generatoren. Im Fragenpool stehen {POOL_STATS.total} Aufgaben ({POOL_STATS.variants} davon als feste Generator-Varianten). In Prüfung und Lernmodus erzeugen die Generatoren jedes Mal neue Zahlen.</p>
        <p className="small muted">Grundlage sind § 8 der IT-System-Management-Kaufleute-Ausbildungsverordnung (ITSManKflAusbV) und öffentlich zugängliche Informationen der IHKs zur AP1. Es sind keine Originalprüfungen enthalten. Die automatische Bewertung offener Fragen arbeitet mit Schlüsselbegriffen aus dem Erwartungshorizont. Prüfe sie immer mit der Musterlösung und korrigiere die Punkte bei Bedarf selbst.</p>
      </div>
    </div>
  );
}

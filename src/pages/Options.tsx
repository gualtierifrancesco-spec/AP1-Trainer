import { useState } from 'react';
import { defaultState, exportState, importState, replaceState, setState, storageAvailable, useAppState } from '../lib/store';
import { POOL_STATS } from '../data/bank';
import { FLASHCARDS, TOPICS } from '../data/topics';
import { toast } from '../components/ui';

export function Options() {
  const s = useAppState();
  const [backup, setBackup] = useState('');
  const [importText, setImportText] = useState('');
  const [confirmReset, setConfirmReset] = useState(false);

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

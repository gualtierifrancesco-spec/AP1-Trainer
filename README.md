# AP1 Prüfungstrainer – Kaufmann/Kauffrau für IT-System-Management

Lern- und Prüfungssimulator für die IHK-Abschlussprüfung Teil 1 „Einrichten eines IT-gestützten Arbeitsplatzes“ (90 Minuten, schriftlich, 20 % der Gesamtnote).

Beta-Version 0.9 · React 18 · TypeScript · Vite · ohne Backend, ohne kostenpflichtige APIs. Alle Fragen, Antworten und Lernstände liegen lokal.

## Installation und Start

Voraussetzung: [Node.js](https://nodejs.org) ab Version 18 (empfohlen 20 oder 22).

```bash
# 1. Projektordner entpacken und hineinwechseln
cd ap1-trainer

# 2. Abhängigkeiten installieren (einmalig)
npm install

# 3. Entwicklungsserver starten
npm run dev
```

Dann im Browser `http://localhost:5173` öffnen. Auf dem Handy im selben WLAN: `npm run dev -- --host` und die angezeigte Netzwerkadresse öffnen.

Weitere Befehle:

| Befehl | Zweck |
| --- | --- |
| `npm run build` | Typprüfung und Produktions-Build nach `dist/` |
| `npm run build:single` | Die ganze App als **eine einzige HTML-Datei** nach `dist-single/index.html` (offline per Doppelklick nutzbar) |
| `npm run preview` | Den Build lokal ansehen |
| `npm test` | Alle automatischen Tests (Fragenpool, Bewertung, Prüfungsgenerator, Lernstand, Ausbilder) |
| `node tests/e2e.mjs http://localhost:4173/` | Browser-Durchlauf aller Seiten und Buttons (braucht Chrome; Pfad per Umgebungsvariable `CHROME_PATH`) |

## Funktionen

- **Dashboard:** Gesamtfortschritt, bearbeitete Aufgaben, Durchschnitt, beste und letzte Prüfung, schwächste und stärkste Themen, Lernzeit (7-Tage-Verlauf), Fortschritt je Thema.
- **Unterricht (11 Themen):** Einführung, Grundlagen in einfacher Sprache, Fachbegriffe, Beispiele aus dem Arbeitsalltag, Grafiken, Schritt-für-Schritt-Erklärungen, Verständnisfragen zwischendurch, interaktive Übung, Abschlusstest auf drei Lernstufen.
- **Interaktive Übungen:** Subnetz-Rechner mit Binäransicht und Übungsaufgaben, OSI-Explorer mit Sortierspiel, PC-Komponenten zuordnen, Netzwerk zusammenstecken, Phishing-Mail untersuchen, DSGVO-Fälle beurteilen, Lizenzfälle, Bezugskalkulation Schritt für Schritt, Nutzwertanalyse, SLA-Rechner, Ergonomie-Check.
- **Lernmodus:** Themen, Stufe und Aufgabentyp wählen, ohne Zeitlimit, sofortige Lösung mit Rechenweg und Erklärung.
- **Prüfungsmodus:** konfigurierbarer Countdown (Standard 90 Min.), vier Aufgabenblöcke à ca. 25 Punkte mit Handlungssituation, Einfach- und Mehrfachauswahl, offene Fragen, Rechenaufgaben, Zuordnungen, Tabellen. Aufgaben markieren, frei springen, automatische Speicherung, Abgabe jederzeit, Auswertung erst danach.
- **Auswertung:** Punkte, Prozent, IHK-Note (100-Punkte-Schlüssel), richtig/teilweise/falsch/leer, Punkte und Begründung je Aufgabe, Musterlösungen, Erwartungshorizont, Themen, die sitzen, und Themen, die fehlen. Offene Antworten können selbst nachkorrigiert werden.
- **Wiederholung (Spaced Repetition):** Falsche Aufgaben landen automatisch im Wiederholungsbereich (Leitner-System: 0, 1, 3, 7, 14, 30 Tage).
- **Lernkarten:** aus Fachbegriffen, Formeln und IHK-Fallen, mit eigener Wiederholungslogik, plus Spickzettel-Ansicht vor der Prüfung.
- **Lernplan und Schwächenanalyse:** Beherrschung je Thema und Stufe, dynamische Reihenfolge, Gesamtbereitschaft.
- **„Frag meinen IT-Ausbilder“:** gibt Tipps statt sofortiger Lösungen, erklärt einfacher, zeigt Beispiele, führt Rechenwege schrittweise, stellt Rückfragen und prüft die Antwort.
- **Hell/Dunkel**, optimiert für PC, Tablet und Smartphone, Sicherung/Wiederherstellung des Lernstands per Text.

## Wichtig zu wissen

- **IT-Ausbilder:** In der lokalen Version arbeitet er **regelbasiert offline** (Wissensbasis aus dem Unterricht, Tipps, Rechenwege, Rückfragen). Er versteht deshalb nur Fragen zu Begriffen und Themen, die im Lernstoff vorkommen. In der in Claude veröffentlichten Version kann er zusätzlich **Claude als echten KI-Ausbilder** nutzen (über dein Claude-Konto, nach deiner Freigabe). Ein eigenes Backend mit KI-Schnittstelle lässt sich später in `src/lib/tutor.ts` ergänzen.
- **Bewertung offener Fragen:** automatisch über Schlüsselbegriffe des Erwartungshorizonts (inkl. Umlaut-Varianten und Synonyme). Das ist eine Näherung. Prüfe deine Antwort immer mit der Musterlösung und korrigiere die Punkte bei Bedarf selbst.
- **Fragenpool:** 255 eigenständig formulierte Aufgaben plus 27 Rechen-Generatoren (Subnetting, Datenmengen, Stromkosten, RAID, USt, Bezugskalkulation, TCO, Leasing, Nutzwertanalyse, SLA u. a.). Im Pool zählen je Generator 10 feste Varianten (525 Aufgaben gesamt); in Prüfung und Lernmodus erzeugen die Generatoren jedes Mal neue Zahlen.
- **Quellen:** Prüfungsanforderungen nach § 8 ITSManKflAusbV und öffentliche IHK-Informationen zur AP1. Es sind **keine Originalprüfungen** enthalten. Die Themengewichtung im Lernplan ist eine eigene Schätzung, keine offizielle IHK-Angabe.
- **Speicherung:** `localStorage` des Browsers. Fortschritt ist pro Gerät und Browser getrennt. Zum Übertragen: Einstellungen → Sicherung.

## Projektstruktur

```
src/
  data/
    topics1.ts, topics2.ts   Unterricht, Begriffe, Formeln, Merksätze, Fallen
    questions/*.ts           feste Aufgaben (nach Themen + Handlungssituationen)
    generators.ts            Rechenaufgaben-Generatoren
    bank.ts                  Fragenpool
  lib/
    grading.ts               Bewertung aller Aufgabentypen
    exam.ts                  Prüfungsgenerator und Auswertung
    progress.ts              Spaced Repetition, Beherrschung, Lernplan
    tutor.ts                 IT-Ausbilder (offline + Claude)
    store.ts                 Speicherung
    ip.ts, util.ts           Subnetz- und Zahlenfunktionen
  components/, pages/, widgets/   Oberfläche
tests/                       Unit-Tests (Vitest) und Browser-Test (Puppeteer)
```

Neue Aufgaben ergänzt du in `src/data/questions/`. Die Tests prüfen automatisch, ob jede Musterlösung volle Punkte bekommt.

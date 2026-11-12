import type { Topic } from './topicTypes';

export const topicsC: Topic[] = [
  {
    id: 'wiso',
    title: 'Wirtschafts- und Sozialkunde (AP2)',
    short: 'WiSo',
    area: 'Wirtschafts- und Sozialkunde',
    examWeight: 0,
    intro:
      'Wirtschafts- und Sozialkunde, kurz WiSo, gehört nicht zur AP1. Es ist der dritte Prüfungsbereich in Teil 2 der Abschlussprüfung. Die Prüfung dauert 60 Minuten und besteht aus etwa 30 Aufgaben zum Ankreuzen, Zuordnen und Rechnen. Sie zählt 10 Prozent der Gesamtnote. Es geht um deine Rechte in der Ausbildung, um Arbeitsrecht, Sozialversicherung, Unternehmen und Umweltschutz.',
    sections: [
      {
        title: 'Berufsausbildung: Vertrag, Probezeit, Kündigung',
        keys: ['ausbildung', 'ausbildungsvertrag', 'probezeit', 'bbig', 'berufsbildungsgesetz', 'duales system', 'abschlussprüfung', 'jugendarbeitsschutz', 'jarbschg', 'berufsschule', 'vergütung'],
        text:
          'Die Ausbildung findet im dualen System statt. Das bedeutet: Der Betrieb vermittelt die Praxis, die Berufsschule die Theorie. Die Regeln stehen im Berufsbildungsgesetz, kurz BBiG.\n\nDer Ausbildungsvertrag muss schriftlich niedergelegt werden. Er nennt unter anderem das Ziel der Ausbildung, Beginn und Dauer, die Probezeit, die Vergütung, den Urlaub und die tägliche Ausbildungszeit.\n\nDie Probezeit dauert mindestens einen Monat und höchstens vier Monate. In dieser Zeit können beide Seiten jederzeit ohne Frist und ohne Grund kündigen. Nach der Probezeit ist das anders. Der Betrieb kann nur noch fristlos aus einem wichtigen Grund kündigen. Der Auszubildende kann zusätzlich mit vier Wochen Frist kündigen, wenn er die Ausbildung aufgibt oder einen anderen Beruf lernen will. Jede Kündigung muss schriftlich sein.\n\nDie Ausbildung endet mit dem Bestehen der Abschlussprüfung, genauer mit der Bekanntgabe des Ergebnisses. Wer nicht besteht, kann verlangen, dass die Ausbildung bis zur nächsten Wiederholungsprüfung weiterläuft, höchstens ein Jahr.\n\nFür Jugendliche unter 18 Jahren gilt das Jugendarbeitsschutzgesetz. Sie dürfen höchstens 8 Stunden am Tag und 40 Stunden in der Woche arbeiten.',
        simple:
          'Die Probezeit ist die Kennenlernzeit. Da darf jeder sofort gehen. Danach ist der Azubi stark geschützt: Der Betrieb kann ihn nur noch bei einem schweren Verstoß kündigen.',
        example:
          'Eine Auszubildende merkt im zweiten Jahr, dass sie lieber studieren möchte. Sie kündigt schriftlich mit vier Wochen Frist und nennt als Grund, dass sie die Ausbildung aufgibt.',
        check: {
          q: 'Wie lange darf die Probezeit in einer Ausbildung höchstens dauern?',
          options: ['Einen Monat', 'Drei Monate', 'Vier Monate', 'Sechs Monate'],
          correct: 2,
          explain: 'Mindestens ein Monat, höchstens vier Monate. Sechs Monate gibt es nur im normalen Arbeitsverhältnis.',
        },
      },
      {
        title: 'Arbeitsrecht und Mitbestimmung',
        keys: ['arbeitsvertrag', 'kündigung', 'kündigungsschutz', 'kündigungsfrist', 'befristung', 'betriebsrat', 'jav', 'betriebsvereinbarung', 'tarifvertrag', 'gewerkschaft', 'streik', 'friedenspflicht', 'tarifautonomie', 'mitbestimmung', 'arbeitsgericht', 'agg', 'mutterschutz', 'urlaub'],
        text:
          'Im Arbeitsrecht gibt es eine Rangfolge. Oben stehen die Gesetze. Darunter kommen Tarifverträge, dann Betriebsvereinbarungen, dann der einzelne Arbeitsvertrag. Eine niedrigere Regel darf von einer höheren nur abweichen, wenn das für den Arbeitnehmer besser ist. Das nennt man Günstigkeitsprinzip.\n\nTarifverträge werden zwischen Gewerkschaften und Arbeitgeberverbänden oder einzelnen Arbeitgebern ausgehandelt. Der Staat mischt sich nicht ein. Das heißt Tarifautonomie. Der Manteltarifvertrag regelt Arbeitszeit, Urlaub und Kündigungsfristen. Der Entgelttarifvertrag regelt die Bezahlung. Solange ein Tarifvertrag läuft, darf nicht gestreikt werden. Das ist die Friedenspflicht.\n\nDer Betriebsrat vertritt die Arbeitnehmer im Betrieb. Er kann gewählt werden, wenn es mindestens fünf wahlberechtigte Arbeitnehmer gibt, und wird alle vier Jahre gewählt. Bei sozialen Fragen wie Arbeitszeit, Pausen, Urlaubsplan und technischer Überwachung bestimmt er mit. Betriebsrat und Arbeitgeber schließen dazu Betriebsvereinbarungen. Die Jugend- und Auszubildendenvertretung, kurz JAV, wird alle zwei Jahre gewählt.\n\nEine ordentliche Kündigung braucht eine Frist. Die Grundfrist beträgt vier Wochen zum 15. oder zum Monatsende. Das Kündigungsschutzgesetz gilt nach sechs Monaten im Betrieb und in Betrieben mit mehr als zehn Arbeitnehmern. Besonders geschützt sind zum Beispiel Schwangere, Schwerbehinderte, Betriebsratsmitglieder und Auszubildende nach der Probezeit.\n\nEin befristeter Vertrag endet von selbst. Ohne sachlichen Grund darf er höchstens zwei Jahre dauern. Streit aus dem Arbeitsverhältnis entscheidet das Arbeitsgericht.',
        simple:
          'Stell dir eine Treppe vor: Gesetz, Tarifvertrag, Betriebsvereinbarung, Arbeitsvertrag. Nach unten darf es für dich nur besser werden, nie schlechter.',
        example:
          'Das Gesetz gibt 24 Werktage Urlaub. Der Tarifvertrag gibt 30 Tage. Im Arbeitsvertrag stehen 28 Tage. Für ein Gewerkschaftsmitglied in einem tarifgebundenen Betrieb gelten 30 Tage.',
        check: {
          q: 'Wer handelt einen Tarifvertrag aus?',
          options: ['Betriebsrat und Geschäftsführung', 'Gewerkschaft und Arbeitgeberverband oder einzelner Arbeitgeber', 'IHK und Berufsschule', 'Bundesregierung und Gewerkschaft'],
          correct: 1,
          explain: 'Tarifparteien sind Gewerkschaften und Arbeitgeberverbände oder einzelne Arbeitgeber. Der Betriebsrat schließt Betriebsvereinbarungen.',
        },
      },
      {
        title: 'Sozialversicherung und Entgeltabrechnung',
        keys: ['sozialversicherung', 'krankenversicherung', 'rentenversicherung', 'arbeitslosenversicherung', 'pflegeversicherung', 'unfallversicherung', 'berufsgenossenschaft', 'beitragsbemessungsgrenze', 'versicherungspflichtgrenze', 'generationenvertrag', 'umlageverfahren', 'brutto netto lohn', 'lohnsteuer', 'entgeltabrechnung', 'sozialgericht', 'krankengeld'],
        text:
          'Die Sozialversicherung hat fünf Zweige: Krankenversicherung, Pflegeversicherung, Rentenversicherung, Arbeitslosenversicherung und Unfallversicherung. Die Beiträge teilen sich Arbeitnehmer und Arbeitgeber im Grundsatz. Eine Ausnahme ist die Unfallversicherung. Sie zahlt der Arbeitgeber allein. Ihr Träger ist die Berufsgenossenschaft. Sie zahlt bei Arbeitsunfällen, bei Unfällen auf dem direkten Weg zur Arbeit und bei Berufskrankheiten.\n\nDie Rentenversicherung arbeitet nach dem Umlageverfahren. Die Beiträge der heute Arbeitenden werden sofort an die heutigen Rentner ausgezahlt. Man nennt das auch Generationenvertrag.\n\nZwei Grenzen werden oft verwechselt. Die Beitragsbemessungsgrenze legt fest, bis zu welchem Einkommen Beiträge berechnet werden. Was darüber liegt, bleibt beitragsfrei. Die Versicherungspflichtgrenze gibt es nur in der Krankenversicherung. Wer mehr verdient, darf sich privat versichern.\n\nBei der Entgeltabrechnung ziehst du vom Bruttoentgelt zuerst die Steuern ab, also Lohnsteuer und eventuell Kirchensteuer und Solidaritätszuschlag. Dann ziehst du die Arbeitnehmeranteile zur Sozialversicherung ab. Übrig bleibt das Nettoentgelt.\n\nBei Krankheit zahlt der Arbeitgeber das Entgelt sechs Wochen weiter. Danach zahlt die Krankenkasse Krankengeld. Streit mit einer Sozialversicherung entscheidet das Sozialgericht.',
        simple:
          'Die Sozialversicherung ist eine große Gemeinschaftskasse. Alle zahlen ein, und wer krank, alt, arbeitslos oder pflegebedürftig wird oder einen Arbeitsunfall hat, bekommt Hilfe.',
        example:
          'Brutto 3.000 €. Lohnsteuer 380 €. Sozialversicherung des Arbeitnehmers zusammen 21 Prozent, also 630 €. Netto bleiben 3.000 − 380 − 630 = 1.990 €.',
        check: {
          q: 'Welchen Zweig der Sozialversicherung bezahlt der Arbeitgeber allein?',
          options: ['Krankenversicherung', 'Rentenversicherung', 'Unfallversicherung', 'Pflegeversicherung'],
          correct: 2,
          explain: 'Die gesetzliche Unfallversicherung wird nur vom Arbeitgeber finanziert.',
        },
      },
      {
        title: 'Unternehmen, Rechtsformen und Wirtschaft',
        keys: ['rechtsform', 'gmbh', 'ug', 'ag', 'ohg', 'kg', 'einzelunternehmen', 'handelsregister', 'prokura', 'vollmacht', 'stammkapital', 'haftung', 'wirtschaftssektor', 'kartell', 'wettbewerb', 'leitungssystem', 'einliniensystem', 'stabliniensystem', 'matrix', 'wirtschaftlichkeit', 'produktivität', 'rentabilität', 'businessplan', 'gewinnverteilung'],
        text:
          'Unternehmen werden drei Sektoren zugeordnet. Der primäre Sektor gewinnt Rohstoffe, zum Beispiel die Landwirtschaft. Der sekundäre Sektor verarbeitet sie, zum Beispiel die Industrie. Der tertiäre Sektor erbringt Dienstleistungen. Dazu gehören IT-Unternehmen.\n\nBei den Rechtsformen ist die Haftung der wichtigste Unterschied. Einzelunternehmer und Gesellschafter einer OHG haften auch mit ihrem Privatvermögen. Bei Kapitalgesellschaften wie GmbH und AG haftet nur das Vermögen der Gesellschaft. Die GmbH braucht mindestens 25.000 € Stammkapital, die AG 50.000 € Grundkapital. Die UG, eine kleine Form der GmbH, kann schon mit einem Euro gegründet werden. Der Gewinn einer GmbH wird nach den Geschäftsanteilen verteilt.\n\nDas Handelsregister wird beim Amtsgericht geführt und ist öffentlich. In Abteilung A stehen Einzelkaufleute und Personengesellschaften, in Abteilung B die Kapitalgesellschaften. Die Prokura ist eine sehr weitgehende Vollmacht. Sie wird im Handelsregister eingetragen. Grundstücke verkaufen darf ein Prokurist ohne besondere Befugnis nicht.\n\nDrei Kennzahlen solltest du kennen. Wirtschaftlichkeit ist Ertrag geteilt durch Aufwand. Produktivität ist Ausbringungsmenge geteilt durch Einsatzmenge. Rentabilität ist Gewinn geteilt durch eingesetztes Kapital, mal 100.\n\nIm Einliniensystem hat jede Stelle genau eine vorgesetzte Stelle. Im Stabliniensystem kommen beratende Stabsstellen ohne Weisungsbefugnis dazu. Im Mehrliniensystem hat eine Stelle mehrere Vorgesetzte.\n\nAbsprachen zwischen Unternehmen, die den Wettbewerb einschränken, heißen Kartelle. Sie sind grundsätzlich verboten. Das Bundeskartellamt überwacht das.',
        simple:
          'Bei der GmbH steht die Firma für ihre Schulden gerade, nicht die Besitzer privat. Darum heißt sie Gesellschaft mit beschränkter Haftung.',
        example:
          'Zwei Gesellschafter halten 60 und 40 Prozent an einer GmbH. Von 50.000 € Gewinn bekommt der erste 30.000 € und der zweite 20.000 €.',
        check: {
          q: 'In welcher Abteilung des Handelsregisters steht eine GmbH?',
          options: ['Abteilung A', 'Abteilung B', 'Abteilung C', 'Sie wird nicht eingetragen'],
          correct: 1,
          explain: 'Kapitalgesellschaften stehen in Abteilung B. Die GmbH entsteht erst durch die Eintragung.',
        },
      },
      {
        title: 'Arbeitsschutz, Brandschutz und Umwelt',
        keys: ['arbeitsschutz', 'arbeitssicherheit', 'sicherheitszeichen', 'brandschutz', 'brandfall', 'feuer', 'fluchtweg', 'erste hilfe', 'nachhaltigkeit', 'umweltschutz', 'verursacherprinzip', 'gemeinlastprinzip', 'vorsorgeprinzip', 'abfall', 'recycling', 'kreislaufwirtschaft'],
        text:
          'Für den Arbeitsschutz ist der Arbeitgeber verantwortlich. Er beurteilt die Gefahren, trifft Schutzmaßnahmen und unterweist die Beschäftigten. Die Berufsgenossenschaft und die staatliche Gewerbeaufsicht kontrollieren das.\n\nSicherheitszeichen erkennst du an Form und Farbe. Verbotszeichen sind rund mit rotem Rand und rotem Querbalken. Warnzeichen sind gelbe Dreiecke. Gebotszeichen sind blaue Kreise. Rettungszeichen sind grün, zum Beispiel für Fluchtwege und Erste Hilfe. Brandschutzzeichen sind rote Quadrate, zum Beispiel für Feuerlöscher.\n\nIm Brandfall gilt eine feste Reihenfolge. Zuerst Ruhe bewahren. Dann den Brand melden. Dann sich und andere in Sicherheit bringen. Erst zuletzt einen Löschversuch unternehmen, und nur ohne eigene Gefahr. Aufzüge benutzt man im Brandfall nicht.\n\nNachhaltigkeit hat drei Seiten: die ökologische, die soziale und die ökonomische. In der Umweltpolitik gibt es drei wichtige Prinzipien. Beim Verursacherprinzip zahlt, wer den Schaden angerichtet hat. Beim Gemeinlastprinzip zahlt die Allgemeinheit. Beim Vorsorgeprinzip werden Schäden von Anfang an vermieden.\n\nFür Abfall gilt eine Rangfolge. Am besten ist Vermeiden. Danach kommen Wiederverwenden, Recycling, sonstige Verwertung und ganz zuletzt Beseitigen.',
        simple: 'Erst melden, dann retten, dann löschen. Und bei Abfall gilt: Am besten ist der Müll, der gar nicht erst entsteht.',
        example:
          'Ein Systemhaus bereitet gebrauchte Notebooks auf und verkauft sie weiter. Das ist Wiederverwendung und steht in der Abfallhierarchie über dem Recycling.',
        check: {
          q: 'Welche Farbe haben Rettungszeichen, zum Beispiel für Fluchtwege?',
          options: ['Rot', 'Blau', 'Gelb', 'Grün'],
          correct: 3,
          explain: 'Rettungszeichen sind grün mit weißem Symbol. Rot steht für Verbot oder Brandschutz.',
        },
      },
    ],
    steps: {
      title: 'Vom Brutto zum Netto',
      steps: [
        'Bruttoentgelt aufschreiben.',
        'Steuern abziehen: Lohnsteuer, eventuell Kirchensteuer und Solidaritätszuschlag.',
        'Arbeitnehmeranteile zur Sozialversicherung berechnen: Brutto × Summe der Prozentsätze.',
        'Brutto − Steuern − Sozialversicherung = Nettoentgelt.',
      ],
    },
    widget: 'wiso-cases',
    widgetTitle: 'Welche Versicherung zahlt?',
    terms: [
      { term: 'BBiG', def: 'Berufsbildungsgesetz. Regelt Ausbildungsvertrag, Probezeit, Kündigung und Prüfung.' },
      { term: 'Duales System', def: 'Ausbildung an zwei Lernorten: Betrieb und Berufsschule.' },
      { term: 'JAV', def: 'Jugend- und Auszubildendenvertretung. Wird alle zwei Jahre gewählt.' },
      { term: 'Betriebsrat', def: 'Vertretung der Arbeitnehmer im Betrieb. Wahl alle vier Jahre, möglich ab fünf Arbeitnehmern.' },
      { term: 'Betriebsvereinbarung', def: 'Vertrag zwischen Betriebsrat und Arbeitgeber, zum Beispiel über Gleitzeit.' },
      { term: 'Tarifautonomie', def: 'Gewerkschaften und Arbeitgeber verhandeln Tarifverträge ohne Einmischung des Staates.' },
      { term: 'Friedenspflicht', def: 'Während der Laufzeit eines Tarifvertrags sind Arbeitskämpfe verboten.' },
      { term: 'Günstigkeitsprinzip', def: 'Es gilt die Regelung, die für den Arbeitnehmer besser ist.' },
      { term: 'Beitragsbemessungsgrenze', def: 'Einkommen darüber bleibt beitragsfrei.' },
      { term: 'Versicherungspflichtgrenze', def: 'Wer in der Krankenversicherung darüber verdient, darf sich privat versichern.' },
      { term: 'Umlageverfahren', def: 'Die Beiträge der Arbeitenden werden sofort an die Rentner ausgezahlt (Generationenvertrag).' },
      { term: 'Berufsgenossenschaft', def: 'Träger der gesetzlichen Unfallversicherung.' },
      { term: 'Prokura', def: 'Weitgehende Handelsvollmacht, wird im Handelsregister eingetragen.' },
      { term: 'Stabsstelle', def: 'Beratende Stelle ohne Weisungsbefugnis.' },
      { term: 'Verursacherprinzip', def: 'Wer einen Umweltschaden verursacht, trägt die Kosten.' },
    ],
    formulas: [
      'Netto = Brutto − Steuern − Sozialversicherung (Arbeitnehmeranteil)',
      'Wirtschaftlichkeit = Ertrag ÷ Aufwand',
      'Produktivität = Ausbringungsmenge ÷ Einsatzmenge',
      'Rentabilität = Gewinn ÷ Kapital × 100',
      'Gewinnanteil GmbH = Gewinn × Geschäftsanteil ÷ Stammkapital',
      'Probezeit Ausbildung: 1 bis 4 Monate · Mutterschutz: 6 Wochen vor, 8 Wochen nach der Geburt',
      'Betriebsrat: Wahl alle 4 Jahre · JAV: Wahl alle 2 Jahre',
    ],
    merksaetze: [
      'Gesetz, Tarifvertrag, Betriebsvereinbarung, Arbeitsvertrag: Nach unten darf es nur besser werden.',
      'Arbeitsgericht für den Job, Sozialgericht für die Versicherung.',
      'Unfallversicherung zahlt der Arbeitgeber allein.',
      'Brandfall: Ruhe bewahren, melden, retten, löschen.',
    ],
    traps: [
      'Probezeit in der Ausbildung (höchstens 4 Monate) mit der im Arbeitsverhältnis (höchstens 6 Monate) verwechseln.',
      'Beitragsbemessungsgrenze und Versicherungspflichtgrenze verwechseln.',
      'Betriebsvereinbarung und Tarifvertrag verwechseln.',
      'Bei zwei richtigen Antworten nur eine ankreuzen. Lies genau, wie viele Antworten verlangt sind.',
      'Das Projekt mit dem höchsten Gewinn für das wirtschaftlichste halten.',
    ],
    summary:
      'WiSo fragt Regeln ab, die dich selbst betreffen. In der Ausbildung gilt das BBiG mit einer Probezeit von einem bis vier Monaten. Im Arbeitsrecht stehen Gesetz, Tarifvertrag, Betriebsvereinbarung und Arbeitsvertrag in einer Rangfolge, und der Betriebsrat bestimmt bei sozialen Fragen mit. Die Sozialversicherung hat fünf Zweige, die Unfallversicherung zahlt der Arbeitgeber allein. Bei der GmbH haftet nur das Gesellschaftsvermögen. Im Arbeits- und Umweltschutz zählen feste Reihenfolgen: im Brandfall erst melden, dann retten, dann löschen, und bei Abfall erst vermeiden, dann verwerten, dann beseitigen.',
  },
];

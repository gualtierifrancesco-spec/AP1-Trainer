import type { TopicId } from '../types';
import type { LessonSection } from './topicTypes';

/**
 * Ausrichtung des Unterrichts an der AP1 (§ 8 der Ausbildungsverordnung,
 * „Einrichten eines IT-gestützten Arbeitsplatzes“). Alle Texte und Aufgaben
 * sind eigens für die App geschrieben.
 */

export interface Ap1Focus {
  /** Wie das Thema in der AP1 typischerweise geprüft wird */
  focus: string;
  /** Beispielaufgabe im Prüfungsstil */
  task: string;
  /** Musterantwort in ganzen Sätzen */
  answer: string;
  /** Hinweis, wie es volle Punkte gibt */
  tip: string;
}

export const AP1_OVERVIEW = {
  title: 'So ist die AP1 aufgebaut',
  text:
    'Die AP1 heißt „Einrichten eines IT-gestützten Arbeitsplatzes“. Sie ist schriftlich, dauert 90 Minuten und zählt 20 Prozent der Gesamtnote.\n\nLaut Ausbildungsverordnung musst du fünf Dinge zeigen. Du ermittelst Kundenbedarfe zielgruppengerecht. Du wählst Hard- und Software aus und leitest die Beschaffung ein. Du richtest einen Arbeitsplatz ein und testest ihn, und dabei beachtest du Datenschutz, IT-Sicherheit und Qualitätssicherung. Du weist Kunden in die Nutzung ein. Und du kontrollierst und protokollierst deine Leistung.\n\nAlle Aufgaben hängen an einer durchgehenden Firmensituation. Die meisten sind offene Fragen. Dazu kommen Abbildungen, Konsolenausgaben, Tabellen, ein englischer Text und kleine Rechnungen. Die Themen hier im Unterricht sind nach diesen Inhalten geordnet. In jedem Thema zeigt dir der Kasten „So kommt das in der AP1 dran“, wie danach gefragt wird.',
};

export const AP1_OPERATORS = {
  title: 'So beantwortest du offene Fragen',
  text:
    'Das erste Wort der Aufgabe sagt dir, was erwartet wird. Nennen heißt aufzählen. Ein kurzer Begriff pro Punkt reicht, eine Erklärung ist nicht nötig. Beschreiben heißt, einen Ablauf oder Zustand in eigenen Worten wiederzugeben. Erklären oder Erläutern heißt, das Warum zu zeigen, also Ursache und Wirkung. Begründen heißt, eine Entscheidung mit Argumenten zu stützen. Vergleichen heißt, beide Seiten nach denselben Kriterien gegenüberzustellen. Beurteilen heißt, abzuwägen und zu einem eigenen Ergebnis zu kommen.\n\nDie Punktzahl zeigt, wie viel erwartet wird. Als Faustregel gibt ein richtiger und passend erklärter Gedanke ein bis zwei Punkte. Stehen da 4 Punkte und es heißt „Nennen Sie zwei“, will die IHK meist zwei Gedanken mit kurzer Erklärung.\n\nBezieh dich immer auf die Situation aus der Aufgabe. Ein allgemeiner Lehrbuchsatz ohne Bezug zum Kunden bringt oft nur Teilpunkte. Schreib in ganzen, kurzen Sätzen und nutze die Fachbegriffe.',
};

export const AP1_FOCUS: Record<TopicId, Ap1Focus> = {
  hardware: {
    focus:
      'Hardware ist in der AP1 ein großer Block. Meist richtest du in einer Firmensituation einen PC oder ein Notebook ein. Du sollst Bauteile auswählen und begründen, Anschlüsse auf Bildern erkennen, Werte aus Datenblättern erklären und Einbauschritte aus einer englischen Anleitung wiedergeben. Oft kommt eine kleine Rechnung dazu, zum Beispiel eine Übertragungszeit oder eine Umrechnung von Einheiten.',
    task: 'Ein Grafiker bekommt einen neuen PC. Zur Wahl stehen eine SATA-SSD und eine NVMe-SSD. Empfehlen Sie eine und begründen Sie Ihre Wahl. (3 Punkte)',
    answer:
      'Ich empfehle die NVMe-SSD. Sie ist über PCIe angebunden und um ein Vielfaches schneller als eine SATA-SSD. Ein Grafiker öffnet und speichert ständig große Dateien, deshalb spart er damit spürbar Zeit. Voraussetzung ist ein freier M.2-Steckplatz mit NVMe-Unterstützung auf dem Mainboard.',
    tip: 'Eine Empfehlung bringt nur volle Punkte, wenn du sie mit dem Bedarf des Nutzers begründest. Ein technischer Wert allein reicht nicht.',
  },
  ergonomie: {
    focus:
      'Ergonomie kommt meist als Teil einer Arbeitsplatz-Situation. Du sollst Mängel an einem beschriebenen Arbeitsplatz erkennen, Maßnahmen nennen und sie mit der Arbeitsstättenverordnung begründen. Auch Energieverbrauch, Umweltsiegel und Barrierefreiheit werden gefragt.',
    task: 'Eine Mitarbeiterin klagt über Nackenschmerzen und Blendung. Ihr Monitor steht direkt vor einem Fenster, und die Oberkante liegt über ihrer Augenhöhe. Nennen Sie zwei Mängel und je eine Maßnahme. (4 Punkte)',
    answer:
      'Erstens steht der Monitor vor dem Fenster. Das helle Fenster im Hintergrund blendet und strengt die Augen an. Der Monitor wird so gedreht, dass die Blickrichtung parallel zum Fenster verläuft. Zweitens liegt die Oberkante über Augenhöhe, deshalb legt die Mitarbeiterin den Kopf in den Nacken. Der Monitor wird so tief gestellt, dass die oberste Zeile auf oder leicht unter Augenhöhe liegt.',
    tip: 'Nenne immer Mangel und Maßnahme als Paar. Eine Maßnahme ohne Bezug zum Mangel bringt meist nur halbe Punkte.',
  },
  netzwerk: {
    focus:
      'Netzwerkfragen sind in der AP1 fast immer praktisch. Ein Gerät kommt nicht ins Netz, und du sollst die Ursache finden. Dazu bekommst du Konsolenausgaben, zum Beispiel von ipconfig oder ping. Außerdem sollst du WLAN-Verfahren vergleichen und Geräte wie Switch, Router und Access Point ihrer Aufgabe zuordnen.',
    task: 'Ein Notebook zeigt die IPv4-Adresse 169.254.77.12 und kein Standardgateway. Erklären Sie die Ursache und nennen Sie zwei Prüfschritte. (4 Punkte)',
    answer:
      'Das Notebook hat keinen DHCP-Server erreicht und sich deshalb per APIPA selbst eine Adresse gegeben. Zuerst prüfe ich die physische Verbindung, also ob das Kabel steckt oder das WLAN verbunden ist. Danach prüfe ich, ob der DHCP-Server läuft, und fordere mit ipconfig /renew eine neue Adresse an.',
    tip: 'Bei einer Fehlersuche erwartet die IHK ein geordnetes Vorgehen. Beginne unten bei Kabel und Funk und arbeite dich nach oben.',
  },
  osi: {
    focus:
      'Das OSI-Modell wird selten als reine Liste abgefragt. Meist sollst du Geräte, Protokolle oder Fehler einer Schicht zuordnen oder eine Fehlersuche nach Schichten planen. Dazu gehören die Adressarten: die MAC-Adresse auf Schicht 2, die IP-Adresse auf Schicht 3 und der Port auf Schicht 4.',
    task: 'Ein Nutzer erreicht keine Webseite. Ordnen Sie die folgenden Prüfungen der passenden OSI-Schicht zu: Das Kabel steckt. Die IP-Adresse ist korrekt. Port 443 ist in der Firewall freigegeben. (3 Punkte)',
    answer:
      'Das Kabel gehört zu Schicht 1, der Bitübertragungsschicht. Die IP-Adresse gehört zu Schicht 3, der Vermittlungsschicht. Der Port 443 gehört zu Schicht 4, der Transportschicht.',
    tip: 'Lerne zu jeder Schicht ein Gerät, ein Protokoll und eine Adressart. Damit löst du fast jede Zuordnungsaufgabe.',
  },
  subnetting: {
    focus:
      'Subnetting kommt in der AP1 fast immer vor, meist als Rechenaufgabe mit wenigen Punkten. Du bestimmst Netzadresse, Broadcast, ersten und letzten Host oder die Anzahl der Hosts. Oder du teilst ein Netz in gleich große Subnetze und prüfst, ob zwei Geräte im selben Netz liegen.',
    task: 'Ein Drucker hat die Adresse 192.168.20.77/26. Bestimmen Sie Netzadresse, Broadcast-Adresse und die Anzahl der nutzbaren Hosts. (3 Punkte)',
    answer:
      'Bei /26 ist die Blockgröße 64. Die 77 liegt im Block von 64 bis 127. Die Netzadresse ist 192.168.20.64, die Broadcast-Adresse ist 192.168.20.127. Es gibt 2 hoch 6 minus 2, also 62 nutzbare Hosts.',
    tip: 'Schreib den Rechenweg auf. Bei einem kleinen Fehler gibt es mit sichtbarem Weg oft noch Teilpunkte.',
  },
  software: {
    focus:
      'Bei Software geht es um Betriebssystem, Lizenzen und Updates für den neuen Arbeitsplatz. Du sollst ein Lizenzmodell empfehlen, Voraussetzungen wie TPM 2.0 prüfen oder Schritte einer Installation ordnen. Dazu kommt oft eine kleine Aufgabe zur Programmlogik, etwa ein Struktogramm ordnen oder ergänzen.',
    task: 'Ein Kunde will 15 Arbeitsplätze mit einer Bürosoftware ausstatten. Vergleichen Sie Kauflizenz und Abonnement anhand von zwei Kriterien. (4 Punkte)',
    answer:
      'Bei den Kosten zahlt man für die Kauflizenz einmal einen höheren Betrag. Beim Abo zahlt man laufend, und über viele Jahre kann es teurer werden. Bei der Aktualität ist das Abo im Vorteil, denn neue Versionen sind enthalten. Eine Kauflizenz bleibt auf ihrer Version und bekommt nur Sicherheitsupdates, bis der Support endet.',
    tip: 'Bei „Vergleichen“ nennst du zu jedem Kriterium beide Seiten. Nur eine Seite bringt nur die halben Punkte.',
  },
  sicherheit: {
    focus:
      'IT-Sicherheit taucht in fast jeder Situation auf. Typisch sind Maßnahmen für einen neuen Arbeitsplatz, die Zuordnung zu den Schutzzielen Vertraulichkeit, Integrität und Verfügbarkeit, ein Backup-Konzept oder das Erkennen einer Phishing-Mail.',
    task: 'Ein Notebook für den Außendienst wird eingerichtet. Nennen Sie zwei technische Maßnahmen, die die Folgen eines Diebstahls begrenzen, und ordnen Sie jeder ein Schutzziel zu. (4 Punkte)',
    answer:
      'Die Festplatte wird mit BitLocker verschlüsselt. Ein Dieb kann die Daten dann nicht lesen, das schützt die Vertraulichkeit. Außerdem werden die Daten regelmäßig auf einen Server gesichert. So sind sie nach dem Diebstahl weiter vorhanden, das schützt die Verfügbarkeit.',
    tip: 'Maßnahme, Wirkung, Schutzziel: Wenn du alle drei nennst, bekommst du volle Punkte.',
  },
  datenschutz: {
    focus:
      'Datenschutz wird in der AP1 an Fällen geprüft. Du sollst erkennen, ob Daten personenbezogen sind, auf welcher Rechtsgrundlage eine Verarbeitung erlaubt ist und welche technischen und organisatorischen Maßnahmen nötig sind. Auch Auftragsverarbeitung, Löschung und Meldepflichten kommen vor.',
    task: 'Ein Kunde lässt seine Kundendaten bei einem Cloud-Anbieter speichern. Erklären Sie, welchen Vertrag er dafür braucht und warum. (2 Punkte)',
    answer:
      'Er braucht einen Vertrag zur Auftragsverarbeitung nach Art. 28 DSGVO. Der Cloud-Anbieter verarbeitet personenbezogene Daten im Auftrag des Kunden. Der Kunde bleibt verantwortlich und muss deshalb vertraglich sicherstellen, dass der Anbieter die Daten nur nach Weisung und mit ausreichendem Schutz verarbeitet.',
    tip: 'Nenne den Artikel, wenn du ihn weißt. Erkläre aber immer auch den Sinn, denn der Artikel allein bringt keine volle Punktzahl.',
  },
  rechnen: {
    focus:
      'Kaufmännisches Rechnen kommt als Teil einer Beschaffung. Du rechnest Netto, Umsatzsteuer und Brutto, Rabatt und Skonto oder einen Bezugspreis. Die Zahlen stehen meist in einem Angebot oder einer Tabelle.',
    task: 'Ein Monitor kostet laut Angebot 320,00 € netto. Der Lieferant gewährt 10 % Rabatt und 2 % Skonto. Berechnen Sie den Bareinkaufspreis. (3 Punkte)',
    answer:
      'Der Rabatt beträgt 320,00 € mal 10 %, also 32,00 €. Der Zieleinkaufspreis ist 320,00 € minus 32,00 €, also 288,00 €. Das Skonto beträgt 288,00 € mal 2 %, also 5,76 €. Der Bareinkaufspreis ist 288,00 € minus 5,76 €, also 282,24 €.',
    tip: 'Skonto rechnest du immer vom Betrag nach Abzug des Rabatts, nie vom Listenpreis.',
  },
  wirtschaftlichkeit: {
    focus:
      'Hier triffst du begründete Kaufentscheidungen. Typisch sind ein Angebotsvergleich mit Nutzwertanalyse, ein Vergleich von Kauf und Leasing, Stromkosten oder die Frage, ab welcher Menge sich eine Lösung lohnt.',
    task: 'Drucker A kostet 200 € und 0,04 € pro Seite. Drucker B kostet 500 € und 0,01 € pro Seite. Ab wie vielen Seiten ist Drucker B günstiger? (3 Punkte)',
    answer:
      'Ich setze beide Kosten gleich: 200 + 0,04 mal x = 500 + 0,01 mal x. Daraus folgt 0,03 mal x = 300, also x = 10.000 Seiten. Bei 10.000 Seiten kosten beide gleich viel. Ab der 10.001. Seite ist Drucker B günstiger.',
    tip: 'Schreib zur Rechnung immer einen Antwortsatz. Die IHK will die Entscheidung, nicht nur die Zahl.',
  },
  projekt: {
    focus:
      'Dieser Bereich trägt die ganze AP1. Laut Ausbildungsverordnung sollst du Kundenbedarfe zielgruppengerecht ermitteln, Hard- und Software auswählen und beschaffen, den Arbeitsplatz testen, Kunden einweisen und die Leistung protokollieren. Die Prüfung beginnt darum oft mit einem Kundengespräch oder einem Angebot.',
    task: 'Sie sollen den Bedarf für neue Arbeitsplätze ermitteln. Formulieren Sie zwei offene Fragen an den Kunden und erklären Sie, welche Information Sie damit gewinnen. (4 Punkte)',
    answer:
      '„Welche Programme nutzen Ihre Mitarbeiter täglich?“ Daraus ergibt sich, wie leistungsfähig Prozessor, Arbeitsspeicher und Grafik sein müssen. „Wo und wie arbeiten Ihre Mitarbeiter?“ Daraus ergibt sich, ob Notebooks für mobiles Arbeiten oder feste PCs gebraucht werden.',
    tip: 'Eine offene Frage beginnt mit einem W-Wort. Eine Frage, die man mit Ja oder Nein beantworten kann, zählt hier nicht.',
  },
};

/** Neue Abschnitte. `after` ist der Titel des Abschnitts, hinter dem eingefügt wird; null heißt ganz vorne. */
export const AP1_SECTIONS: Partial<Record<TopicId, { after: string | null; section: LessonSection }[]>> = {
  hardware: [
    {
      after: 'CPU, RAM und ROM',
      section: {
        title: 'Prozessor-Werte lesen: Kerne, Threads, Cache und Takt',
        keys: ['kerne', 'threads', 'logische prozessoren', 'hyper-threading', 'smt', 'cache', 'l1', 'l2', 'l3', 'takt', 'ghz', 'mhz', 'hertz', 'systeminformation', 'datenblatt'],
        code: 'Prozessor      8-Core 4,2 GHz\nKerne          8\nLogische Proz. 16\nL1-Cache       640 KB\nL2-Cache       8,0 MB\nL3-Cache       32,0 MB',
        text:
          'In der Prüfung bekommst du oft einen Ausschnitt aus einer Systeminformation oder einem Datenblatt. Du sollst die Werte erklären.\n\nDie Kerne sind echte Recheneinheiten. Die logischen Prozessoren, auch Threads genannt, sind oft doppelt so viele. Das liegt am Simultaneous Multithreading, bei Intel Hyper-Threading genannt. Ein Kern bearbeitet zwei Threads gleichzeitig, indem er Rechenwerke nutzt, die sonst gerade frei wären. Das bringt je nach Programm etwa 20 bis 30 Prozent mehr Leistung. Echte zusätzliche Kerne sind es aber nicht.\n\nDer Cache ist ein sehr schneller Zwischenspeicher direkt im Prozessor. Er hält häufig gebrauchte Daten und Befehle bereit. So muss die CPU nicht auf den langsameren Arbeitsspeicher warten. L1 ist am kleinsten und schnellsten. L3 ist am größten und wird von allen Kernen gemeinsam genutzt.\n\nDer Takt gibt an, wie viele Arbeitsschritte pro Sekunde möglich sind. Frequenzen rechnet man immer dezimal. 4,2 GHz sind 4.200 MHz oder 4.200.000.000 Hz. Der Faktor 1.024 gilt nur bei Speichergrößen mit Binärpräfixen wie KiB und GiB.',
        simple:
          'Ein Kern ist ein Koch. Mit Hyper-Threading kocht er zwei Gerichte, und während das eine Wasser kocht, schneidet er fürs andere. Der Cache ist die Arbeitsplatte, der Arbeitsspeicher ist der Vorratsraum.',
        check: {
          q: 'Wie viele MHz sind 3,6 GHz?',
          options: ['36 MHz', '360 MHz', '3.600 MHz', '3.686,4 MHz'],
          correct: 2,
          explain: 'Giga ist 1.000 mal Mega. Bei Frequenzen rechnet man immer mit 1.000.',
        },
      },
    },
    {
      after: 'Prozessor-Werte lesen: Kerne, Threads, Cache und Takt',
      section: {
        title: 'Arbeitsspeicher einbauen: Dual-Channel und ESD',
        keys: ['dual-channel', 'dual channel', 'single channel', 'kanal', 'steckplatz', 'dimm', 'a2', 'b2', 'esd', 'elektrostatisch', 'armband', 'erden', 'einbau', 'kit', 'arbeitsspeicher einbauen'],
        figure: 'ram-slots',
        text:
          'In der AP1 baust du gedanklich einen PC zusammen. Eine typische Aufgabe ist das Einsetzen des Arbeitsspeichers.\n\nModerne Mainboards haben zwei Speicherkanäle, Kanal A und Kanal B. Steckt in jedem Kanal ein Modul, greift der Prozessor auf beide gleichzeitig zu. Das nennt man Dual-Channel. Die Bandbreite verdoppelt sich dabei theoretisch. Stecken beide Module im selben Kanal, läuft der Speicher nur im Single-Channel-Modus und damit langsamer.\n\nWelche Steckplätze man nimmt, steht im Handbuch des Mainboards. Bei zwei Modulen sind es meist A2 und B2, oft farbig markiert. Am besten nimmt man zwei gleiche Module mit gleicher Größe, gleichem Takt und gleichen Timings, idealerweise als Kit.\n\nVor dem Einbau schützt man die Bauteile vor elektrostatischer Entladung, kurz ESD. Man erdet sich, zum Beispiel mit einem ESD-Armband, und fasst Module nur an den Kanten an. Die goldenen Kontakte berührt man nie. Dann öffnet man die Halteklammern, richtet die Kerbe des Moduls am Steg im Steckplatz aus und drückt das Modul gleichmäßig herunter, bis die Klammern einrasten.',
        simple:
          'Zwei Module auf zwei Kanäle zu verteilen ist wie zwei Kassen im Supermarkt zu öffnen. Es geht schneller, weil zwei Schlangen gleichzeitig bedient werden.',
        example:
          'Ein Kunde hat 2 × 16 GB DDR5 bestellt. Du steckst die Module laut Handbuch in A2 und B2. Danach prüfst du im UEFI oder in der Systeminformation, ob 32 GB und Dual-Channel angezeigt werden.',
        check: {
          q: 'Zwei gleiche Module stecken in A1 und A2, also beide in Kanal A. Was ist die Folge?',
          options: ['Der PC startet nicht', 'Der Speicher läuft nur im Single-Channel-Modus', 'Die Kapazität halbiert sich', 'Der Speicher läuft im Quad-Channel-Modus'],
          correct: 1,
          explain: 'Die volle Kapazität ist da, aber ohne zweiten Kanal fehlt die doppelte Bandbreite.',
        },
      },
    },
    {
      after: 'Peripherie, Schnittstellen, Drucker und Monitore',
      section: {
        title: 'Anschlüsse auf Bildern erkennen',
        keys: ['anschluss', 'anschlüsse', 'displayport', 'hdmi', 'dvi', 'vga', 'analog', 'digital', 'usb farbe', 'blau', 'gelb', 'ladeanschluss', 'usb-c', 'thunderbolt', 'power delivery', 'grafikkarte'],
        figure: 'ports',
        text:
          'In der AP1 werden Anschlüsse oft als Bild gezeigt. Du sollst sie benennen oder ihre Besonderheit erklären.\n\nDisplayPort hat eine abgeschrägte Ecke und überträgt digital. HDMI ist flach, an beiden unteren Ecken abgeschrägt und überträgt Bild und Ton digital. DVI ist breit, hat viele eckige Kontakte und einen flachen Steg. VGA ist trapezförmig, hat 15 runde Kontakte in drei Reihen und überträgt das Bild analog. VGA gilt als veraltet.\n\nBei USB helfen oft die Farben. Schwarz oder Weiß steht meist für USB 2.0, Blau für USB 3.x. Ein gelber oder roter Anschluss mit Blitzsymbol ist ein Ladeanschluss. Er liefert mehr Strom, oft auch bei ausgeschaltetem PC. Die Farben sind aber kein fester Standard. Im Zweifel hilft das Handbuch.\n\nUSB-C ist nur die Steckerform. Der Stecker ist verdrehsicher. Je nach Gerät überträgt USB-C Daten, ein Bildsignal und mit Power Delivery bis zu 240 Watt. Thunderbolt nutzt ebenfalls USB-C und ist an einem Blitz mit Pfeil zu erkennen.',
        simple: 'Eckig und alt mit runden Stiften ist VGA. Eine schräge Ecke ist DisplayPort. Zwei schräge Ecken sind HDMI.',
        check: {
          q: 'Welcher Bildanschluss überträgt das Signal analog?',
          options: ['HDMI', 'DisplayPort', 'VGA', 'USB-C'],
          correct: 2,
          explain: 'VGA ist der einzige analoge Anschluss in der Liste. Alle anderen übertragen digital.',
        },
      },
    },
    {
      after: 'Anschlüsse auf Bildern erkennen',
      section: {
        title: 'Englische Anleitungen und Datenblätter verstehen',
        keys: ['englisch', 'english', 'anleitung', 'manual', 'datenblatt', 'datasheet', 'übersetzen', 'slot', 'notch', 'align', 'insert', 'warranty', 'vokabeln'],
        text:
          'In der AP1 gibt es fast immer einen englischen Text. Meist ist es eine Anleitung, ein Datenblatt oder eine Fehlermeldung. Du sollst den Inhalt auf Deutsch wiedergeben. Eine wörtliche Übersetzung ist nicht nötig. Es zählt, dass der Sinn stimmt.\n\nGeh in drei Schritten vor. Lies zuerst die Frage, damit du weißt, was du suchst. Lies dann den Text und achte auf die Verben, denn sie stehen für die Arbeitsschritte. Schreib danach jeden Schritt als kurzen deutschen Satz.\n\nViele Wörter kommen immer wieder. Slot ist der Steckplatz, clip die Halteklammer und notch die Kerbe. Align heißt ausrichten, insert einsetzen und press down herunterdrücken. Power supply ist das Netzteil, ground heißt erden und warranty ist die Garantie. Requirements sind die Anforderungen und compatible heißt kompatibel.\n\nNever, do not und caution leiten eine Warnung ein. Eine Warnung gehört immer in deine Antwort.',
        simple: 'Du bist Dolmetscher, kein Übersetzungsprogramm. Erklär dem Kollegen in eigenen Worten, was er tun soll.',
        example:
          '„Make sure the power cord is unplugged before opening the case.“ heißt sinngemäß: Vor dem Öffnen des Gehäuses den Netzstecker ziehen.',
        check: {
          q: '„Align the notch with the key in the slot.“ Was ist gemeint?',
          options: ['Die Kerbe am Steg im Steckplatz ausrichten', 'Den Schlüssel in den Steckplatz stecken', 'Das Modul einrasten lassen', 'Den Steckplatz reinigen'],
          correct: 0,
          explain: 'Notch ist die Kerbe, key ist hier der Steg im Steckplatz und align heißt ausrichten.',
        },
      },
    },
  ],
  ergonomie: [
    {
      after: 'Software-Ergonomie und Pausen',
      section: {
        title: 'Green IT, Energieverbrauch und Barrierefreiheit',
        keys: ['green it', 'umwelt', 'energie', 'strom', 'stromkosten', 'kwh', 'blauer engel', 'tco certified', 'energy star', 'energielabel', 'elektrog', 'entsorgung', 'barrierefrei', 'barrierefreiheit', 'braillezeile', 'bildschirmlupe'],
        text:
          'Bei der Auswahl von Hardware zählt auch die Umwelt. Das nennt man Green IT. Es geht um den Stromverbrauch im Betrieb, eine lange Nutzungsdauer und die richtige Entsorgung.\n\nSiegel helfen beim Vergleich. Der Blaue Engel steht für umweltfreundliche Produkte. TCO Certified prüft zusätzlich Ergonomie und soziale Bedingungen bei der Herstellung. Energy Star steht für geringen Stromverbrauch. Monitore tragen außerdem das EU-Energielabel mit den Klassen A bis G. Beim Netzteil zeigt 80 PLUS einen hohen Wirkungsgrad.\n\nStrom spart man auch im Betrieb. Energiesparmodus, automatisches Abschalten des Monitors und das Herunterfahren nach Feierabend senken die Kosten. Die Stromkosten rechnet man so: Leistung in Kilowatt mal Betriebsstunden mal Preis pro Kilowattstunde.\n\nAlte Geräte gibt man nach dem ElektroG an einen zertifizierten Entsorger oder an den Hersteller zurück. Vorher löscht man die Daten sicher.\n\nEin Arbeitsplatz soll auch für Menschen mit Einschränkungen nutzbar sein. Das ist Barrierefreiheit. Beispiele sind eine Bildschirmlupe, eine Sprachausgabe, hohe Kontraste, eine Braillezeile für blinde Menschen und ein höhenverstellbarer Tisch für Rollstuhlfahrer.',
        simple: 'Green IT heißt: weniger Strom, länger nutzen, richtig entsorgen. Barrierefrei heißt: Jeder kann den Arbeitsplatz bedienen.',
        example:
          'Ein Monitor braucht 20 W und läuft 8 Stunden an 220 Tagen. Das sind 0,02 kW × 1.760 h = 35,2 kWh. Bei 0,30 € pro kWh kostet das 10,56 € im Jahr.',
        check: {
          q: 'Ein PC braucht 50 W und läuft 2.000 Stunden im Jahr. Wie viele kWh verbraucht er?',
          options: ['25 kWh', '100 kWh', '1.000 kWh', '100.000 kWh'],
          correct: 1,
          explain: '50 W sind 0,05 kW. 0,05 kW × 2.000 h = 100 kWh.',
        },
      },
    },
  ],
  netzwerk: [
    {
      after: 'DHCP und DNS',
      section: {
        title: 'WLAN einrichten und absichern',
        keys: ['wlan', 'ssid', 'wpa2', 'wpa3', 'personal', 'enterprise', 'psk', 'pre-shared key', '802.1x', 'radius', 'gäste-wlan', 'gastnetz', 'wep'],
        text:
          'Für die Anmeldung an einem WLAN brauchst du den Netzwerknamen, die SSID, und das Sicherheitsverfahren. Bei WPA2-Personal oder WPA3-Personal kommt ein gemeinsames Passwort dazu, der Pre-Shared Key.\n\nWPA3 ist der aktuelle Standard. Es schützt besser gegen das Durchprobieren von Passwörtern. WPA2 ist noch verbreitet und mit einem langen Passwort ausreichend. WEP und das erste WPA gelten als unsicher.\n\nBei Personal teilen sich alle Nutzer denselben Schlüssel. Verlässt ein Mitarbeiter die Firma, müsste man das Passwort auf allen Geräten ändern. In größeren Unternehmen nutzt man darum Enterprise. Jeder meldet sich mit eigenem Benutzerkonto oder Zertifikat an. Das Verfahren heißt IEEE 802.1X, und ein RADIUS-Server prüft die Anmeldung. Einzelne Konten lassen sich sperren, ohne dass andere betroffen sind. Dafür ist die Einrichtung aufwendiger.\n\nGäste bekommen ein eigenes Gäste-WLAN. Es ist per VLAN vom Firmennetz getrennt und erlaubt nur den Weg ins Internet.',
        simple: 'Personal ist ein Haustürschlüssel für alle. Enterprise ist ein Chipkartensystem, bei dem jede Karte einzeln gesperrt werden kann.',
        check: {
          q: 'Was prüft bei WPA2-Enterprise oder WPA3-Enterprise die Anmeldung der Nutzer?',
          options: ['Der DHCP-Server', 'Ein RADIUS-Server', 'Der DNS-Server', 'Der Switch über die MAC-Tabelle'],
          correct: 1,
          explain: 'Bei 802.1X leitet der Access Point die Anmeldung an einen RADIUS-Server weiter.',
        },
      },
    },
    {
      after: 'WLAN einrichten und absichern',
      section: {
        title: 'Fehlersuche mit Befehlen und Konsolenausgaben',
        keys: ['ipconfig', 'ping', 'tracert', 'traceroute', 'nslookup', 'konsole', 'befehl', 'kommandozeile', 'fehlersuche', 'renew', 'ip addr', 'adresskonflikt', 'kein internet'],
        code: 'C:\\> ipconfig\nIPv4-Adresse . : 169.254.77.12\nSubnetzmaske . : 255.255.0.0\nStandardgateway:',
        text:
          'In der AP1 bekommst du oft eine Konsolenausgabe. Du sollst sie deuten und den Fehler finden.\n\nMit ipconfig siehst du unter Windows die eigene IP-Adresse, die Subnetzmaske und das Standardgateway. Mit ipconfig /all siehst du auch die MAC-Adresse und den DNS-Server. Unter Linux heißt der Befehl ip addr.\n\nMit ping prüfst du, ob ein Gerät antwortet. Man pingt von innen nach außen. Zuerst die eigene Adresse, dann das Gateway, dann eine IP-Adresse im Internet, zuletzt einen Namen. So siehst du, wo die Kette reißt. Klappt der Ping auf eine IP-Adresse im Internet, aber nicht auf einen Namen, liegt der Fehler meist beim DNS. Achtung: Eine Firewall kann Ping blockieren. Keine Antwort heißt also nicht immer, dass das Gerät aus ist.\n\nMit tracert, unter Linux traceroute, siehst du alle Router auf dem Weg zum Ziel. Bricht die Liste ab, liegt das Problem ab dieser Station. Mit nslookup fragst du den DNS-Server direkt nach einem Namen.\n\nAchte auf typische Hinweise. Eine Adresse aus 169.254.0.0/16 zeigt, dass kein DHCP-Server erreichbar war. Ein fehlendes Gateway bedeutet, dass der PC nur im eigenen Netz arbeiten kann.',
        simple: 'Ping ist wie Rufen im Wald. Kommt ein Echo, ist der andere da. Du rufst erst nah, dann immer weiter weg.',
        check: {
          q: 'Ping auf 8.8.8.8 klappt, Ping auf www.beispiel.de nicht. Wo liegt der Fehler wahrscheinlich?',
          options: ['Am Netzwerkkabel', 'Beim DHCP', 'Beim DNS', 'An der Netzwerkkarte'],
          correct: 2,
          explain: 'Die Verbindung ins Internet steht. Nur die Namensauflösung funktioniert nicht.',
        },
      },
    },
  ],
  projekt: [
    {
      after: null,
      section: {
        title: 'Kundengespräch: Bedarf zielgruppengerecht ermitteln',
        keys: ['kundengespräch', 'zielgruppe', 'zielgruppengerecht', 'offene frage', 'geschlossene frage', 'fragetechnik', 'aktives zuhören', 'nutzen', 'merkmal', 'präsentation', 'vier-ohren', 'schulz von thun', 'kommunikation'],
        text:
          'Die AP1 beginnt meist mit einem Kunden. Du sollst herausfinden, was er braucht, und so mit ihm sprechen, dass er dich versteht. Zielgruppengerecht heißt: Ein Geschäftsführer will Kosten und Nutzen hören. Ein Anwender will wissen, was sich an seinem Arbeitsplatz ändert. Ein Administrator will technische Details.\n\nIm Gespräch nutzt du Fragetechniken. Offene Fragen beginnen mit einem W-Wort, zum Beispiel „Welche Programme nutzen Sie täglich?“. Der Kunde erzählt frei, und du sammelst Informationen. Geschlossene Fragen beantwortet man mit Ja oder Nein, zum Beispiel „Arbeiten Sie auch von zu Hause?“. Damit klärst du Details und sicherst Ergebnisse. Beim aktiven Zuhören fasst du zusammen, was du verstanden hast. So vermeidest du Missverständnisse.\n\nFür den Kunden zählt der Nutzen, nicht das Merkmal. „Die SSD schafft 3.500 MB/s“ ist ein Merkmal. „Ihre Konstruktionsprogramme starten in Sekunden“ ist der Nutzen. In Präsentationen und Angeboten verbindest du darum jede Tatsache mit einem Vorteil für den Kunden.\n\nDas Vier-Ohren-Modell von Schulz von Thun erklärt, warum Gespräche schiefgehen. Jede Nachricht hat einen Sachinhalt, eine Selbstoffenbarung, eine Beziehungsseite und einen Appell. „Der Drucker geht schon wieder nicht“ meldet sachlich eine Störung. Es kann aber auch heißen: Kümmere dich endlich darum.',
        simple: 'Erst fragen, dann zuhören, dann zusammenfassen. Und dem Kunden immer sagen, was er davon hat.',
        check: {
          q: 'Welche Frage ist eine offene Frage?',
          options: ['Nutzen Sie Windows 11?', 'Wie arbeiten Ihre Mitarbeiter im Außendienst?', 'Brauchen Sie einen Drucker?', 'Liegt Ihr Budget über 10.000 €?'],
          correct: 1,
          explain: 'Sie beginnt mit einem W-Wort und lässt sich nicht mit Ja oder Nein beantworten.',
        },
      },
    },
    {
      after: 'Beschaffung, Kaufvertrag und Mängel',
      section: {
        title: 'Angebot erstellen: Inhalt und Bindung',
        keys: ['angebot', 'bindefrist', 'bindung', 'gültigkeit', 'willenserklärung', 'antrag', 'freibleibend', 'freizeichnungsklausel', 'anfrage', 'auftragsbestätigung', 'formale angaben', 'angebotsnummer', 'zahlungsbedingungen', 'lieferbedingungen'],
        text:
          'Ein Angebot ist eine verbindliche Willenserklärung. Wer ein Angebot abgibt, ist daran gebunden. Bestellt der Kunde rechtzeitig und ohne Änderung, ist der Kaufvertrag zustande gekommen. Bestellt er mit Änderungen, gilt seine Bestellung als neues Angebot.\n\nWie lange die Bindung gilt, hängt von der Frist ab. Steht im Angebot „gültig bis 30. Juni“, gilt es bis zu diesem Datum. Ohne Frist gilt ein Angebot unter Anwesenden nur sofort. Unter Abwesenden, also per Brief oder E-Mail, gilt es so lange, wie man unter normalen Umständen eine Antwort erwarten kann. Mit Freizeichnungsklauseln wie „freibleibend“ oder „solange der Vorrat reicht“ schränkt man die Bindung ein.\n\nEin vollständiges Angebot enthält formale und inhaltliche Angaben. Formal sind Absender, Anschrift des Kunden, Datum, Angebotsnummer, Ansprechpartner und Gültigkeitsdauer. Inhaltlich sind es die Leistungen mit Menge und Beschreibung, Einzel- und Gesamtpreis, Umsatzsteuer, Rabatte sowie Liefer- und Zahlungsbedingungen.\n\nEine Anfrage ist dagegen unverbindlich. Mit ihr holst du Angebote ein, ohne dich zu verpflichten. Eine Bestellung ohne vorheriges Angebot ist selbst ein Antrag. Dann entsteht der Vertrag erst mit der Auftragsbestätigung.',
        simple: 'Ein Angebot ist ein Versprechen mit Ablaufdatum. Die Anfrage ist nur ein Nachfragen.',
        check: {
          q: 'Ein Angebot ohne Frist wurde per E-Mail geschickt. Wie lange ist der Anbieter gebunden?',
          options: ['Gar nicht', 'Genau 14 Tage', 'So lange, wie man unter normalen Umständen eine Antwort erwarten kann', 'Unbegrenzt'],
          correct: 2,
          explain: 'Unter Abwesenden gilt die übliche Antwortzeit. Danach erlischt die Bindung.',
        },
      },
    },
    {
      after: 'Installation, Übergabe und Dokumentation',
      section: {
        title: 'Testen und protokollieren',
        keys: ['test', 'testen', 'testfall', 'testprotokoll', 'funktionstest', 'integrationstest', 'abnahmetest', 'black-box', 'white-box', 'soll-ist', 'erwartetes ergebnis', 'protokollieren', 'kontrolle'],
        text:
          'Nach der Einrichtung prüfst du, ob alles funktioniert. Die AP1 verlangt ausdrücklich, dass du einen Arbeitsplatz testest und deine Leistung protokollierst.\n\nTests plant man vorher. Für jeden Testfall legt man fest, was geprüft wird, wie man vorgeht und welches Ergebnis erwartet wird. Beim Testen vergleicht man das tatsächliche Ergebnis mit dem erwarteten. Weicht es ab, notiert man den Fehler, behebt ihn und testet erneut.\n\nTypische Testfälle sind die Anmeldung, der Zugriff auf Netzlaufwerke, das Drucken, der Internetzugang, die Fachprogramme, die Datensicherung und die Sicherheitseinstellungen wie Virenschutz und Verschlüsselung.\n\nMan unterscheidet Testarten. Beim Funktionstest prüft man einzelne Funktionen. Beim Integrationstest prüft man das Zusammenspiel, zum Beispiel von PC, Netzwerk und Server. Der Abnahmetest findet mit dem Kunden statt. Beim Black-Box-Test kennt der Tester nur Eingabe und Ausgabe. Beim White-Box-Test kennt er auch den inneren Aufbau.\n\nEin Testprotokoll enthält Datum, Prüfer, Gerät mit Seriennummer, Testfall, erwartetes und tatsächliches Ergebnis, Bewertung und Maßnahmen. Am Ende bestätigt der Kunde mit seiner Unterschrift auf dem Abnahmeprotokoll.',
        simple: 'Erst aufschreiben, was rauskommen soll. Dann testen. Dann vergleichen und alles festhalten.',
        example:
          'Testfall: Drucken auf dem Abteilungsdrucker. Erwartet: Testseite wird gedruckt. Tatsächlich: Fehlermeldung „Treiber nicht gefunden“. Maßnahme: Treiber installiert, Test wiederholt, Ergebnis in Ordnung.',
        check: {
          q: 'Was gehört nicht in ein Testprotokoll?',
          options: ['Das erwartete Ergebnis', 'Das tatsächliche Ergebnis', 'Das Passwort des Nutzers', 'Die Seriennummer des Geräts'],
          correct: 2,
          explain: 'Passwörter haben in Protokollen nichts zu suchen. Das wäre ein Verstoß gegen IT-Sicherheit und Datenschutz.',
        },
      },
    },
    {
      after: 'Testen und protokollieren',
      section: {
        title: 'Kunden in den Arbeitsplatz einweisen',
        keys: ['einweisung', 'einweisen', 'schulung', 'vier-stufen-methode', 'vormachen', 'nachmachen', 'anwender', 'kurzanleitung', 'teilnehmerliste', 'zielgruppe'],
        text:
          'Die AP1 prüft auch, ob du Kunden in ihren Arbeitsplatz einweisen kannst. Einweisen heißt, dem Nutzer so viel zu zeigen, dass er sicher und selbstständig arbeiten kann.\n\nZuerst klärst du, wen du einweist. Ein Anfänger braucht kleine Schritte und einfache Worte. Ein erfahrener Nutzer will nur wissen, was neu ist. Danach planst du Inhalt, Zeit und Ort.\n\nBewährt hat sich die Vier-Stufen-Methode. Du bereitest vor. Du machst es vor und erklärst. Der Nutzer macht es nach. Dann übt er allein, und du hilfst nur noch. So merkt man sich Abläufe besser als durch reines Zuhören.\n\nZu einer Einweisung gehören die Anmeldung, das Speichern auf dem Netzlaufwerk statt lokal, das Sperren des Bildschirms beim Verlassen, der Umgang mit verdächtigen E-Mails und der Weg zum Support. Eine schriftliche Kurzanleitung hilft beim Nachschlagen. Die Teilnahme dokumentierst du, zum Beispiel mit einer Unterschrift auf einer Teilnehmerliste.',
        simple: 'Vormachen, nachmachen lassen, üben lassen. Und aufschreiben, dass es stattgefunden hat.',
        check: {
          q: 'Was kommt bei der Vier-Stufen-Methode direkt nach dem Vormachen?',
          options: ['Vorbereiten', 'Nachmachen lassen', 'Abschlusstest', 'Protokoll unterschreiben'],
          correct: 1,
          explain: 'Vorbereiten, vormachen, nachmachen lassen, üben lassen.',
        },
      },
    },
  ],
};

export const AP1_TERMS: Partial<Record<TopicId, { term: string; def: string }[]>> = {
  hardware: [
    { term: 'Dual-Channel', def: 'Zwei Speichermodule in zwei Kanälen. Der Prozessor greift auf beide gleichzeitig zu.' },
    { term: 'ESD', def: 'Electrostatic Discharge. Elektrostatische Entladung, die Bauteile zerstören kann.' },
    { term: 'Cache', def: 'Sehr schneller Zwischenspeicher im Prozessor, gestuft in L1, L2 und L3.' },
    { term: 'Logischer Prozessor', def: 'Thread, den ein Kern per SMT zusätzlich bearbeitet. Kein echter Kern.' },
    { term: 'VGA', def: 'Alter analoger Bildanschluss mit 15 Kontakten in drei Reihen.' },
    { term: 'Power Delivery', def: 'Ladestandard über USB-C mit bis zu 240 Watt.' },
  ],
  ergonomie: [
    { term: 'Green IT', def: 'Umweltschonender Einsatz von IT: wenig Strom, lange Nutzung, richtige Entsorgung.' },
    { term: 'Blauer Engel', def: 'Deutsches Umweltzeichen für umweltfreundliche Produkte.' },
    { term: 'TCO Certified', def: 'Siegel für Umwelt, Ergonomie und soziale Bedingungen bei der Herstellung.' },
    { term: 'Barrierefreiheit', def: 'Der Arbeitsplatz ist auch für Menschen mit Einschränkungen nutzbar.' },
  ],
  netzwerk: [
    { term: 'SSID', def: 'Name eines WLANs.' },
    { term: 'Pre-Shared Key', def: 'Gemeinsames WLAN-Passwort bei WPA2- oder WPA3-Personal.' },
    { term: 'IEEE 802.1X', def: 'Anmeldung mit eigenem Konto oder Zertifikat am Netz, geprüft von einem RADIUS-Server.' },
    { term: 'RADIUS', def: 'Server, der Anmeldungen an WLAN oder Netz prüft.' },
    { term: 'tracert', def: 'Zeigt alle Router auf dem Weg zu einem Ziel. Unter Linux traceroute.' },
  ],
  projekt: [
    { term: 'Offene Frage', def: 'Beginnt mit einem W-Wort. Der Kunde antwortet frei.' },
    { term: 'Geschlossene Frage', def: 'Lässt sich mit Ja oder Nein beantworten. Klärt Details.' },
    { term: 'Vier-Ohren-Modell', def: 'Sachinhalt, Selbstoffenbarung, Beziehung und Appell einer Nachricht (Schulz von Thun).' },
    { term: 'Bindefrist', def: 'Zeit, in der der Anbieter an sein Angebot gebunden ist.' },
    { term: 'Freizeichnungsklausel', def: 'Schränkt die Bindung an ein Angebot ein, zum Beispiel „freibleibend“.' },
    { term: 'Testprotokoll', def: 'Hält Testfall, erwartetes und tatsächliches Ergebnis, Bewertung und Maßnahmen fest.' },
    { term: 'Vier-Stufen-Methode', def: 'Vorbereiten, vormachen, nachmachen lassen, üben lassen.' },
  ],
};

export const AP1_TRAPS: Partial<Record<TopicId, string[]>> = {
  hardware: [
    'Beide RAM-Module in denselben Kanal stecken und so auf Dual-Channel verzichten.',
    'Gigahertz mit 1.024 statt mit 1.000 umrechnen.',
    'Logische Prozessoren für echte Kerne halten.',
    'Im englischen Text die Warnung mit „never“ weglassen.',
  ],
  ergonomie: ['Watt und Kilowattstunden verwechseln. Erst Watt in Kilowatt umrechnen, dann mal Stunden.'],
  netzwerk: [
    'Aus einem fehlgeschlagenen Ping schließen, dass das Gerät aus ist. Eine Firewall kann Ping blockieren.',
    'WPA-Personal für eine große Firma empfehlen, obwohl Mitarbeiter oft wechseln.',
  ],
  projekt: [
    'Eine Ja-Nein-Frage aufschreiben, wenn offene Fragen verlangt sind.',
    'Dem Kunden technische Merkmale statt Nutzen nennen.',
    'Eine Anfrage für verbindlich halten.',
    'Im Testprotokoll das erwartete Ergebnis vergessen.',
  ],
};

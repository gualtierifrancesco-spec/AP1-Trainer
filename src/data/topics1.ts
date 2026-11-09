import type { Topic } from './topicTypes';

export const topicsA: Topic[] = [
  {
    id: 'hardware',
    title: 'IT-Systeme & Hardware',
    short: 'Hardware',
    area: 'Hardware & Arbeitsplatz',
    examWeight: 14,
    intro:
      'Ein Mitarbeiter braucht einen neuen PC. Du sollst das passende Gerät auswählen. Dafür musst du wissen, was die einzelnen Bauteile tun. Du musst auch erkennen, welche Teile zusammenpassen. In der AP1 kommen dazu oft kleine Rechnungen, zum Beispiel zur Datenmenge oder zum Stromverbrauch.',
    sections: [
      {
        title: 'Das EVA-Prinzip und das Mainboard',
        keys: ['eva', 'mainboard', 'hauptplatine', 'eingabe', 'verarbeitung', 'ausgabe', 'chipsatz', 'sockel'],
        visual: 'pc-parts',
        text:
          'Jeder Computer arbeitet nach dem EVA-Prinzip. EVA steht für Eingabe, Verarbeitung und Ausgabe. Die Tastatur gibt Daten ein. Die CPU verarbeitet sie. Der Monitor gibt das Ergebnis aus. Dazu kommt fast immer die Speicherung.\n\nDas Mainboard ist die Hauptplatine. Alle anderen Bauteile werden daran angeschlossen. Auf dem Mainboard sitzt der Sockel für die CPU. Der Sockel bestimmt, welche CPU passt. Der Chipsatz steuert die Kommunikation zwischen den Bauteilen. Außerdem hat das Mainboard Steckplätze für RAM, Grafikkarte und SSD.',
        simple:
          'Stell dir das Mainboard wie die Straßen einer Stadt vor. Die Bauteile sind die Häuser. Ohne Straßen kommt keine Information von einem Haus zum anderen.',
        example:
          'Ein Kunde möchte eine neue CPU in seinen alten PC einbauen. Du prüfst zuerst den Sockel auf dem Mainboard. Passt der Sockel nicht, braucht er auch ein neues Mainboard.',
        check: {
          q: 'Was bestimmt hauptsächlich, welche CPU auf ein Mainboard passt?',
          options: ['Die Größe des Netzteils', 'Der CPU-Sockel und der Chipsatz', 'Die Anzahl der USB-Ports', 'Das Betriebssystem'],
          correct: 1,
          explain: 'Der Sockel muss mechanisch und elektrisch zur CPU passen. Der Chipsatz muss die CPU-Generation unterstützen.',
        },
      },
      {
        title: 'CPU, RAM und ROM',
        keys: ['cpu', 'prozessor', 'kerne', 'takt', 'cache', 'ram', 'arbeitsspeicher', 'rom', 'flüchtig', 'ddr', 'bios', 'uefi', 'firmware'],
        text:
          'Die CPU ist der Prozessor. Sie rechnet und steuert alle Abläufe. Wichtige Werte sind die Anzahl der Kerne, der Takt in GHz und der Cache. Mehr Kerne helfen, wenn viele Programme gleichzeitig laufen.\n\nDer RAM ist der Arbeitsspeicher. Hier liegen die Programme und Daten, mit denen gerade gearbeitet wird. RAM ist flüchtig. Das bedeutet: Ohne Strom sind die Daten weg. DDR4 und DDR5 sind verschiedene Generationen. Sie passen nicht in denselben Steckplatz.\n\nDer ROM ist ein Nur-Lese-Speicher. Er ist nicht flüchtig. Heute liegt dort meist die Firmware des Mainboards, also das BIOS oder der Nachfolger UEFI. Die Firmware startet den Rechner und prüft die Hardware.',
        simple:
          'Die CPU ist der Koch. Der RAM ist die Arbeitsfläche in der Küche. Die SSD ist der Vorratsschrank. Ist die Arbeitsfläche zu klein, muss der Koch ständig zum Schrank laufen. Dann wird alles langsam.',
        example:
          'Eine Buchhalterin hat viele Excel-Tabellen und den Browser mit vielen Tabs offen. Ihr PC wird langsam. Oft ist zu wenig RAM die Ursache. 16 GB sind für Büroarbeit heute ein guter Wert.',
        check: {
          q: 'Welcher Speicher verliert seine Daten, wenn der Strom ausfällt?',
          options: ['ROM', 'SSD', 'RAM', 'HDD'],
          correct: 2,
          explain: 'RAM ist flüchtig. SSD, HDD und ROM behalten ihre Daten auch ohne Strom.',
        },
      },
      {
        title: 'SSD und HDD',
        keys: ['ssd', 'hdd', 'festplatte', 'nvme', 'sata', 'm.2', 'speicher', 'raid', 'tbw', 'mtbf'],
        text:
          'Eine HDD ist eine klassische Festplatte. Sie hat drehende Scheiben und einen Lesekopf. Sie ist günstig pro Gigabyte, aber langsam und empfindlich gegen Stöße.\n\nEine SSD speichert Daten auf Flash-Chips. Sie hat keine beweglichen Teile. Sie ist viel schneller, leiser und robuster. Eine SATA-SSD schafft etwa 550 MB/s. Eine NVMe-SSD im M.2-Steckplatz nutzt PCIe und ist um ein Vielfaches schneller.\n\nBei SSDs gibt es den Wert TBW. Er sagt, wie viele Terabyte man insgesamt schreiben kann, bevor die Haltbarkeit nicht mehr garantiert ist.\n\nIn Servern werden mehrere Platten zu einem RAID verbunden. RAID 1 spiegelt die Daten auf zwei Platten. RAID 5 braucht mindestens drei Platten und verkraftet den Ausfall einer Platte. Ganz wichtig: Ein RAID ersetzt kein Backup.',
        simple:
          'Eine HDD ist wie ein Plattenspieler. Eine SSD ist wie ein USB-Stick, nur viel schneller. Für das Betriebssystem nimmt man heute immer eine SSD.',
        example:
          'Ein Fileserver bekommt vier Festplatten mit je 4 TB im RAID 5. Nutzbar sind (4 − 1) × 4 TB = 12 TB. Eine Platte darf ausfallen.',
        check: {
          q: 'Wie viel Speicher ist bei RAID 1 mit zwei 2-TB-Platten nutzbar?',
          options: ['4 TB', '2 TB', '1 TB', '3 TB'],
          correct: 1,
          explain: 'RAID 1 spiegelt. Beide Platten enthalten dasselbe. Nutzbar ist also nur die Größe einer Platte.',
        },
      },
      {
        title: 'Grafikkarte, Netzteil und USV',
        keys: ['grafikkarte', 'gpu', 'netzteil', 'watt', 'wirkungsgrad', '80 plus', 'usv', 'stromkosten', 'kwh'],
        text:
          'Für Office-Arbeit reicht eine integrierte Grafik im Prozessor. Für CAD, Videoschnitt oder 3D braucht man eine dedizierte Grafikkarte mit eigenem Grafikspeicher.\n\nDas Netzteil wandelt Wechselstrom aus der Steckdose in Gleichstrom für den PC. Es muss genug Leistung haben. Der Wirkungsgrad zeigt, wie viel Energie wirklich beim PC ankommt. Ein Netzteil mit 90 % Wirkungsgrad, das 450 W abgibt, nimmt 500 W aus der Steckdose auf. Das Siegel 80 PLUS steht für einen hohen Wirkungsgrad.\n\nEine USV ist eine unterbrechungsfreie Stromversorgung. Sie überbrückt Stromausfälle mit einem Akku. Es gibt drei Bauarten. Die Offline-USV schaltet erst bei Ausfall um. Die Line-Interactive-USV regelt zusätzlich Spannungsschwankungen. Die Online-USV versorgt die Geräte dauerhaft über den Akku-Wechselrichter. Sie bietet den besten Schutz und wird für wichtige Server genutzt.',
        simple:
          'Die USV ist wie eine Powerbank für den Server. Fällt der Strom aus, läuft der Server weiter und kann sauber herunterfahren.',
        example:
          'Ein PC braucht im Schnitt 80 W und läuft 8 Stunden an 220 Tagen. Das sind 80 × 8 × 220 = 140.800 Wh = 140,8 kWh. Bei 0,30 € pro kWh kostet das 42,24 € im Jahr.',
        check: {
          q: 'Welche USV-Bauart schützt am besten, weil sie die Geräte dauerhaft versorgt?',
          options: ['Offline-USV', 'Line-Interactive-USV', 'Online-USV (Doppelwandler)', 'Überspannungsschutz-Steckdose'],
          correct: 2,
          explain: 'Die Online-USV wandelt den Strom ständig um. Es gibt keine Umschaltzeit.',
        },
      },
      {
        title: 'Peripherie, Schnittstellen, Drucker und Monitore',
        keys: ['usb', 'hdmi', 'displayport', 'thunderbolt', 'drucker', 'scanner', 'dpi', 'monitor', 'auflösung', 'ppi', 'panel', 'ips', 'seitenpreis', 'peripherie'],
        text:
          'Peripheriegeräte sind alle Geräte außerhalb des eigentlichen Rechners. Dazu gehören Tastatur, Maus, Monitor, Drucker und Scanner.\n\nWichtige Schnittstellen sind USB, HDMI und DisplayPort. USB 2.0 schafft 480 Mbit/s. USB 3.2 Gen 1 schafft 5 Gbit/s und Gen 2 schafft 10 Gbit/s. USB-C ist nur die Form des Steckers. Über USB-C können je nach Gerät auch Bild und Strom übertragen werden.\n\nBei Monitoren ist die Auflösung wichtig. Full HD hat 1920 × 1080 Pixel. WQHD hat 2560 × 1440 Pixel. 4K UHD hat 3840 × 2160 Pixel. IPS-Panels zeigen Farben gut und blickwinkelstabil. Für Büros ist eine matte, entspiegelte Oberfläche wichtig.\n\nBei Druckern vergleicht man die Anschaffung und die laufenden Kosten. Der Seitenpreis ist der Tonerpreis geteilt durch die Reichweite. Ein billiger Drucker kann wegen teurer Patronen auf Dauer teurer sein. Die Auflösung von Druckern und Scannern wird in dpi angegeben.',
        simple:
          'USB-C ist nur die Steckerform, so wie eine Steckdose. Was durch das Kabel geht, hängt vom Gerät und vom Kabel ab.',
        example:
          'Ein Toner kostet 89 € und reicht für 3.000 Seiten. Der Seitenpreis für Toner beträgt 89 € ÷ 3.000 = 0,0297 €, also knapp 3 Cent.',
        check: {
          q: 'Wie viele Pixel hat ein Full-HD-Monitor insgesamt?',
          options: ['2.073.600', '921.600', '3.686.400', '8.294.400'],
          correct: 0,
          explain: '1920 × 1080 = 2.073.600 Pixel.',
        },
      },
      {
        title: 'Datenmengen und Übertragung berechnen',
        keys: ['bit', 'byte', 'kib', 'mib', 'gib', 'übertragung', 'datenrate', 'mbit', 'umrechnung', 'farbtiefe', 'bildgröße'],
        text:
          'Ein Byte besteht aus 8 Bit. Bei Datenmengen gibt es zwei Systeme. Im Dezimalsystem ist 1 KB gleich 1.000 Byte. Im Binärsystem ist 1 KiB gleich 1.024 Byte. Festplattenhersteller rechnen dezimal. Betriebssysteme zeigen oft binär an. Deshalb wirkt eine 1-TB-Platte in Windows kleiner.\n\nDatenraten werden in Bit pro Sekunde angegeben. Datenmengen meist in Byte. Für die Übertragungszeit rechnest du die Datenmenge zuerst in Bit um. Dann teilst du durch die Datenrate.\n\nDie Größe eines unkomprimierten Bildes ist Breite mal Höhe mal Farbtiefe. Die Farbtiefe steht in Bit pro Pixel. Bei 24 Bit Farbtiefe braucht jeder Pixel 3 Byte.',
        simple:
          'Bit ist klein geschrieben und Byte groß: b und B. Bei einer Leitung steht fast immer Bit. Bei einer Datei fast immer Byte. Darum musst du immer mal 8 oder geteilt durch 8 rechnen.',
        example:
          'Eine Datei mit 500 MB soll über eine 100-Mbit/s-Leitung. 500 MB × 8 = 4.000 Mbit. 4.000 Mbit ÷ 100 Mbit/s = 40 Sekunden.',
        check: {
          q: 'Wie viele Byte sind 1 KiB?',
          options: ['1.000', '1.024', '8.192', '1.048'],
          correct: 1,
          explain: 'KiB ist die binäre Einheit: 2 hoch 10 = 1.024 Byte.',
        },
      },
    ],
    steps: {
      title: 'So berechnest du eine Übertragungszeit',
      steps: [
        'Schreib die Datenmenge mit Einheit auf, zum Beispiel 2 GB.',
        'Rechne in Bit um: 2 GB = 2.000 MB = 16.000 Mbit (dezimal, mal 8).',
        'Prüfe die Einheit der Leitung, zum Beispiel 50 Mbit/s.',
        'Teile Datenmenge durch Datenrate: 16.000 ÷ 50 = 320 Sekunden.',
        'Rechne in Minuten um, wenn gefragt: 320 ÷ 60 ≈ 5,33 Minuten.',
      ],
    },
    widget: 'hardware-match',
    widgetTitle: 'PC-Komponenten zuordnen',
    terms: [
      { term: 'CPU', def: 'Prozessor. Rechnet und steuert alle Abläufe im Computer.' },
      { term: 'RAM', def: 'Flüchtiger Arbeitsspeicher für laufende Programme und Daten.' },
      { term: 'ROM', def: 'Nicht flüchtiger Nur-Lese-Speicher, zum Beispiel für die Firmware.' },
      { term: 'UEFI', def: 'Moderne Firmware des Mainboards. Nachfolger des BIOS. Wird für Secure Boot gebraucht.' },
      { term: 'Chipsatz', def: 'Steuert den Datenaustausch zwischen CPU, Speicher und Schnittstellen.' },
      { term: 'NVMe', def: 'Protokoll für sehr schnelle SSDs über PCIe, meist im M.2-Format.' },
      { term: 'TBW', def: 'Terabytes Written. Garantierte Schreibmenge einer SSD.' },
      { term: 'MTBF', def: 'Mittlere Betriebszeit zwischen zwei Ausfällen. Ein statistischer Wert.' },
      { term: 'RAID', def: 'Verbund mehrerer Festplatten für Ausfallsicherheit oder Geschwindigkeit. Kein Backup.' },
      { term: 'USV', def: 'Unterbrechungsfreie Stromversorgung. Überbrückt Stromausfälle mit Akkus.' },
      { term: 'Wirkungsgrad', def: 'Abgegebene Leistung geteilt durch aufgenommene Leistung.' },
      { term: 'dpi', def: 'Dots per Inch. Auflösung bei Druckern und Scannern.' },
      { term: 'TDP', def: 'Thermal Design Power. Abwärme, für die die Kühlung ausgelegt sein muss.' },
    ],
    formulas: [
      'Übertragungszeit = Datenmenge in Bit ÷ Datenrate in Bit/s',
      'Bildgröße in Bit = Breite × Höhe × Farbtiefe',
      'Energie in kWh = Leistung in W × Stunden ÷ 1.000',
      'Stromkosten = kWh × Preis pro kWh',
      'Wirkungsgrad η = Abgabeleistung ÷ Aufnahmeleistung',
      'RAID 5 nutzbar = (Anzahl Platten − 1) × Plattengröße',
      'RAID 6 nutzbar = (Anzahl Platten − 2) × Plattengröße',
      'Seitenpreis = Verbrauchsmaterialpreis ÷ Reichweite in Seiten',
    ],
    merksaetze: [
      'Leitung in Bit, Datei in Byte. Darum: mal 8.',
      'RAID schützt vor Plattenausfall, nicht vor Löschen, Viren oder Brand.',
      'USB-C ist eine Steckerform, kein Übertragungsstandard.',
      'DDR4 und DDR5 sind nicht kompatibel.',
    ],
    traps: [
      'KB und KiB verwechseln. Lies genau, ob 1.000 oder 1.024 gemeint ist.',
      'Beim Netzteil die Aufnahmeleistung mit der Abgabeleistung verwechseln.',
      'RAID 1 mit zwei Platten ergibt nicht die doppelte, sondern die einfache Kapazität.',
      'Einen günstigen Drucker wählen, ohne die Kosten pro Seite zu berechnen.',
    ],
    summary:
      'Die CPU rechnet, der RAM hält die laufenden Daten und die SSD speichert dauerhaft. Das Mainboard verbindet alles, und der Sockel entscheidet über die passende CPU. SSDs sind schneller als HDDs. RAID erhöht die Verfügbarkeit, ersetzt aber kein Backup. Bei Rechnungen achtest du auf Bit und Byte sowie auf dezimal und binär.',
  },
  {
    id: 'ergonomie',
    title: 'Arbeitsplatz & Ergonomie',
    short: 'Ergonomie',
    area: 'Hardware & Arbeitsplatz',
    examWeight: 6,
    intro:
      'Ein Bildschirmarbeitsplatz muss gesund sein. Das schreibt der Arbeitsschutz vor. Früher stand das in der Bildschirmarbeitsverordnung. Seit 2016 steht es in der Arbeitsstättenverordnung im Anhang 6. In der Prüfung sollst du einen Arbeitsplatz beurteilen und Verbesserungen vorschlagen.',
    sections: [
      {
        title: 'Rechtliche Grundlagen',
        keys: ['arbstättv', 'arbeitsstättenverordnung', 'bildschirmarbeitsverordnung', 'arbeitsschutz', 'gefährdungsbeurteilung', 'dguv', 'arbmedvv', 'augenuntersuchung'],
        text:
          'Die Bildschirmarbeitsverordnung gibt es nicht mehr als eigene Verordnung. Ihre Regeln stehen seit Dezember 2016 in der Arbeitsstättenverordnung, kurz ArbStättV, im Anhang 6. Praktische Hinweise gibt die DGUV Information 215-410 der Unfallversicherung.\n\nDer Arbeitgeber muss eine Gefährdungsbeurteilung machen. Er prüft also, welche Gefahren am Arbeitsplatz bestehen. Er muss Beschäftigten an Bildschirmgeräten eine Untersuchung der Augen anbieten. Das regelt die Verordnung zur arbeitsmedizinischen Vorsorge. Wenn nötig, bekommen sie eine spezielle Bildschirmbrille.',
        simple:
          'Der Chef muss dafür sorgen, dass dein Arbeitsplatz dich nicht krank macht. Dafür gibt es klare Regeln in der Arbeitsstättenverordnung.',
        check: {
          q: 'Wo stehen heute die Regeln für Bildschirmarbeitsplätze?',
          options: ['In der DSGVO', 'In der Arbeitsstättenverordnung, Anhang 6', 'Im Handelsgesetzbuch', 'In der Bildschirmarbeitsverordnung von 2021'],
          correct: 1,
          explain: 'Die Bildschirmarbeitsverordnung wurde 2016 in die ArbStättV übernommen.',
        },
      },
      {
        title: 'Monitor richtig aufstellen',
        keys: ['monitor', 'sehabstand', 'augenhöhe', 'blendung', 'spiegelung', 'fenster', 'licht', 'beleuchtung', 'lux'],
        visual: 'ergo',
        text:
          'Der Abstand zwischen Augen und Bildschirm liegt meist zwischen 50 und 80 Zentimetern. Bei großen Monitoren darf er auch etwas größer sein. Die oberste Zeile auf dem Bildschirm sollte auf oder etwas unter Augenhöhe liegen. Dann schaut man leicht nach unten. Das entlastet den Nacken.\n\nDer Bildschirm steht am besten seitlich zum Fenster. Die Blickrichtung verläuft also parallel zur Fensterfront. So gibt es weder Blendung von vorne noch Spiegelung von hinten. Der Bildschirm sollte entspiegelt sein. Der Kontrast und die Helligkeit müssen einstellbar sein.\n\nFür Büroarbeit empfiehlt die Arbeitsstättenregel ASR A3.4 eine Beleuchtungsstärke von 500 Lux.',
        simple:
          'Fenster nie direkt vor oder hinter dem Bildschirm. Immer seitlich. Und oben auf dem Bildschirm sollen die Augen ungefähr hinschauen.',
        example:
          'Ein Kollege klagt über Kopfschmerzen. Sein Monitor steht direkt vor dem Fenster. Du drehst den Schreibtisch, sodass er parallel zum Fenster schaut. Dazu stellst du den Monitor tiefer und weiter weg.',
        check: {
          q: 'Wie sollte ein Bildschirm zum Fenster stehen?',
          options: ['Mit dem Rücken zum Fenster', 'Direkt vor dem Fenster', 'Seitlich, Blickrichtung parallel zum Fenster', 'Egal, wenn Rollos vorhanden sind'],
          correct: 2,
          explain: 'Seitlich vermeidet man Blendung von vorne und Spiegelungen im Bildschirm.',
        },
      },
      {
        title: 'Stuhl, Tisch und Eingabegeräte',
        keys: ['stuhl', 'tisch', 'höhenverstellbar', 'tastatur', 'maus', 'sitzen', 'stehen', 'fußstütze', 'handballen'],
        text:
          'Beim Sitzen sollen die Füße flach auf dem Boden stehen. Die Oberschenkel liegen etwa waagerecht. Ober- und Unterarm bilden ungefähr einen rechten Winkel. Die Unterarme liegen locker auf der Tischfläche.\n\nDer Bürostuhl braucht eine verstellbare Sitzhöhe, eine Rückenlehne mit Lordosenstütze und einen stabilen Fuß mit fünf Rollen. Höhenverstellbare Tische erlauben den Wechsel zwischen Sitzen und Stehen. Dieser Wechsel ist gesund.\n\nDie Tastatur muss vom Bildschirm getrennt sein. Vor der Tastatur sollte Platz zum Auflegen der Handballen sein. Die Tasten dürfen nicht spiegeln.',
        simple:
          'Sitzen soll sich anfühlen wie ein Z, das man auf die Seite legt: Füße am Boden, Knie im rechten Winkel, Arme im rechten Winkel.',
        check: {
          q: 'Welcher Winkel ist zwischen Ober- und Unterarm beim Tippen ideal?',
          options: ['Etwa 45 Grad', 'Etwa 90 Grad', 'Etwa 150 Grad', 'Ganz gestreckt'],
          correct: 1,
          explain: 'Ein rechter Winkel entlastet Schultern und Handgelenke.',
        },
      },
      {
        title: 'Software-Ergonomie und Pausen',
        keys: ['software ergonomie', 'pause', 'mischarbeit', 'barrierefrei', 'din en iso 9241', 'gebrauchstauglichkeit', 'homeoffice', 'telearbeit'],
        text:
          'Auch Software muss ergonomisch sein. Die Norm DIN EN ISO 9241 beschreibt das. Software soll zur Aufgabe passen, selbsterklärend sein, Fehler verzeihen und sich steuern lassen. Man nennt das Gebrauchstauglichkeit.\n\nWer lange am Bildschirm arbeitet, braucht Pausen oder Wechsel zu anderen Tätigkeiten. Man nennt das Mischarbeit. Kurze, häufige Pausen sind besser als eine lange Pause.\n\nFür Telearbeitsplätze zu Hause gilt die Arbeitsstättenverordnung ebenfalls, wenn der Arbeitgeber den Arbeitsplatz fest eingerichtet hat. Für mobiles Arbeiten gilt sie nur eingeschränkt.',
        simple:
          'Gute Software ist wie ein gutes Werkzeug. Man versteht sie schnell, sie hilft bei der Arbeit und ein Fehler macht nicht alles kaputt.',
        check: {
          q: 'Was beschreibt die DIN EN ISO 9241?',
          options: ['Kabelstandards', 'Ergonomie von Hard- und Software', 'Datenschutz', 'Steuersätze'],
          correct: 1,
          explain: 'Die Normenreihe beschreibt die Ergonomie der Mensch-System-Interaktion.',
        },
      },
    ],
    widget: 'ergo-check',
    widgetTitle: 'Arbeitsplatz-Check',
    terms: [
      { term: 'ArbStättV', def: 'Arbeitsstättenverordnung. Anhang 6 regelt Bildschirmarbeitsplätze.' },
      { term: 'Gefährdungsbeurteilung', def: 'Pflicht des Arbeitgebers, Gefahren am Arbeitsplatz zu ermitteln und Maßnahmen festzulegen.' },
      { term: 'Mischarbeit', def: 'Wechsel zwischen Bildschirmarbeit und anderen Tätigkeiten.' },
      { term: 'Lux', def: 'Einheit der Beleuchtungsstärke. Im Büro etwa 500 Lux.' },
      { term: 'Software-Ergonomie', def: 'Gestaltung von Software, damit sie leicht und fehlerarm bedienbar ist.' },
      { term: 'Angebotsvorsorge', def: 'Arbeitsmedizinische Vorsorge, die der Arbeitgeber anbieten muss, zum Beispiel ein Augentest.' },
    ],
    formulas: ['Sehabstand ca. 50–80 cm', 'Beleuchtung Büro ca. 500 Lux', 'Ober- und Unterarm ca. 90°'],
    merksaetze: [
      'Fenster immer seitlich zum Bildschirm.',
      'Oberste Bildschirmzeile auf oder leicht unter Augenhöhe.',
      'Wechsel zwischen Sitzen und Stehen ist gesund.',
    ],
    traps: [
      'Die Bildschirmarbeitsverordnung als aktuelle Vorschrift nennen. Sie ist in der ArbStättV aufgegangen.',
      'Den Monitor zu hoch stellen. Das belastet den Nacken.',
      'Vergessen, dass auch Software ergonomisch sein muss.',
    ],
    summary:
      'Regeln für Bildschirmarbeit stehen in der ArbStättV, Anhang 6. Der Monitor steht seitlich zum Fenster, in 50 bis 80 cm Abstand und mit der obersten Zeile etwa auf Augenhöhe. Stuhl und Tisch werden so eingestellt, dass Arme und Beine etwa im rechten Winkel sind. Pausen und Mischarbeit gehören dazu, ebenso eine gut bedienbare Software.',
  },
  {
    id: 'netzwerk',
    title: 'Netzwerkgrundlagen',
    short: 'Netzwerk',
    area: 'Netzwerk',
    examWeight: 12,
    intro:
      'Ein neuer Arbeitsplatz muss ins Firmennetz. Er braucht eine IP-Adresse, ein Gateway und einen DNS-Server. Er hängt an einem Switch, und ein Router verbindet das Netz mit dem Internet. In diesem Kapitel lernst du, wer im Netz welche Aufgabe hat.',
    sections: [
      {
        title: 'LAN, WLAN und Topologien',
        keys: ['lan', 'wlan', 'wan', 'topologie', 'stern', 'kabel', 'cat', 'lwl', 'glasfaser', 'poe', 'wifi', '802.11', 'wpa3'],
        visual: 'topo',
        text:
          'Ein LAN ist ein lokales Netz, zum Beispiel in einem Bürogebäude. Ein WAN verbindet weit entfernte Standorte, das Internet ist das größte WAN. Ein WLAN ist ein LAN über Funk.\n\nHeute baut man Netze fast immer als Stern. Alle Geräte hängen an einem zentralen Switch. Fällt ein Kabel aus, ist nur ein Gerät betroffen.\n\nKupferkabel dürfen pro Strecke höchstens 100 Meter lang sein. Cat 6A schafft 10 Gbit/s auf 100 Metern. Für größere Strecken nimmt man Lichtwellenleiter, also Glasfaser. Mit PoE, Power over Ethernet, bekommen Telefone, Kameras und Access Points Strom über das Netzwerkkabel.\n\nBeim WLAN ist Wi-Fi 6 der Standard IEEE 802.11ax. Zur Verschlüsselung nimmt man WPA3 oder mindestens WPA2. WEP gilt als unsicher.',
        simple:
          'Der Switch ist wie eine Steckdosenleiste fürs Netz. Jedes Gerät bekommt sein eigenes Kabel zur Leiste.',
        example:
          'Eine Arztpraxis bekommt zwei neue Access Points an der Decke. Dort gibt es keine Steckdose. Du wählst einen Switch mit PoE. Die Access Points bekommen Strom und Daten über ein Kabel.',
        check: {
          q: 'Wie lang darf eine Kupfer-Netzwerkstrecke nach Standard höchstens sein?',
          options: ['10 m', '50 m', '100 m', '500 m'],
          correct: 2,
          explain: 'Twisted-Pair-Ethernet ist für 100 m pro Strecke ausgelegt.',
        },
      },
      {
        title: 'Switch, Router und MAC-Adresse',
        keys: ['switch', 'router', 'hub', 'mac', 'mac adresse', 'access point', 'gateway', 'standardgateway', 'vlan', 'firewall'],
        text:
          'Jede Netzwerkkarte hat eine MAC-Adresse. Sie ist 48 Bit lang und wird hexadezimal geschrieben, zum Beispiel 00:1A:2B:3C:4D:5E. Sie ist die physische Adresse im lokalen Netz.\n\nEin Switch verbindet Geräte im selben Netz. Er merkt sich, an welchem Anschluss welche MAC-Adresse hängt. Dann schickt er Daten gezielt nur an diesen Anschluss. Ein Hub dagegen schickt alles an alle. Hubs nutzt man heute nicht mehr.\n\nEin Router verbindet verschiedene Netze. Er arbeitet mit IP-Adressen. Der Router ist für die PCs das Standardgateway. An ihn schickt ein PC alle Daten, deren Ziel nicht im eigenen Netz liegt.\n\nMit VLANs kann man einen Switch in mehrere logische Netze aufteilen. So trennt man zum Beispiel das Gäste-WLAN vom Firmennetz.',
        simple:
          'Der Switch ist der Postbote im eigenen Haus. Er kennt jedes Zimmer. Der Router ist die Poststelle, die Briefe in andere Städte schickt.',
        example:
          'Ein PC kann Kollegen erreichen, aber keine Internetseiten. Oft ist das Standardgateway falsch eingetragen. Der PC findet dann den Weg nach draußen nicht.',
        check: {
          q: 'Mit welcher Adresse arbeitet ein Switch hauptsächlich?',
          options: ['IP-Adresse', 'MAC-Adresse', 'Portnummer', 'Domainname'],
          correct: 1,
          explain: 'Ein klassischer Switch arbeitet auf Schicht 2 mit MAC-Adressen.',
        },
      },
      {
        title: 'DHCP und DNS',
        keys: ['dhcp', 'dns', 'dora', 'lease', 'namensauflösung', 'apipa', '169.254', 'reservierung', 'nslookup', 'ipconfig', 'ping'],
        text:
          'DHCP vergibt automatisch IP-Adressen. Dazu gehören auch Subnetzmaske, Gateway und DNS-Server. Der Ablauf hat vier Schritte und heißt DORA. Der Client sendet ein Discover. Der Server antwortet mit einem Offer. Der Client fragt mit einem Request an. Der Server bestätigt mit einem Acknowledge. Die Adresse gilt für eine bestimmte Zeit, die Lease-Zeit.\n\nFindet ein Windows-PC keinen DHCP-Server, gibt er sich selbst eine Adresse aus dem Bereich 169.254.x.x. Das nennt man APIPA. Siehst du so eine Adresse, ist meist der DHCP-Server nicht erreichbar.\n\nDNS übersetzt Namen in IP-Adressen. Gibst du www.beispiel.de ein, fragt der PC den DNS-Server nach der passenden IP-Adresse. Erst dann kann er die Verbindung aufbauen.\n\nNützliche Befehle sind ipconfig unter Windows, ip addr unter Linux, ping zum Testen der Erreichbarkeit und nslookup zum Testen von DNS.',
        simple:
          'DHCP ist der Empfang im Hotel, der dir eine Zimmernummer gibt. DNS ist das Telefonbuch: Du kennst den Namen und bekommst die Nummer.',
        example:
          'Ein Mitarbeiter kann 8.8.8.8 anpingen, aber keine Website per Namen öffnen. Die Verbindung ins Internet geht also. Das Problem liegt beim DNS.',
        check: {
          q: 'Ein PC hat die Adresse 169.254.12.7. Was ist die wahrscheinlichste Ursache?',
          options: ['Der DNS-Server ist falsch', 'Der PC hat keinen DHCP-Server erreicht', 'Die Adresse ist manuell vergeben', 'Der Router ist ein Switch'],
          correct: 1,
          explain: '169.254.x.x ist eine APIPA-Adresse. Windows vergibt sie, wenn kein DHCP antwortet.',
        },
      },
      {
        title: 'TCP, UDP und Ports',
        keys: ['tcp', 'udp', 'port', 'ports', 'handshake', 'verbindungsorientiert', 'http', 'https', 'smtp', 'imap', 'ssh', 'rdp', 'ftp', 'protokoll'],
        text:
          'TCP und UDP sind Transportprotokolle. TCP ist verbindungsorientiert. Vor der Übertragung gibt es einen Drei-Wege-Handschlag: SYN, SYN-ACK, ACK. TCP prüft, ob alles angekommen ist, und schickt Verlorenes neu. Darum nutzt man TCP für Webseiten, E-Mails und Dateien.\n\nUDP ist verbindungslos. Es schickt einfach los, ohne Bestätigung. Das ist schneller. Darum nutzt man UDP für Telefonie, Video-Streaming und DNS-Anfragen.\n\nPorts sagen, welcher Dienst gemeint ist. Wichtige Ports sind 80 für HTTP, 443 für HTTPS, 22 für SSH, 25 und 587 für SMTP, 143 für IMAP, 993 für IMAPS, 53 für DNS und 3389 für RDP, also den Remote Desktop.',
        simple:
          'TCP ist ein Einschreiben mit Rückschein. UDP ist eine Postkarte. Die Postkarte ist schneller, aber niemand bestätigt, dass sie ankam.',
        example:
          'Bei einem Videoanruf ist ein verlorenes Bild nicht schlimm. Eine Verzögerung wäre schlimmer. Darum nutzt man hier UDP.',
        check: {
          q: 'Welcher Port gehört zu HTTPS?',
          options: ['80', '22', '443', '3389'],
          correct: 2,
          explain: 'HTTPS nutzt standardmäßig Port 443, HTTP Port 80.',
        },
      },
    ],
    widget: 'net-builder',
    widgetTitle: 'Netzwerk zusammenstecken',
    terms: [
      { term: 'LAN', def: 'Local Area Network. Lokales Netz an einem Standort.' },
      { term: 'WAN', def: 'Wide Area Network. Verbindet weit entfernte Netze.' },
      { term: 'MAC-Adresse', def: '48-Bit-Hardwareadresse einer Netzwerkkarte.' },
      { term: 'Switch', def: 'Verbindet Geräte im selben Netz anhand der MAC-Adresse (Schicht 2).' },
      { term: 'Router', def: 'Verbindet verschiedene Netze anhand der IP-Adresse (Schicht 3).' },
      { term: 'Standardgateway', def: 'Router, an den ein Gerät alle Pakete für fremde Netze schickt.' },
      { term: 'DHCP', def: 'Vergibt automatisch IP-Konfigurationen. Ablauf: Discover, Offer, Request, Acknowledge.' },
      { term: 'DNS', def: 'Übersetzt Domainnamen in IP-Adressen.' },
      { term: 'APIPA', def: 'Selbst vergebene Adresse 169.254.x.x, wenn kein DHCP antwortet.' },
      { term: 'VLAN', def: 'Virtuelles LAN. Trennt ein physisches Netz in logische Netze.' },
      { term: 'PoE', def: 'Power over Ethernet. Strom über das Netzwerkkabel.' },
      { term: 'TCP', def: 'Verbindungsorientiertes, zuverlässiges Transportprotokoll.' },
      { term: 'UDP', def: 'Verbindungsloses, schnelles Transportprotokoll ohne Bestätigung.' },
      { term: 'Access Point', def: 'Gerät, das ein WLAN bereitstellt und mit dem LAN verbindet.' },
    ],
    formulas: ['HTTP 80 · HTTPS 443 · SSH 22 · DNS 53 · SMTP 25/587 · IMAP 143 · IMAPS 993 · RDP 3389 · DHCP 67/68'],
    merksaetze: [
      'Switch = MAC = gleiches Netz. Router = IP = andere Netze.',
      'DORA: Discover, Offer, Request, Acknowledge.',
      '169.254 heißt: DHCP nicht erreicht.',
      'Ping per IP geht, per Name nicht? Dann ist es DNS.',
    ],
    traps: [
      'Router und Switch verwechseln.',
      'Denken, DNS vergibt IP-Adressen. Das macht DHCP.',
      'WEP als sichere WLAN-Verschlüsselung nennen.',
      'Vergessen, dass DNS-Anfragen meist UDP nutzen.',
    ],
    summary:
      'Geräte hängen sternförmig an Switches, die mit MAC-Adressen arbeiten. Router verbinden Netze anhand von IP-Adressen und sind das Standardgateway. DHCP verteilt Adressen, DNS übersetzt Namen. TCP ist zuverlässig, UDP ist schnell. Ports ordnen Daten dem richtigen Dienst zu.',
  },
  {
    id: 'osi',
    title: 'OSI-Schichtenmodell',
    short: 'OSI-Modell',
    area: 'Netzwerk',
    examWeight: 5,
    intro:
      'Das OSI-Modell teilt Netzwerkkommunikation in sieben Schichten. Jede Schicht hat eine klare Aufgabe. Das hilft bei der Fehlersuche: Man prüft von unten nach oben. Ist das Kabel in Ordnung? Hat der PC eine Adresse? Läuft der Dienst?',
    sections: [
      {
        title: 'Die sieben Schichten',
        keys: ['osi', 'schicht', 'schichten', 'layer', 'anwendung', 'darstellung', 'sitzung', 'transport', 'vermittlung', 'sicherung', 'bitübertragung', 'eselsbrücke'],
        visual: 'osi',
        text:
          'Die Schichten werden von unten nach oben gezählt. Schicht 1 ist die Bitübertragungsschicht. Hier geht es um Kabel, Stecker und Signale. Schicht 2 ist die Sicherungsschicht. Hier arbeiten MAC-Adressen und Switches. Schicht 3 ist die Vermittlungsschicht. Hier arbeiten IP-Adressen und Router.\n\nSchicht 4 ist die Transportschicht mit TCP und UDP. Schicht 5 ist die Sitzungsschicht. Sie steuert den Dialog zwischen zwei Programmen. Schicht 6 ist die Darstellungsschicht. Sie kümmert sich um Formate, Zeichensätze und Verschlüsselung. Schicht 7 ist die Anwendungsschicht mit Protokollen wie HTTP, SMTP und DNS.\n\nEine Eselsbrücke von unten nach oben auf Englisch lautet: Please Do Not Throw Sausage Pizza Away. Physical, Data Link, Network, Transport, Session, Presentation, Application.',
        simple:
          'Denk an einen Brief. Oben schreibst du den Text. Weiter unten kommt der Umschlag mit Adresse. Ganz unten fährt der Postwagen. Jede Stufe macht nur ihren Teil.',
        check: {
          q: 'Auf welcher OSI-Schicht arbeitet ein Router?',
          options: ['Schicht 1', 'Schicht 2', 'Schicht 3', 'Schicht 7'],
          correct: 2,
          explain: 'Router arbeiten mit IP-Adressen auf der Vermittlungsschicht, Schicht 3.',
        },
      },
      {
        title: 'Geräte, Protokolle und Dateneinheiten',
        keys: ['pdu', 'frame', 'paket', 'segment', 'kapselung', 'tcp ip modell', 'repeater', 'bridge'],
        text:
          'Jede Schicht hat eine eigene Dateneinheit. Auf Schicht 1 sind es Bits. Auf Schicht 2 heißen sie Frames oder Rahmen. Auf Schicht 3 heißen sie Pakete. Auf Schicht 4 heißen sie Segmente bei TCP und Datagramme bei UDP.\n\nBeim Senden geht es von oben nach unten. Jede Schicht packt eigene Steuerdaten dazu. Das nennt man Kapselung. Beim Empfänger geht es von unten nach oben, und jede Schicht packt wieder aus.\n\nRepeater und Hubs arbeiten auf Schicht 1. Switches und Bridges auf Schicht 2. Router auf Schicht 3. Das TCP/IP-Modell fasst die Schichten zu vier zusammen: Netzzugang, Internet, Transport und Anwendung.',
        simple:
          'Kapselung ist wie russische Puppen. Jede Schicht steckt die Daten in eine weitere Hülle.',
        check: {
          q: 'Wie heißt die Dateneinheit auf Schicht 2?',
          options: ['Segment', 'Paket', 'Frame', 'Bit'],
          correct: 2,
          explain: 'Auf der Sicherungsschicht spricht man von Frames oder Rahmen.',
        },
      },
      {
        title: 'Fehlersuche mit dem OSI-Modell',
        keys: ['fehlersuche', 'troubleshooting', 'bottom up', 'link', 'led'],
        text:
          'Bei Netzwerkproblemen geht man oft von unten nach oben vor. Zuerst Schicht 1: Steckt das Kabel? Leuchtet die Link-LED am Switch? Dann Schicht 2 und 3: Hat der PC eine gültige IP-Adresse? Kann er das Gateway anpingen? Dann Schicht 4 bis 7: Ist der Port offen? Läuft der Dienst? Stimmt der DNS-Eintrag?\n\nSo findest du den Fehler systematisch und rätst nicht herum.',
        simple: 'Erst schauen, ob der Stecker drin ist. Dann die Adresse prüfen. Erst ganz zum Schluss das Programm.',
        example:
          'Ein Drucker ist nicht erreichbar. Die Link-LED am Switch ist aus. Der Fehler liegt auf Schicht 1, zum Beispiel ein defektes Patchkabel.',
        check: {
          q: 'Die Link-LED am Switch-Port leuchtet nicht. Welche Schicht prüfst du?',
          options: ['Schicht 1', 'Schicht 4', 'Schicht 6', 'Schicht 7'],
          correct: 0,
          explain: 'Keine Verbindung am Kabel ist ein Problem der Bitübertragung.',
        },
      },
    ],
    widget: 'osi-explorer',
    widgetTitle: 'OSI-Schichten entdecken und sortieren',
    terms: [
      { term: 'Bitübertragungsschicht', def: 'Schicht 1. Kabel, Stecker, Signale. Geräte: Hub, Repeater.' },
      { term: 'Sicherungsschicht', def: 'Schicht 2. MAC-Adressen, Frames, Fehlererkennung. Gerät: Switch.' },
      { term: 'Vermittlungsschicht', def: 'Schicht 3. IP-Adressen, Pakete, Routing. Gerät: Router.' },
      { term: 'Transportschicht', def: 'Schicht 4. TCP und UDP, Ports, Segmente.' },
      { term: 'Sitzungsschicht', def: 'Schicht 5. Auf- und Abbau von Sitzungen.' },
      { term: 'Darstellungsschicht', def: 'Schicht 6. Formate, Zeichensätze, Verschlüsselung.' },
      { term: 'Anwendungsschicht', def: 'Schicht 7. Protokolle wie HTTP, SMTP, DNS, FTP.' },
      { term: 'Kapselung', def: 'Jede Schicht fügt beim Senden eigene Steuerinformationen hinzu.' },
    ],
    formulas: ['1 Bits · 2 Frames · 3 Pakete · 4 Segmente/Datagramme · 5–7 Daten'],
    merksaetze: ['Please Do Not Throw Sausage Pizza Away (1 bis 7).', 'Switch 2, Router 3, TCP/UDP 4, HTTP 7.'],
    traps: [
      'Die Zählrichtung umdrehen. Schicht 1 ist ganz unten.',
      'Den Switch auf Schicht 3 einordnen. Ein normaler Switch arbeitet auf Schicht 2.',
      'HTTPS-Verschlüsselung allein der Schicht 7 zuordnen. Im OSI-Modell gehört Verschlüsselung zur Schicht 6.',
    ],
    summary:
      'Das OSI-Modell hat sieben Schichten von der Bitübertragung bis zur Anwendung. Switches arbeiten auf Schicht 2, Router auf Schicht 3, TCP und UDP auf Schicht 4. Beim Senden werden Daten gekapselt. Bei der Fehlersuche geht man von unten nach oben vor.',
  },
  {
    id: 'subnetting',
    title: 'IP-Adressen & Subnetting',
    short: 'Subnetting',
    area: 'Netzwerk',
    examWeight: 12,
    intro:
      'Subnetting ist in der AP1 sehr wichtig. Du musst Netzadressen, Broadcast-Adressen und die Zahl der Hosts berechnen. Das klingt schwer. Es ist aber nur ein fester Rechenweg. Wir fangen ganz vorne an: Was ist überhaupt eine IP-Adresse?',
    sections: [
      {
        title: 'Was ist eine IP-Adresse?',
        keys: ['ip adresse', 'ipv4', 'oktett', 'binär', 'dezimal', 'adresse', '32 bit'],
        visual: 'ip-binary',
        text:
          'Eine IP-Adresse ist die Adresse eines Geräts im Netzwerk. Eine IPv4-Adresse besteht aus 32 Bit. Man schreibt sie als vier Zahlen mit Punkten, zum Beispiel 192.168.10.25. Jede der vier Zahlen nennt man Oktett. Ein Oktett hat 8 Bit. Darum geht jede Zahl nur von 0 bis 255.\n\nDer Computer sieht die Adresse binär, also als Nullen und Einsen. 192 ist zum Beispiel 11000000. Die Stellenwerte eines Oktetts sind von links nach rechts 128, 64, 32, 16, 8, 4, 2 und 1. 192 ist 128 plus 64.\n\nEine IP-Adresse hat zwei Teile. Der vordere Teil ist der Netzanteil. Er sagt, in welchem Netz das Gerät ist. Der hintere Teil ist der Hostanteil. Er sagt, welches Gerät es in diesem Netz ist.',
        simple:
          'Eine IP-Adresse ist wie eine Postadresse. Der Netzanteil ist die Straße. Der Hostanteil ist die Hausnummer. Alle Häuser in derselben Straße sind im selben Netz.',
        check: {
          q: 'Wie viele Bit hat eine IPv4-Adresse?',
          options: ['16', '32', '64', '128'],
          correct: 1,
          explain: 'IPv4 hat 32 Bit, also vier Oktette mit je 8 Bit.',
        },
      },
      {
        title: 'Subnetzmaske und CIDR',
        keys: ['subnetzmaske', 'maske', 'cidr', '/24', '/28', 'präfix', 'netzmaske', '255.255.255.0'],
        text:
          'Die Subnetzmaske zeigt, wo der Netzanteil aufhört. Sie besteht ebenfalls aus 32 Bit. Vorne stehen Einsen, hinten Nullen. Die Einsen markieren den Netzanteil, die Nullen den Hostanteil.\n\n255.255.255.0 bedeutet: Die ersten 24 Bit sind Einsen. Man kann das kürzer schreiben, nämlich /24. Diese Schreibweise heißt CIDR. /24 heißt also: 24 Bit Netzanteil und 8 Bit Hostanteil.\n\n/28 heißt: 28 Bit Netzanteil und 4 Bit Hostanteil. Die Maske lautet 255.255.255.240. Denn im letzten Oktett sind die ersten vier Bit Einsen: 128 + 64 + 32 + 16 = 240.\n\nDie möglichen Werte in einem Masken-Oktett sind nur 0, 128, 192, 224, 240, 248, 252, 254 und 255.',
        simple:
          'Die Maske ist eine Schablone. Wo sie zu ist, steht das Netz. Wo sie offen ist, stehen die Geräte. /24 heißt: 24 Löcher zu, 8 offen.',
        example:
          'Ein Netz 192.168.1.0/24 nutzt die Maske 255.255.255.0. Alle Geräte von 192.168.1.1 bis 192.168.1.254 sind im selben Netz.',
        check: {
          q: 'Welche Subnetzmaske gehört zu /26?',
          options: ['255.255.255.0', '255.255.255.192', '255.255.255.224', '255.255.255.128'],
          correct: 1,
          explain: '26 Bit: drei volle Oktette (24) plus 2 Bit im letzten. 128 + 64 = 192.',
        },
      },
      {
        title: 'Netzadresse, Broadcast und Hosts',
        keys: ['netzadresse', 'netzwerkadresse', 'broadcast', 'host', 'hosts', 'hostanzahl', 'blockgröße', 'erste adresse', 'letzte adresse'],
        text:
          'In jedem Netz gibt es zwei besondere Adressen. Die erste Adresse ist die Netzadresse. Bei ihr sind alle Hostbits 0. Sie bezeichnet das Netz selbst. Die letzte Adresse ist die Broadcast-Adresse. Bei ihr sind alle Hostbits 1. Wer an diese Adresse sendet, erreicht alle Geräte im Netz.\n\nBeide Adressen darf kein Gerät bekommen. Darum gilt: Anzahl der Hosts = 2 hoch Hostbits minus 2. Bei /24 sind das 2 hoch 8 minus 2 = 254. Bei /28 sind es 2 hoch 4 minus 2 = 14.\n\nEin schneller Trick ist die Blockgröße. Sie ist 256 minus der Wert der Maske im interessanten Oktett. Bei /28 ist das 256 − 240 = 16. Die Netze beginnen dann bei 0, 16, 32, 48 und so weiter.',
        simple:
          'Die erste Hausnummer gehört der Straße selbst, die letzte ist der Lautsprecher für alle. Beide bekommt kein Haus. Darum immer minus 2.',
        example:
          'Gegeben ist 192.168.5.77/28. Die Blockgröße ist 16. Die Netze beginnen bei 64 und 80. 77 liegt dazwischen. Netzadresse 192.168.5.64, Broadcast 192.168.5.79, Hosts von .65 bis .78.',
        check: {
          q: 'Wie viele nutzbare Hosts hat ein /27-Netz?',
          options: ['32', '30', '62', '14'],
          correct: 1,
          explain: '32 − 27 = 5 Hostbits. 2 hoch 5 = 32. Minus 2 ergibt 30.',
        },
      },
      {
        title: 'Warum Subnetze? Und wie teilt man auf?',
        keys: ['warum subnetz', 'aufteilen', 'subnetze bilden', 'abteilung', 'sicherheit', 'broadcast domäne'],
        text:
          'Große Netze haben viel Broadcast-Verkehr. Außerdem kann jedes Gerät jedes andere direkt erreichen. Das ist unsicher. Darum teilt man Netze in Subnetze auf, zum Beispiel eines für die Verwaltung, eines für die Produktion und eines für Gäste. Zwischen den Subnetzen steht ein Router oder eine Firewall. So kann man den Verkehr kontrollieren.\n\nWillst du ein Netz in mehrere gleich große Subnetze teilen, leihst du dir Bits vom Hostanteil. Ein geliehenes Bit ergibt 2 Subnetze. Zwei Bit ergeben 4 Subnetze. Drei Bit ergeben 8. Aus einem /24 werden mit 2 geliehenen Bit vier /26-Netze mit je 62 Hosts.\n\nBrauchst du eine bestimmte Zahl an Hosts, suchst du die kleinste Zweierpotenz, die groß genug ist. Für 50 Hosts brauchst du 6 Hostbits, denn 2 hoch 6 minus 2 = 62. Das ist ein /26.',
        simple:
          'Ein großes Großraumbüro wird in Abteilungen mit Türen geteilt. Jede Abteilung hat ihren eigenen Raum. Durch die Tür kommt nur, wer darf.',
        check: {
          q: 'Wie viele /26-Subnetze passen in ein /24-Netz?',
          options: ['2', '4', '8', '16'],
          correct: 1,
          explain: '26 − 24 = 2 geliehene Bit. 2 hoch 2 = 4 Subnetze.',
        },
      },
      {
        title: 'Private Adressen, Netzklassen und IPv6',
        keys: ['privat', 'private adressen', 'klasse', 'netzklasse', 'nat', 'ipv6', 'link local', 'fe80', 'loopback', '127.0.0.1', 'hexadezimal', '128 bit', 'kürzen'],
        text:
          'Im Firmennetz nutzt man private Adressen. Sie werden im Internet nicht weitergeleitet. Es gibt drei Bereiche: 10.0.0.0/8, 172.16.0.0/12 und 192.168.0.0/16. Der Router übersetzt private Adressen beim Weg ins Internet in seine öffentliche Adresse. Das nennt man NAT. Die Adresse 127.0.0.1 ist der Loopback, also der eigene Rechner.\n\nFrüher gab es feste Netzklassen. Klasse A ging von 1 bis 126 mit /8. Klasse B von 128 bis 191 mit /16. Klasse C von 192 bis 223 mit /24. Heute nutzt man CIDR, aber die Klassen werden noch abgefragt.\n\nIPv6 hat 128 Bit. Man schreibt sie als acht Blöcke mit je vier Hexadezimalzeichen, zum Beispiel 2001:0db8:0000:0000:0000:0000:0000:0001. Man darf führende Nullen in einem Block weglassen. Und man darf einmal eine Folge von Null-Blöcken durch zwei Doppelpunkte ersetzen. So wird daraus 2001:db8::1. Adressen mit fe80 am Anfang sind Link-Local-Adressen. Der Loopback in IPv6 ist ::1.',
        simple:
          'Private Adressen sind wie Hausnummern im Firmengelände. Draußen kennt sie niemand. Der Router ist der Pförtner, der nach draußen mit der Firmenadresse spricht.',
        check: {
          q: 'Welche Adresse ist eine private IPv4-Adresse?',
          options: ['172.15.3.1', '172.20.3.1', '193.168.1.1', '11.0.0.1'],
          correct: 1,
          explain: 'Der private Bereich 172.16.0.0/12 reicht von 172.16.0.0 bis 172.31.255.255.',
        },
      },
    ],
    steps: {
      title: 'Subnetting in 6 Schritten (Beispiel 172.16.45.200/21)',
      steps: [
        'Hostbits bestimmen: 32 − 21 = 11 Hostbits.',
        'Interessantes Oktett finden: /21 liegt im 3. Oktett (Bit 17 bis 24).',
        'Maske im 3. Oktett: 21 − 16 = 5 Bit gesetzt → 128+64+32+16+8 = 248. Maske 255.255.248.0.',
        'Blockgröße: 256 − 248 = 8. Netze im 3. Oktett beginnen bei 0, 8, 16, 24, 32, 40, 48 …',
        '45 liegt im Block 40 bis 47. Netzadresse 172.16.40.0, Broadcast 172.16.47.255.',
        'Hosts: 2 hoch 11 − 2 = 2.046. Erste Adresse 172.16.40.1, letzte 172.16.47.254.',
      ],
    },
    widget: 'subnet-trainer',
    widgetTitle: 'Subnetz-Rechner und Übungen',
    terms: [
      { term: 'Oktett', def: 'Ein Block von 8 Bit. Eine IPv4-Adresse hat vier Oktette.' },
      { term: 'Subnetzmaske', def: 'Trennt Netz- und Hostanteil. Einsen = Netz, Nullen = Host.' },
      { term: 'CIDR', def: 'Schreibweise /n für die Anzahl der Netzbits, zum Beispiel /24.' },
      { term: 'Netzadresse', def: 'Erste Adresse eines Netzes. Alle Hostbits 0. Nicht vergebbar.' },
      { term: 'Broadcast-Adresse', def: 'Letzte Adresse eines Netzes. Alle Hostbits 1. Erreicht alle Hosts.' },
      { term: 'Blockgröße', def: '256 minus Maskenwert im interessanten Oktett. Abstand zwischen Subnetzen.' },
      { term: 'NAT', def: 'Network Address Translation. Übersetzt private in öffentliche Adressen.' },
      { term: 'Loopback', def: 'Adresse des eigenen Geräts: 127.0.0.1 bzw. ::1.' },
      { term: 'Link-Local (IPv6)', def: 'Adresse mit fe80::/10. Gilt nur im lokalen Netzsegment.' },
    ],
    formulas: [
      'Hosts = 2^(32 − Präfix) − 2',
      'Subnetze = 2^(geliehene Bits)',
      'Blockgröße = 256 − Maskenwert im interessanten Oktett',
      'Netzadresse: Hostbits = 0 · Broadcast: Hostbits = 1',
      'Privat: 10.0.0.0/8 · 172.16.0.0/12 · 192.168.0.0/16',
    ],
    merksaetze: [
      'Masken-Oktette: 0, 128, 192, 224, 240, 248, 252, 254, 255.',
      'Immer minus 2 bei den Hosts: Netzadresse und Broadcast.',
      'IPv6: führende Nullen weg, :: nur einmal.',
    ],
    traps: [
      'Bei der Hostanzahl das minus 2 vergessen.',
      'Netzadresse oder Broadcast als Geräteadresse vergeben.',
      '172.32.x.x für privat halten. Der Bereich endet bei 172.31.',
      'In IPv6 den Doppel-Doppelpunkt zweimal verwenden.',
      'Bei /22 oder /21 im falschen Oktett rechnen.',
    ],
    summary:
      'Eine IPv4-Adresse hat 32 Bit und besteht aus Netz- und Hostanteil. Die Subnetzmaske oder das CIDR-Präfix zeigt die Grenze. Die erste Adresse ist die Netzadresse, die letzte die Broadcast-Adresse. Hosts berechnest du mit 2 hoch Hostbits minus 2. Die Blockgröße hilft, Netzgrenzen schnell zu finden. IPv6 hat 128 Bit und eigene Kürzungsregeln.',
  },
];

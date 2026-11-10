import type { Topic } from './topicTypes';

export const topicsB: Topic[] = [
  {
    id: 'software',
    title: 'Betriebssysteme & Software',
    short: 'Software',
    area: 'Software & Sicherheit',
    examWeight: 9,
    intro:
      'Ein neuer PC ist ohne Software nutzlos. Du wählst ein Betriebssystem, installierst Treiber und Programme und achtest auf die richtigen Lizenzen. Danach hältst du alles mit Updates aktuell. Auch Virtualisierung und Cloud gehören in dieses Kapitel.',
    sections: [
      {
        title: 'Betriebssysteme: Windows und Linux',
        keys: ['betriebssystem', 'windows', 'linux', 'macos', 'kernel', 'treiber', 'dateisystem', 'ntfs', 'fat32', 'exfat', 'ext4', 'gpt', 'mbr', 'tpm', 'secure boot', 'windows 11'],
        visual: 'os-layers',
        text:
          'Das Betriebssystem verwaltet die Hardware und stellt sie den Programmen zur Verfügung. Es verwaltet Speicher, Prozesse, Dateien und Benutzer. Der Kern des Systems heißt Kernel. Treiber sind kleine Programme, mit denen das Betriebssystem ein bestimmtes Gerät ansteuert.\n\nWindows ist im Büro am weitesten verbreitet. Windows 11 braucht unter anderem einen 64-Bit-Prozessor aus der Kompatibilitätsliste, 4 GB RAM, 64 GB Speicher, UEFI mit Secure Boot und einen TPM-2.0-Chip. Der Support für Windows 10 endete am 14. Oktober 2025.\n\nLinux ist ein freies Betriebssystem. Es gibt viele Distributionen, zum Beispiel Ubuntu oder Debian. Linux läuft besonders oft auf Servern.\n\nWichtige Dateisysteme sind NTFS für Windows, ext4 für Linux sowie FAT32 und exFAT für USB-Sticks. FAT32 kann keine Dateien über 4 GB speichern. Festplatten werden heute mit GPT partitioniert. Das ältere MBR ist auf etwa 2 TB begrenzt.',
        simple:
          'Das Betriebssystem ist der Hausmeister des Computers. Es verteilt Strom, Räume und Schlüssel an die Programme. Treiber sind die Bedienungsanleitungen für jedes Gerät.',
        example:
          'Ein Kunde will eine 6-GB-Videodatei auf einen USB-Stick kopieren. Es kommt eine Fehlermeldung. Der Stick ist mit FAT32 formatiert. Du formatierst ihn mit exFAT.',
        check: {
          q: 'Welches Dateisystem kann keine Einzeldatei über 4 GB speichern?',
          options: ['NTFS', 'exFAT', 'FAT32', 'ext4'],
          correct: 2,
          explain: 'FAT32 hat eine maximale Dateigröße von 4 GB minus 1 Byte.',
        },
      },
      {
        title: 'Softwareinstallation und Lizenzmodelle',
        keys: ['lizenz', 'lizenzen', 'oem', 'volumen', 'abo', 'subscription', 'open source', 'gpl', 'freeware', 'shareware', 'eula', 'floating', 'named user', 'cal', 'installation', 'rollout'],
        text:
          'Software darf man nur mit gültiger Lizenz nutzen. Die Lizenz regelt, wie und wie oft man sie einsetzen darf. Die Bedingungen stehen im Lizenzvertrag, oft EULA genannt.\n\nEine OEM-Lizenz wird mit einem neuen Gerät verkauft und ist meist an dieses Gerät gebunden. Eine Retail- oder Box-Lizenz kauft man einzeln im Handel. Volumenlizenzen sind für Firmen mit vielen Arbeitsplätzen. Bei Abo-Modellen zahlt man monatlich oder jährlich, zum Beispiel bei Microsoft 365. Endet das Abo, darf man die Software nicht mehr voll nutzen.\n\nEine Einzelplatzlizenz gilt für ein Gerät. Eine Named-User-Lizenz gilt für eine bestimmte Person. Eine Floating-Lizenz oder Concurrent-Use-Lizenz erlaubt eine bestimmte Zahl gleichzeitiger Nutzer. Server-Zugriffe brauchen oft Client-Zugriffslizenzen, kurz CAL.\n\nFreeware ist kostenlos, aber nicht unbedingt frei veränderbar. Shareware darf man testen und muss danach zahlen. Open-Source-Software hat offenen Quellcode. Die GPL verlangt, dass veränderte Versionen wieder unter der GPL stehen. Das nennt man Copyleft.\n\nIn Firmen installiert man Software zentral und automatisch. Das nennt man Softwareverteilung oder Rollout.',
        simple:
          'Eine Lizenz ist eine Eintrittskarte. Manche gelten für einen Sitzplatz, manche für eine Person, manche nur so lange, wie du jeden Monat zahlst.',
        example:
          'In einem Callcenter arbeiten 60 Leute in drei Schichten. Gleichzeitig nutzen höchstens 20 Personen die Software. Eine Floating-Lizenz für 20 gleichzeitige Nutzer ist hier günstiger als 60 Named-User-Lizenzen.',
        check: {
          q: 'Wie heißt das Prinzip, dass veränderte GPL-Software wieder unter der GPL stehen muss?',
          options: ['Copyright', 'Copyleft', 'Public Domain', 'Shareware'],
          correct: 1,
          explain: 'Copyleft sorgt dafür, dass die Freiheit der Software erhalten bleibt.',
        },
      },
      {
        title: 'Updates und Patchmanagement',
        keys: ['update', 'updates', 'patch', 'patchmanagement', 'patchday', 'sicherheitslücke', 'zero day', 'wsus', 'testsystem', 'end of life'],
        text:
          'Updates schließen Sicherheitslücken und beheben Fehler. Ein Patch ist eine Korrektur für ein bestimmtes Problem. Patchmanagement heißt, Updates geplant und kontrolliert einzuspielen.\n\nDer Ablauf sieht so aus: Zuerst informiert man sich über neue Updates. Dann bewertet man, wie dringend sie sind. Danach testet man sie auf einem Testsystem. Erst dann verteilt man sie auf alle Geräte. Zum Schluss prüft und dokumentiert man das Ergebnis.\n\nMicrosoft veröffentlicht Sicherheitsupdates regelmäßig am zweiten Dienstag im Monat. Das nennt man Patchday. Software ohne Herstellersupport bekommt keine Sicherheitsupdates mehr. Sie ist ein großes Risiko.',
        simple: 'Updates sind wie Reparaturen an einem Schloss. Wer sie nicht macht, lässt ein bekanntes Loch in der Tür offen.',
        check: {
          q: 'Was macht man im Patchmanagement vor der Verteilung an alle Geräte?',
          options: ['Den Patch sofort löschen', 'Den Patch auf einem Testsystem prüfen', 'Die Firewall abschalten', 'Alle Benutzer abmelden'],
          correct: 1,
          explain: 'Ein Test verhindert, dass ein fehlerhaftes Update alle Arbeitsplätze lahmlegt.',
        },
      },
      {
        title: 'Virtualisierung und Cloud',
        keys: ['virtualisierung', 'hypervisor', 'vm', 'virtuelle maschine', 'typ 1', 'typ 2', 'snapshot', 'container', 'cloud', 'iaas', 'paas', 'saas', 'public cloud', 'private cloud', 'hybrid'],
        text:
          'Bei der Virtualisierung laufen mehrere virtuelle Computer auf einer echten Hardware. Diese virtuellen Computer heißen virtuelle Maschinen, kurz VM. Die Software, die das steuert, heißt Hypervisor.\n\nEin Typ-1-Hypervisor läuft direkt auf der Hardware. Beispiele sind VMware ESXi, Microsoft Hyper-V und Proxmox. Ein Typ-2-Hypervisor läuft als Programm auf einem normalen Betriebssystem, zum Beispiel VirtualBox. Typ 1 ist schneller und für Server gedacht.\n\nVorteile sind bessere Auslastung der Hardware, weniger Strom, schnelle Bereitstellung und einfache Tests. Ein Snapshot speichert den Zustand einer VM zu einem Zeitpunkt. Ein Snapshot ist aber kein Backup, weil er meist auf demselben System liegt.\n\nIn der Cloud mietet man IT-Leistung. Bei IaaS mietet man Infrastruktur wie Server und Speicher. Bei PaaS mietet man eine Plattform, um eigene Programme zu betreiben. Bei SaaS nutzt man fertige Software über den Browser, zum Beispiel ein Online-Office.',
        simple:
          'Virtualisierung ist wie ein Haus mit mehreren Wohnungen. Jede Wohnung ist abgeschlossen, aber alle teilen sich dasselbe Fundament.',
        example:
          'Eine Firma hat fünf alte Server mit jeweils 10 % Auslastung. Sie ersetzt sie durch einen starken Host mit fünf VMs. Strom, Platz und Wartung sinken.',
        check: {
          q: 'Welcher Hypervisor-Typ läuft direkt auf der Hardware?',
          options: ['Typ 1', 'Typ 2', 'Typ 3', 'Container'],
          correct: 0,
          explain: 'Typ 1 heißt auch Bare-Metal-Hypervisor.',
        },
      },
      {
        title: 'Programmlogik und Struktogramme',
        keys: ['struktogramm', 'nassi', 'shneiderman', 'schleife', 'solange', 'verzweigung', 'algorithmus', 'pseudocode', 'variable', 'array', 'feld', 'laufvariable', 'programmlogik'],
        text:
          'In der AP1 kommt oft eine kleine Aufgabe zur Programmlogik. Du musst nicht programmieren können. Du musst aber einen Ablauf lesen und ordnen können.\n\nEin Struktogramm zeigt einen Ablauf als Kästchen, die von oben nach unten abgearbeitet werden. Eine Anweisung ist ein einfaches Kästchen, zum Beispiel „zaehler = 0“. Eine Schleife wiederholt die Kästchen, die eingerückt in ihr stehen, solange eine Bedingung gilt. Eine Verzweigung teilt den Ablauf in einen Ja-Zweig und einen Nein-Zweig.\n\nEine Variable ist ein benannter Speicherplatz für einen Wert. Ein Feld, auf Englisch Array, speichert mehrere Werte unter einem Namen. Das erste Element hat meist die Nummer 0. Eine Laufvariable zählt mit, bei welchem Element die Schleife gerade ist.\n\nFür eine Zählschleife über ein Feld gilt immer dasselbe Muster. Zuerst wird die Laufvariable auf 0 gesetzt. Dann kommt die Schleife mit der Bedingung „solange Laufvariable kleiner als Anzahl der Elemente“. In der Schleife wird das aktuelle Element bearbeitet. Als letzte Anweisung in der Schleife wird die Laufvariable um 1 erhöht. Bei zwei verschachtelten Schleifen wird die innere Laufvariable vor der inneren Schleife jedes Mal neu auf 0 gesetzt.',
        simple:
          'Eine Schleife ist wie das Austeilen von Post in einem Haus. Du fängst bei Briefkasten 0 an, wirfst ein, gehst einen weiter, und hörst auf, wenn kein Briefkasten mehr da ist.',
        example:
          'Alle PCs einer Liste sollen ein Update bekommen. i = 0. Solange i kleiner als die Anzahl der PCs ist: Update auf PC Nummer i installieren, dann i um 1 erhöhen.',
        check: {
          q: 'Was passiert, wenn in einer Zählschleife das Erhöhen der Laufvariable fehlt?',
          options: ['Die Schleife wird übersprungen', 'Die Schleife endet nie (Endlosschleife)', 'Das Feld wird gelöscht', 'Nichts, das ist egal'],
          correct: 1,
          explain: 'Die Bedingung bleibt immer wahr, weil sich die Laufvariable nie ändert.',
        },
      },
    ],
    widget: 'license-sort',
    widgetTitle: 'Welche Lizenz passt?',
    terms: [
      { term: 'Kernel', def: 'Kern des Betriebssystems. Verwaltet Prozesse, Speicher und Hardware.' },
      { term: 'Treiber', def: 'Software, mit der das Betriebssystem ein Gerät ansteuert.' },
      { term: 'TPM 2.0', def: 'Sicherheitschip für Schlüssel. Voraussetzung für Windows 11 und BitLocker.' },
      { term: 'GPT', def: 'Moderne Partitionstabelle, nötig für große Platten und UEFI-Start.' },
      { term: 'OEM-Lizenz', def: 'Mit dem Gerät verkaufte, meist gerätegebundene Lizenz.' },
      { term: 'Volumenlizenz', def: 'Lizenzvertrag für viele Installationen in einer Organisation.' },
      { term: 'Floating-Lizenz', def: 'Erlaubt eine Anzahl gleichzeitiger Nutzer, egal an welchem Gerät.' },
      { term: 'CAL', def: 'Client Access License. Erlaubt den Zugriff auf einen Server.' },
      { term: 'Copyleft', def: 'Veränderte Open-Source-Software muss unter derselben Lizenz bleiben.' },
      { term: 'Patchmanagement', def: 'Geplantes Einspielen, Testen und Dokumentieren von Updates.' },
      { term: 'Hypervisor', def: 'Software, die virtuelle Maschinen erzeugt und verwaltet.' },
      { term: 'SaaS', def: 'Software as a Service. Fertige Software über das Internet.' },
      { term: 'IaaS', def: 'Infrastructure as a Service. Gemietete Server, Speicher, Netz.' },
      { term: 'PaaS', def: 'Platform as a Service. Gemietete Laufzeitumgebung für eigene Anwendungen.' },
    ],
    formulas: ['Lizenzkosten gesamt = Anzahl × Preis (+ jährliche Abokosten × Jahre)'],
    merksaetze: [
      'FAT32: maximal 4 GB pro Datei.',
      'Patch: informieren, bewerten, testen, verteilen, dokumentieren.',
      'Snapshot ist kein Backup.',
      'IaaS Infrastruktur, PaaS Plattform, SaaS Software.',
    ],
    traps: [
      'Freeware mit Open Source gleichsetzen.',
      'Eine OEM-Lizenz auf ein anderes Gerät übertragen wollen.',
      'Den Typ-2-Hypervisor für Produktivserver empfehlen.',
      'Vergessen, dass bei Abos laufende Kosten über die ganze Nutzungsdauer anfallen.',
    ],
    summary:
      'Das Betriebssystem verwaltet Hardware und Programme, Treiber steuern Geräte an. Lizenzen regeln, wer Software wie nutzen darf: OEM, Volumen, Abo, Named User oder Floating. Updates werden im Patchmanagement getestet und dokumentiert. Virtualisierung spart Hardware, und in der Cloud mietet man Infrastruktur, Plattform oder Software.',
  },
  {
    id: 'sicherheit',
    title: 'IT-Sicherheit',
    short: 'IT-Sicherheit',
    area: 'Software & Sicherheit',
    examWeight: 12,
    intro:
      'IT-Sicherheit schützt Daten und Systeme. In der AP1 musst du Risiken erkennen und passende Maßnahmen vorschlagen. Die Grundlage sind die drei Schutzziele. Daraus folgen Firewall, Virenschutz, Backups, Rechte und sichere Passwörter.',
    sections: [
      {
        title: 'Die Schutzziele',
        keys: ['schutzziel', 'schutzziele', 'vertraulichkeit', 'integrität', 'verfügbarkeit', 'authentizität', 'cia', 'bsi', 'grundschutz', 'schutzbedarf'],
        visual: 'cia',
        text:
          'Die drei klassischen Schutzziele sind Vertraulichkeit, Integrität und Verfügbarkeit. Vertraulichkeit heißt: Nur Berechtigte dürfen die Daten sehen. Integrität heißt: Die Daten sind vollständig und unverändert. Verfügbarkeit heißt: Daten und Systeme sind nutzbar, wenn man sie braucht. Oft kommt Authentizität dazu. Sie bedeutet, dass ein Absender oder eine Quelle echt ist.\n\nDas BSI, das Bundesamt für Sicherheit in der Informationstechnik, beschreibt im IT-Grundschutz, wie man Sicherheit systematisch plant. Dazu gehört die Schutzbedarfsfeststellung. Man fragt: Wie schlimm wäre es, wenn diese Daten verloren gingen, gestohlen oder verändert würden?',
        simple:
          'Vertraulich: niemand Fremdes liest mit. Integer: niemand hat heimlich etwas geändert. Verfügbar: es funktioniert, wenn du es brauchst.',
        example:
          'Ein Serverausfall im Onlineshop verletzt die Verfügbarkeit. Ein Hacker, der Preise ändert, verletzt die Integrität. Ein gestohlener Kundendatensatz verletzt die Vertraulichkeit.',
        check: {
          q: 'Ein Angreifer verändert unbemerkt Überweisungsdaten. Welches Schutzziel ist verletzt?',
          options: ['Verfügbarkeit', 'Integrität', 'Vertraulichkeit', 'Keines'],
          correct: 1,
          explain: 'Unbemerkte Veränderung von Daten verletzt die Integrität.',
        },
      },
      {
        title: 'Firewall, Virenschutz und Verschlüsselung',
        keys: ['firewall', 'paketfilter', 'virenschutz', 'antivirus', 'malware', 'trojaner', 'ransomware', 'wurm', 'verschlüsselung', 'symmetrisch', 'asymmetrisch', 'aes', 'rsa', 'vpn', 'tls', 'hash', 'bitlocker', 'signatur'],
        text:
          'Eine Firewall kontrolliert den Netzwerkverkehr nach Regeln. Ein Paketfilter prüft Absender, Ziel und Port. Eine Next-Generation-Firewall prüft zusätzlich Inhalte und Anwendungen. Eine Personal Firewall läuft direkt auf dem PC.\n\nMalware ist Schadsoftware. Ein Virus hängt sich an Dateien. Ein Wurm verbreitet sich selbst über das Netz. Ein Trojaner tarnt sich als nützliches Programm. Ransomware verschlüsselt Daten und verlangt Lösegeld. Virenschutz erkennt Malware an Signaturen und an verdächtigem Verhalten.\n\nBei symmetrischer Verschlüsselung nutzen beide Seiten denselben Schlüssel, zum Beispiel AES. Sie ist schnell. Das Problem ist der sichere Austausch des Schlüssels. Bei asymmetrischer Verschlüsselung gibt es einen öffentlichen und einen privaten Schlüssel, zum Beispiel RSA. Man verschlüsselt mit dem öffentlichen Schlüssel des Empfängers. Nur sein privater Schlüssel kann entschlüsseln. In der Praxis kombiniert man beides. Das nennt man hybride Verschlüsselung. HTTPS mit TLS arbeitet so.\n\nEin Hashwert ist ein digitaler Fingerabdruck. Er prüft, ob Daten verändert wurden. Ein VPN baut einen verschlüsselten Tunnel durch das Internet, zum Beispiel ins Homeoffice. Mit BitLocker verschlüsselt man die ganze Festplatte eines Laptops.',
        simple:
          'Symmetrisch: Ein Schlüssel für Auf- und Zuschließen. Asymmetrisch: Ein Briefkasten. Jeder kann etwas einwerfen, also verschlüsseln. Nur der Besitzer hat den Schlüssel zum Öffnen.',
        example:
          'Ein Außendienstler verliert seinen Laptop im Zug. Weil die Festplatte mit BitLocker verschlüsselt ist, kann der Finder die Kundendaten nicht lesen.',
        check: {
          q: 'Welcher Schlüssel wird bei asymmetrischer Verschlüsselung zum Verschlüsseln einer Nachricht an Anna verwendet?',
          options: ['Annas privater Schlüssel', 'Annas öffentlicher Schlüssel', 'Der eigene private Schlüssel', 'Ein gemeinsamer geheimer Schlüssel'],
          correct: 1,
          explain: 'Man verschlüsselt mit dem öffentlichen Schlüssel des Empfängers. Nur Annas privater Schlüssel kann entschlüsseln.',
        },
      },
      {
        title: 'Backup-Strategien',
        keys: ['backup', 'datensicherung', 'vollsicherung', 'inkrementell', 'differenziell', '3 2 1', 'generationenprinzip', 'großvater', 'offline', 'wiederherstellung', 'restore', 'rpo', 'rto'],
        visual: 'backup',
        text:
          'Eine Vollsicherung sichert alle Daten. Sie braucht viel Zeit und Platz, ist aber einfach wiederherzustellen. Eine inkrementelle Sicherung sichert nur, was sich seit der letzten Sicherung geändert hat, egal welcher Art. Sie ist schnell. Zum Wiederherstellen braucht man aber die Vollsicherung und alle Inkremente danach. Eine differenzielle Sicherung sichert alles, was sich seit der letzten Vollsicherung geändert hat. Zum Wiederherstellen braucht man nur die Vollsicherung und die letzte differenzielle Sicherung.\n\nDie 3-2-1-Regel sagt: Halte drei Kopien deiner Daten, auf zwei verschiedenen Medien, und eine Kopie an einem anderen Ort. Gegen Ransomware hilft eine Kopie, die offline oder unveränderbar ist.\n\nBeim Generationenprinzip gibt es Tages-, Wochen- und Monatssicherungen. Man nennt sie Sohn, Vater und Großvater. Ganz wichtig: Ein Backup ist nur gut, wenn man die Wiederherstellung regelmäßig testet.',
        simple:
          'Vollsicherung: Du fotografierst das ganze Zimmer. Inkrementell: Du fotografierst nur, was seit dem letzten Foto neu ist. Differenziell: Du fotografierst alles, was seit dem großen Foto neu ist.',
        example:
          'Sonntag Vollsicherung, dann jeden Tag inkrementell. Am Donnerstag fällt der Server aus. Du brauchst die Sicherung von Sonntag und die Inkremente von Montag, Dienstag und Mittwoch.',
        check: {
          q: 'Was braucht man zum Wiederherstellen bei differenzieller Sicherung?',
          options: ['Nur die letzte differenzielle Sicherung', 'Die Vollsicherung und die letzte differenzielle Sicherung', 'Alle differenziellen Sicherungen', 'Nur die Vollsicherung'],
          correct: 1,
          explain: 'Die letzte differenzielle Sicherung enthält alle Änderungen seit der Vollsicherung.',
        },
      },
      {
        title: 'Zugriffskontrolle, Passwörter und MFA',
        keys: ['zugriff', 'zugriffskontrolle', 'zugangskontrolle', 'zutrittskontrolle', 'benutzerrechte', 'rechte', 'need to know', 'least privilege', 'passwort', 'passwörter', 'mfa', '2fa', 'authentifizierung', 'passwortmanager', 'admin'],
        text:
          'Man unterscheidet drei Begriffe. Zutrittskontrolle regelt, wer in einen Raum darf, zum Beispiel in den Serverraum. Zugangskontrolle regelt, wer sich an einem System anmelden darf. Zugriffskontrolle regelt, wer welche Daten lesen oder ändern darf.\n\nRechte vergibt man nach dem Prinzip der minimalen Rechte, auf Englisch Least Privilege. Jeder bekommt nur die Rechte, die er für seine Arbeit braucht. Man vergibt Rechte am besten an Gruppen statt an einzelne Personen. Mitarbeiter arbeiten im Alltag nicht mit Administratorrechten.\n\nEin gutes Passwort ist lang und einzigartig. Die Länge ist wichtiger als komplizierte Sonderzeichen. Für jeden Dienst braucht man ein eigenes Passwort. Ein Passwortmanager hilft dabei. Das BSI empfiehlt nicht mehr, Passwörter ohne Anlass regelmäßig zu ändern. Man ändert sie, wenn es einen Verdacht gibt.\n\nMFA bedeutet Multi-Faktor-Authentifizierung. Man kombiniert mindestens zwei Faktoren aus verschiedenen Bereichen: Wissen wie ein Passwort, Besitz wie ein Smartphone oder Token, und Sein wie ein Fingerabdruck. Zwei Passwörter sind kein zweiter Faktor, weil beides Wissen ist.',
        simple:
          'MFA ist wie Bankkarte und PIN. Wer nur die PIN kennt, kommt nicht an Geld. Wer nur die Karte hat, auch nicht.',
        example:
          'Ein Praktikant soll Rechnungen ansehen, aber nicht ändern. Du gibst seiner Gruppe nur Leserechte auf den Ordner Rechnungen.',
        check: {
          q: 'Welche Kombination ist echte Zwei-Faktor-Authentifizierung?',
          options: ['Passwort und PIN', 'Passwort und Sicherheitsfrage', 'Passwort und Code aus einer App auf dem Smartphone', 'Zwei verschiedene Passwörter'],
          correct: 2,
          explain: 'Passwort ist Wissen, das Smartphone ist Besitz. Das sind zwei verschiedene Faktoren.',
        },
      },
      {
        title: 'Social Engineering und Phishing',
        keys: ['social engineering', 'phishing', 'spear phishing', 'ceo fraud', 'vishing', 'smishing', 'mail', 'link', 'anhang', 'schulung', 'sensibilisierung'],
        text:
          'Social Engineering heißt, Menschen zu manipulieren. Angreifer nutzen Hilfsbereitschaft, Angst, Zeitdruck oder Respekt vor Vorgesetzten. Ein Anrufer gibt sich zum Beispiel als IT-Support aus und fragt nach dem Passwort.\n\nPhishing ist der Versuch, über gefälschte E-Mails oder Webseiten an Zugangsdaten zu kommen. Typische Merkmale sind eine falsche Absenderadresse, ein Link zu einer fremden Domain, Zeitdruck, Drohungen und unerwartete Anhänge. Spear-Phishing ist gezielt auf eine Person zugeschnitten. Beim CEO-Fraud gibt sich der Angreifer als Chef aus und verlangt eine dringende Überweisung.\n\nDie wichtigste Abwehr sind geschulte Mitarbeiter. Dazu kommen Spamfilter, MFA und klare Regeln. Zum Beispiel: Die IT fragt nie nach Passwörtern. Überweisungen werden immer über einen zweiten Kanal bestätigt.',
        simple:
          'Ein Phisher ist wie ein Trickbetrüger an der Haustür, der sich als Stromableser ausgibt. Im Zweifel: Tür zu und selbst bei der echten Firma anrufen.',
        check: {
          q: 'Was ist das stärkste Warnsignal in einer E-Mail?',
          options: ['Das Firmenlogo fehlt', 'Ein Link führt auf eine fremde Domain und es wird Zeitdruck gemacht', 'Die Mail ist auf Deutsch', 'Die Mail kommt am Morgen'],
          correct: 1,
          explain: 'Fremde Link-Ziele und künstlicher Zeitdruck sind typische Phishing-Merkmale.',
        },
      },
    ],
    widget: 'phishing',
    widgetTitle: 'Phishing-Mail untersuchen',
    terms: [
      { term: 'Vertraulichkeit', def: 'Nur Berechtigte haben Zugriff auf die Informationen.' },
      { term: 'Integrität', def: 'Daten sind vollständig, korrekt und unverändert.' },
      { term: 'Verfügbarkeit', def: 'Systeme und Daten sind nutzbar, wenn sie gebraucht werden.' },
      { term: 'Authentizität', def: 'Echtheit eines Absenders, Nutzers oder einer Information.' },
      { term: 'Ransomware', def: 'Schadsoftware, die Daten verschlüsselt und Lösegeld fordert.' },
      { term: 'Symmetrische Verschlüsselung', def: 'Ein gemeinsamer Schlüssel für Ver- und Entschlüsselung, z. B. AES.' },
      { term: 'Asymmetrische Verschlüsselung', def: 'Öffentlicher und privater Schlüssel, z. B. RSA.' },
      { term: 'Hashwert', def: 'Prüfsumme. Zeigt, ob Daten verändert wurden.' },
      { term: 'Inkrementelle Sicherung', def: 'Sichert Änderungen seit der letzten Sicherung jeder Art.' },
      { term: 'Differenzielle Sicherung', def: 'Sichert Änderungen seit der letzten Vollsicherung.' },
      { term: '3-2-1-Regel', def: '3 Kopien, 2 Medien, 1 Kopie extern.' },
      { term: 'Least Privilege', def: 'Jeder bekommt nur die minimal nötigen Rechte.' },
      { term: 'MFA', def: 'Anmeldung mit mindestens zwei Faktoren aus Wissen, Besitz und Sein.' },
      { term: 'Phishing', def: 'Betrug mit gefälschten Nachrichten, um Zugangsdaten zu stehlen.' },
      { term: 'VPN', def: 'Verschlüsselter Tunnel durch ein unsicheres Netz.' },
    ],
    formulas: ['Restore inkrementell = Vollsicherung + alle Inkremente', 'Restore differenziell = Vollsicherung + letzte Differenzielle', '3-2-1: 3 Kopien · 2 Medien · 1 extern'],
    merksaetze: [
      'Wissen, Besitz, Sein: Zwei davon sind MFA.',
      'Ein Backup ohne getestete Wiederherstellung ist nur eine Hoffnung.',
      'Mit dem öffentlichen Schlüssel des Empfängers verschlüsseln.',
      'Zutritt Raum, Zugang System, Zugriff Daten.',
    ],
    traps: [
      'Inkrementell und differenziell vertauschen.',
      'Passwort und PIN als zwei Faktoren zählen.',
      'RAID oder Snapshot als Backup bezeichnen.',
      'Zutritts-, Zugangs- und Zugriffskontrolle vermischen.',
    ],
    summary:
      'IT-Sicherheit schützt Vertraulichkeit, Integrität und Verfügbarkeit. Firewalls filtern Verkehr, Virenschutz erkennt Malware, Verschlüsselung schützt Daten. Backups folgen der 3-2-1-Regel und werden getestet. Rechte vergibt man minimal und über Gruppen, Anmeldungen sichert man mit MFA. Gegen Phishing helfen vor allem geschulte Menschen.',
  },
  {
    id: 'datenschutz',
    title: 'Datenschutz & DSGVO',
    short: 'Datenschutz',
    area: 'Software & Sicherheit',
    examWeight: 8,
    intro:
      'Datenschutz schützt Menschen, nicht Computer. Es geht um personenbezogene Daten. Die wichtigste Regel ist die DSGVO, die Datenschutz-Grundverordnung der EU. In Deutschland ergänzt sie das Bundesdatenschutzgesetz, kurz BDSG. In der Prüfung sollst du Fälle beurteilen und Maßnahmen nennen.',
    sections: [
      {
        title: 'Personenbezogene Daten und Grundsätze',
        keys: ['personenbezogen', 'personenbezogene daten', 'grundsätze', 'zweckbindung', 'datenminimierung', 'transparenz', 'speicherbegrenzung', 'rechenschaftspflicht', 'artikel 5', 'besondere kategorien', 'artikel 9', 'datenschutz vs datensicherheit'],
        visual: 'dsgvo',
        text:
          'Personenbezogene Daten sind alle Informationen über eine bestimmte oder bestimmbare Person. Dazu gehören Name, Adresse, E-Mail, Telefonnummer, IP-Adresse, Personalnummer und Fotos. Besonders geschützt sind Gesundheitsdaten, religiöse Überzeugungen, politische Meinungen, ethnische Herkunft und biometrische Daten. Sie stehen in Artikel 9.\n\nArtikel 5 nennt die Grundsätze. Die Verarbeitung muss rechtmäßig und transparent sein. Daten dürfen nur für einen festgelegten Zweck genutzt werden. Das ist die Zweckbindung. Man erhebt nur so viele Daten wie nötig. Das ist die Datenminimierung. Daten müssen richtig sein und dürfen nur so lange gespeichert werden wie nötig. Sie müssen sicher verarbeitet werden. Und das Unternehmen muss nachweisen können, dass es alles einhält. Das ist die Rechenschaftspflicht.\n\nDatenschutz und Datensicherheit sind nicht dasselbe. Datenschutz schützt die Rechte der Menschen. Datensicherheit schützt die Daten technisch, egal ob sie personenbezogen sind.',
        simple:
          'Datenschutz fragt: Darf ich diese Daten überhaupt haben und wofür? Datensicherheit fragt: Wie schütze ich die Daten vor Verlust und Diebstahl?',
        check: {
          q: 'Ist eine IP-Adresse ein personenbezogenes Datum?',
          options: ['Nein, nie', 'Ja, wenn sie einer Person zugeordnet werden kann', 'Nur bei IPv6', 'Nur in Verbindung mit einem Foto'],
          correct: 1,
          explain: 'Eine IP-Adresse kann eine Person bestimmbar machen und gilt dann als personenbezogen.',
        },
      },
      {
        title: 'Wann ist eine Verarbeitung erlaubt?',
        keys: ['rechtmäßig', 'rechtsgrundlage', 'einwilligung', 'artikel 6', 'vertrag', 'berechtigtes interesse', 'rechtliche verpflichtung', 'verbot mit erlaubnisvorbehalt'],
        text:
          'Grundsätzlich ist die Verarbeitung personenbezogener Daten verboten, außer es gibt eine Erlaubnis. Man nennt das Verbot mit Erlaubnisvorbehalt. Die Erlaubnisse stehen in Artikel 6.\n\nDie wichtigsten sind: Die Person hat eingewilligt. Die Daten werden für einen Vertrag gebraucht, zum Beispiel die Lieferadresse. Es gibt eine rechtliche Pflicht, zum Beispiel die Aufbewahrung von Rechnungen. Oder das Unternehmen hat ein berechtigtes Interesse, das schwerer wiegt als die Interessen der Person.\n\nEine Einwilligung muss freiwillig, informiert und eindeutig sein. Ein vorab angekreuztes Kästchen reicht nicht. Die Einwilligung kann jederzeit widerrufen werden.',
        simple: 'Ohne guten Grund keine Daten. Gute Gründe sind: Die Person sagt ja, ein Vertrag braucht es, oder das Gesetz verlangt es.',
        example:
          'Ein Shop braucht die Adresse, um ein Paket zu liefern. Dafür ist keine Einwilligung nötig, weil die Daten für den Vertrag nötig sind. Für einen Newsletter braucht der Shop dagegen eine Einwilligung.',
        check: {
          q: 'Ein Webshop setzt für den Newsletter ein bereits angekreuztes Häkchen. Ist das eine wirksame Einwilligung?',
          options: ['Ja', 'Nein, die Einwilligung muss aktiv und eindeutig sein', 'Ja, wenn die AGB das erlauben', 'Nur bei Neukunden'],
          correct: 1,
          explain: 'Vorab angekreuzte Kästchen sind keine eindeutige Einwilligung.',
        },
      },
      {
        title: 'Rechte der Betroffenen',
        keys: ['betroffenenrechte', 'auskunft', 'berichtigung', 'löschung', 'recht auf vergessenwerden', 'datenübertragbarkeit', 'widerspruch', 'einschränkung', 'artikel 15', 'artikel 17'],
        text:
          'Jede Person hat Rechte gegenüber dem Unternehmen. Sie hat ein Recht auf Auskunft, welche Daten gespeichert sind. Das steht in Artikel 15. Sie darf falsche Daten berichtigen lassen. Sie darf die Löschung verlangen, wenn die Daten nicht mehr gebraucht werden. Das nennt man auch Recht auf Vergessenwerden. Sie darf die Verarbeitung einschränken lassen. Sie darf ihre Daten in einem gängigen Format mitnehmen. Das ist die Datenübertragbarkeit. Und sie darf der Verarbeitung widersprechen, zum Beispiel bei Werbung.\n\nDas Unternehmen muss in der Regel innerhalb eines Monats antworten. Aufbewahrungspflichten können der Löschung entgegenstehen. Rechnungen müssen zum Beispiel trotzdem aufbewahrt werden.',
        simple: 'Jeder darf fragen: Was wisst ihr über mich? Jeder darf sagen: Das ist falsch, korrigiert das. Oder: Löscht das.',
        check: {
          q: 'Ein Kunde will wissen, welche Daten über ihn gespeichert sind. Welches Recht nutzt er?',
          options: ['Recht auf Datenübertragbarkeit', 'Recht auf Auskunft', 'Widerspruchsrecht', 'Recht auf Berichtigung'],
          correct: 1,
          explain: 'Das Auskunftsrecht steht in Artikel 15 DSGVO.',
        },
      },
      {
        title: 'Pflichten des Unternehmens',
        keys: ['tom', 'technische und organisatorische maßnahmen', 'artikel 32', 'datenschutzbeauftragter', 'auftragsverarbeitung', 'avv', 'artikel 28', 'datenpanne', '72 stunden', 'bußgeld', 'verzeichnis', 'privacy by design', 'pseudonymisierung', 'anonymisierung'],
        text:
          'Unternehmen müssen Daten mit technischen und organisatorischen Maßnahmen schützen. Man nennt sie TOM. Sie stehen in Artikel 32. Technische Maßnahmen sind zum Beispiel Verschlüsselung, Backups und Firewalls. Organisatorische Maßnahmen sind zum Beispiel Schulungen, Regeln und ein Berechtigungskonzept.\n\nGibt ein Unternehmen Daten an einen Dienstleister, der sie in seinem Auftrag verarbeitet, braucht es einen Auftragsverarbeitungsvertrag, kurz AVV. Das steht in Artikel 28. Beispiele sind ein Cloud-Anbieter oder ein externer IT-Dienstleister.\n\nEin Datenschutzbeauftragter ist in Deutschland meist ab 20 Personen nötig, die ständig mit der automatisierten Verarbeitung personenbezogener Daten beschäftigt sind. Das regelt § 38 BDSG.\n\nBei einer Datenpanne mit Risiko für Personen muss das Unternehmen die Aufsichtsbehörde innerhalb von 72 Stunden informieren. Bei Verstößen drohen Bußgelder bis 20 Millionen Euro oder 4 % des weltweiten Jahresumsatzes, je nachdem, was höher ist.\n\nPseudonymisierte Daten kann man mit Zusatzwissen wieder einer Person zuordnen. Sie bleiben personenbezogen. Anonymisierte Daten kann man keiner Person mehr zuordnen. Für sie gilt die DSGVO nicht.',
        simple:
          'Das Unternehmen muss Daten schützen, Verträge mit Dienstleistern machen, Pannen schnell melden und einen Datenschutzbeauftragten haben, wenn es groß genug ist.',
        example:
          'Ein Mitarbeiter verliert einen unverschlüsselten USB-Stick mit Kundendaten. Das ist eine Datenpanne. Das Unternehmen prüft das Risiko und meldet sie innerhalb von 72 Stunden der Aufsichtsbehörde.',
        check: {
          q: 'Innerhalb welcher Frist muss eine meldepflichtige Datenpanne der Aufsichtsbehörde gemeldet werden?',
          options: ['24 Stunden', '72 Stunden', '7 Tage', '1 Monat'],
          correct: 1,
          explain: 'Artikel 33 DSGVO: möglichst binnen 72 Stunden nach Bekanntwerden.',
        },
      },
    ],
    widget: 'dsgvo-cases',
    widgetTitle: 'Datenschutz-Fälle beurteilen',
    terms: [
      { term: 'DSGVO', def: 'Datenschutz-Grundverordnung der EU. Gilt seit 25. Mai 2018.' },
      { term: 'BDSG', def: 'Bundesdatenschutzgesetz. Ergänzt die DSGVO in Deutschland.' },
      { term: 'Personenbezogene Daten', def: 'Informationen über eine bestimmte oder bestimmbare Person.' },
      { term: 'Zweckbindung', def: 'Daten nur für den festgelegten Zweck verwenden.' },
      { term: 'Datenminimierung', def: 'Nur so viele Daten erheben wie nötig.' },
      { term: 'Einwilligung', def: 'Freiwillige, informierte, eindeutige Zustimmung. Jederzeit widerrufbar.' },
      { term: 'TOM', def: 'Technische und organisatorische Maßnahmen zum Schutz der Daten (Art. 32).' },
      { term: 'AVV', def: 'Auftragsverarbeitungsvertrag mit Dienstleistern (Art. 28).' },
      { term: 'Pseudonymisierung', def: 'Daten mit Zusatzwissen wieder zuordenbar. Bleiben personenbezogen.' },
      { term: 'Anonymisierung', def: 'Keine Zuordnung zu einer Person mehr möglich.' },
      { term: 'Aufsichtsbehörde', def: 'Staatliche Stelle, die den Datenschutz überwacht, z. B. Landesdatenschutzbeauftragte.' },
    ],
    formulas: ['Datenpanne → Meldung binnen 72 h', 'DSB ab 20 Personen (§ 38 BDSG)', 'Bußgeld bis 20 Mio. € oder 4 % Weltumsatz'],
    merksaetze: [
      'Verbot mit Erlaubnisvorbehalt: ohne Rechtsgrundlage keine Verarbeitung.',
      'Datenschutz schützt Menschen, Datensicherheit schützt Daten.',
      'Pseudonym bleibt personenbezogen, anonym nicht.',
    ],
    traps: [
      'Pseudonymisierung mit Anonymisierung verwechseln.',
      'Für jede Verarbeitung eine Einwilligung verlangen. Oft reicht der Vertrag.',
      'Denken, eine Löschung geht immer sofort. Aufbewahrungsfristen können entgegenstehen.',
      'Datenschutz und Datensicherheit gleichsetzen.',
    ],
    summary:
      'Die DSGVO schützt personenbezogene Daten. Jede Verarbeitung braucht eine Rechtsgrundlage, etwa Einwilligung, Vertrag oder gesetzliche Pflicht. Grundsätze sind Zweckbindung, Datenminimierung und Speicherbegrenzung. Betroffene haben Rechte auf Auskunft, Berichtigung, Löschung und Widerspruch. Unternehmen treffen TOM, schließen AVV und melden Pannen innerhalb von 72 Stunden.',
  },
  {
    id: 'rechnen',
    title: 'Kaufmännisches Rechnen',
    short: 'Kaufm. Rechnen',
    area: 'Kaufmännisch & Projekt',
    examWeight: 10,
    intro:
      'In der AP1 rechnest du Angebote durch. Du musst Brutto und Netto umrechnen, Rabatte und Skonto abziehen und den Bezugspreis ermitteln. Dafür brauchst du nur Prozentrechnung und Dreisatz. Wichtig ist ein sauberer Rechenweg.',
    sections: [
      {
        title: 'Prozentrechnung und Dreisatz',
        keys: ['prozent', 'prozentrechnung', 'grundwert', 'prozentwert', 'prozentsatz', 'dreisatz', 'proportional', 'antiproportional'],
        text:
          'Bei der Prozentrechnung gibt es drei Größen. Der Grundwert ist das Ganze, also 100 %. Der Prozentsatz ist der Anteil in Prozent. Der Prozentwert ist der Anteil als Betrag. Die Formel lautet: Prozentwert = Grundwert × Prozentsatz ÷ 100.\n\nBeim Dreisatz rechnest du in drei Schritten. Zuerst schreibst du auf, was du weißt. Dann rechnest du auf eine Einheit herunter. Dann rechnest du auf die gesuchte Menge hoch. Wenn mehr von dem einen auch mehr von dem anderen bedeutet, ist es ein proportionaler Dreisatz. Wenn mehr von dem einen weniger von dem anderen bedeutet, ist es antiproportional. Beispiel: Mehr Techniker brauchen weniger Zeit.',
        simple:
          'Dreisatz: Erst schauen, was eins kostet. Dann mal die Menge, die du willst. Fertig.',
        example:
          'Drei Techniker brauchen 8 Stunden für 24 Arbeitsplätze. Wie lange brauchen vier Techniker? Das ist antiproportional. Ein Techniker braucht 3 × 8 = 24 Stunden. Vier Techniker brauchen 24 ÷ 4 = 6 Stunden.',
        check: {
          q: '15 % von 2.400 € sind …',
          options: ['160 €', '360 €', '240 €', '36 €'],
          correct: 1,
          explain: '2.400 × 15 ÷ 100 = 360 €.',
        },
      },
      {
        title: 'Brutto, Netto und Umsatzsteuer',
        keys: ['brutto', 'netto', 'umsatzsteuer', 'mehrwertsteuer', 'ust', 'mwst', '19 %', '7 %', 'vorsteuer'],
        text:
          'Der Nettopreis ist der Preis ohne Umsatzsteuer. Der Bruttopreis ist der Preis mit Umsatzsteuer. In Deutschland beträgt der normale Steuersatz 19 %. Der ermäßigte Satz beträgt 7 %, zum Beispiel für Lebensmittel und Bücher. IT-Produkte haben fast immer 19 %.\n\nVon Netto zu Brutto rechnest du: Netto × 1,19. Von Brutto zu Netto rechnest du: Brutto ÷ 1,19. Der Steuerbetrag ist Brutto minus Netto.\n\nAchtung: Du darfst nicht einfach 19 % vom Bruttopreis abziehen. Dann rechnest du falsch, weil der Bruttopreis schon 119 % ist.\n\nUnternehmen können die gezahlte Umsatzsteuer meist als Vorsteuer vom Finanzamt zurückholen. Darum vergleichen Firmen Angebote fast immer netto.',
        simple:
          'Netto ist der Preis vor der Steuer. Brutto ist nach der Steuer. Brutto ist immer 119 %, wenn Netto 100 % ist.',
        example:
          'Ein Monitor kostet 357 € brutto. Netto sind das 357 ÷ 1,19 = 300 €. Die Umsatzsteuer beträgt 57 €.',
        check: {
          q: 'Ein Laptop kostet 1.190 € brutto. Wie hoch ist der Nettopreis bei 19 % USt?',
          options: ['963,90 €', '1.000,00 €', '1.071,00 €', '990,00 €'],
          correct: 1,
          explain: '1.190 ÷ 1,19 = 1.000 €. Wer 19 % von 1.190 abzieht, erhält fälschlich 963,90 €.',
        },
      },
      {
        title: 'Bezugskalkulation',
        keys: ['bezugskalkulation', 'bezugspreis', 'einstandspreis', 'listeneinkaufspreis', 'rabatt', 'skonto', 'zieleinkaufspreis', 'bareinkaufspreis', 'bezugskosten', 'versand', 'angebotsvergleich'],
        visual: 'bezug',
        text:
          'Mit der Bezugskalkulation findest du heraus, was eine Ware wirklich kostet, bis sie bei dir ist. Das Ergebnis heißt Bezugspreis oder Einstandspreis.\n\nDu startest mit dem Listeneinkaufspreis. Davon ziehst du den Liefererrabatt ab. Das Ergebnis ist der Zieleinkaufspreis. Davon ziehst du das Liefererskonto ab. Skonto bekommst du, wenn du schnell bezahlst. Das Ergebnis ist der Bareinkaufspreis. Dazu addierst du die Bezugskosten, also Versand, Verpackung und Versicherung. Das Ergebnis ist der Bezugspreis.\n\nGanz wichtig ist die Reihenfolge. Erst Rabatt, dann Skonto. Skonto rechnest du vom Zieleinkaufspreis, nicht vom Listenpreis. Bezugskosten bekommen keinen Rabatt und kein Skonto.',
        simple:
          'Erst den Mengenrabatt abziehen. Dann den Rabatt fürs schnelle Zahlen. Dann den Versand dazurechnen. Das ist der echte Preis.',
        example:
          'Listenpreis 10 Monitore à 200 € = 2.000 €. 10 % Rabatt = 200 € → 1.800 €. 2 % Skonto von 1.800 € = 36 € → 1.764 €. Versand 25 € → Bezugspreis 1.789 €.',
        check: {
          q: 'Wovon wird das Skonto berechnet?',
          options: ['Vom Listeneinkaufspreis', 'Vom Zieleinkaufspreis', 'Vom Bezugspreis', 'Von den Bezugskosten'],
          correct: 1,
          explain: 'Skonto wird vom Zieleinkaufspreis berechnet, also nach Abzug des Rabatts.',
        },
      },
    ],
    steps: {
      title: 'Bezugskalkulation Schritt für Schritt',
      steps: [
        'Listeneinkaufspreis = Menge × Stückpreis',
        '− Liefererrabatt (in % vom Listeneinkaufspreis)',
        '= Zieleinkaufspreis',
        '− Liefererskonto (in % vom Zieleinkaufspreis)',
        '= Bareinkaufspreis',
        '+ Bezugskosten (Fracht, Verpackung, Versicherung)',
        '= Bezugspreis (Einstandspreis)',
      ],
    },
    widget: 'calc-stepper',
    widgetTitle: 'Bezugskalkulation selbst rechnen',
    terms: [
      { term: 'Grundwert', def: 'Das Ganze in der Prozentrechnung, entspricht 100 %.' },
      { term: 'Prozentwert', def: 'Der Anteil als Betrag.' },
      { term: 'Nettopreis', def: 'Preis ohne Umsatzsteuer.' },
      { term: 'Bruttopreis', def: 'Preis inklusive Umsatzsteuer.' },
      { term: 'Vorsteuer', def: 'Gezahlte Umsatzsteuer, die ein Unternehmen vom Finanzamt zurückfordern kann.' },
      { term: 'Rabatt', def: 'Preisnachlass, z. B. für Menge oder Treue.' },
      { term: 'Skonto', def: 'Preisnachlass für Zahlung innerhalb einer kurzen Frist.' },
      { term: 'Zieleinkaufspreis', def: 'Listenpreis minus Rabatt.' },
      { term: 'Bareinkaufspreis', def: 'Zieleinkaufspreis minus Skonto.' },
      { term: 'Bezugspreis', def: 'Bareinkaufspreis plus Bezugskosten. Auch Einstandspreis.' },
    ],
    formulas: [
      'Prozentwert = Grundwert × Prozentsatz ÷ 100',
      'Brutto = Netto × 1,19',
      'Netto = Brutto ÷ 1,19',
      'USt = Netto × 0,19 = Brutto − Netto',
      'Listenpreis − Rabatt = Ziel-EK − Skonto = Bar-EK + Bezugskosten = Bezugspreis',
    ],
    merksaetze: ['Brutto ist 119 %, nicht 100 %.', 'Erst Rabatt, dann Skonto, dann Bezugskosten.', 'Firmen vergleichen netto.'],
    traps: [
      '19 % vom Bruttopreis abziehen, statt durch 1,19 zu teilen.',
      'Skonto vom Listenpreis berechnen.',
      'Auf die Bezugskosten Rabatt geben.',
      'Brutto- und Nettopreise in einem Vergleich mischen.',
    ],
    summary:
      'Prozentwert ist Grundwert mal Prozentsatz durch 100. Von Netto zu Brutto multiplizierst du mit 1,19, zurück teilst du durch 1,19. In der Bezugskalkulation ziehst du erst Rabatt, dann Skonto ab und addierst zuletzt die Bezugskosten. Der Dreisatz hilft bei allen Umrechnungen.',
  },
  {
    id: 'wirtschaftlichkeit',
    title: 'Wirtschaftlichkeit & Angebotsvergleich',
    short: 'Wirtschaftlichkeit',
    area: 'Kaufmännisch & Projekt',
    examWeight: 7,
    intro:
      'Das billigste Angebot ist nicht immer das beste. Du musst Gesamtkosten über die Nutzungsdauer berechnen, Kauf und Leasing vergleichen und auch weiche Kriterien bewerten. Dafür gibt es TCO, Kostenvergleich und die Nutzwertanalyse.',
    sections: [
      {
        title: 'Total Cost of Ownership (TCO)',
        keys: ['tco', 'total cost of ownership', 'gesamtkosten', 'betriebskosten', 'direkte kosten', 'indirekte kosten', 'lebenszyklus'],
        visual: 'tco',
        text:
          'TCO bedeutet Total Cost of Ownership. Das sind alle Kosten eines IT-Systems über die gesamte Nutzungsdauer. Die Anschaffung ist oft nur ein kleiner Teil.\n\nDirekte Kosten sind zum Beispiel Kaufpreis, Lizenzen, Wartungsverträge, Strom und Verbrauchsmaterial. Indirekte Kosten sind zum Beispiel Ausfallzeiten, Schulungen, Zeit für Support und der Aufwand der Mitarbeiter, die sich selbst helfen.\n\nFür einen Vergleich rechnest du alle Kosten pro Jahr zusammen und multiplizierst mit der Nutzungsdauer. Dazu addierst du die Anschaffung.',
        simple:
          'Ein billiger Drucker mit teurer Tinte kann am Ende viel mehr kosten. TCO heißt: Alles zusammenrechnen, was in der ganzen Zeit anfällt.',
        example:
          'Drucker A kostet 150 € und 0,06 € pro Seite. Drucker B kostet 450 € und 0,02 € pro Seite. Bei 10.000 Seiten pro Jahr und 3 Jahren: A = 150 + 1.800 = 1.950 €. B = 450 + 600 = 1.050 €. B ist günstiger.',
        check: {
          q: 'Was gehört NICHT zu den TCO eines PCs?',
          options: ['Stromkosten', 'Schulung der Nutzer', 'Wartung', 'Der Umsatz, den der Mitarbeiter erzielt'],
          correct: 3,
          explain: 'TCO umfasst Kosten. Umsatz ist ein Ertrag und gehört nicht dazu.',
        },
      },
      {
        title: 'Kauf, Leasing und Miete',
        keys: ['leasing', 'kauf', 'miete', 'leasingrate', 'liquidität', 'bilanz', 'abschreibung', 'afa', 'nutzungsdauer', 'restwert'],
        text:
          'Beim Kauf gehört das Gerät dem Unternehmen. Es zahlt den Preis einmal und schreibt das Gerät über die Nutzungsdauer ab. Das bindet Kapital.\n\nBeim Leasing nutzt das Unternehmen das Gerät gegen eine monatliche Rate. Es gehört dem Leasinggeber. Vorteile sind geschonte Liquidität, planbare Kosten und ein einfacher Austausch nach der Laufzeit. Nachteil ist, dass Leasing über die ganze Laufzeit meist teurer ist als ein Kauf.\n\nFür den Vergleich rechnest du die Leasingkosten zusammen: Rate × Anzahl Monate plus eventuelle Sonderzahlung. Dann vergleichst du mit dem Kaufpreis plus Kosten, die beim Leasing enthalten wären, zum Beispiel ein Servicevertrag.\n\nBei der linearen Abschreibung teilst du die Anschaffungskosten durch die Nutzungsdauer. Für Computerhardware und Software ist steuerlich seit 2021 auch eine Nutzungsdauer von einem Jahr möglich. In Prüfungsaufgaben ist die Nutzungsdauer meist angegeben.',
        simple:
          'Kaufen ist wie ein eigenes Auto. Leasing ist wie ein Auto mit Monatsrate. Am Ende hat man es nicht, aber man musste nicht alles auf einmal zahlen.',
        example:
          'Ein Server kostet 6.000 €. Leasing kostet 190 € im Monat für 36 Monate. Das sind 6.840 €. Leasing ist um 840 € teurer, schont aber die Liquidität.',
        check: {
          q: 'Was ist ein typischer Vorteil von Leasing?',
          options: ['Das Gerät gehört sofort dem Unternehmen', 'Die Liquidität wird geschont', 'Es ist immer billiger als Kauf', 'Es gibt keine Verträge'],
          correct: 1,
          explain: 'Beim Leasing muss das Unternehmen nicht den ganzen Preis auf einmal bezahlen.',
        },
      },
      {
        title: 'Nutzwertanalyse',
        keys: ['nutzwertanalyse', 'nwa', 'gewichtung', 'kriterien', 'punkte', 'qualitativ', 'quantitativ', 'entscheidung', 'scoring'],
        text:
          'Mit der Nutzwertanalyse vergleichst du Angebote auch nach Kriterien, die man nicht in Euro messen kann. Beispiele sind Service, Lieferzeit, Bedienbarkeit oder Umweltfreundlichkeit.\n\nSo gehst du vor. Erstens legst du die Kriterien fest. Zweitens gewichtest du sie. Die Gewichte ergeben zusammen 100 %. Drittens vergibst du Punkte für jedes Angebot, zum Beispiel von 1 bis 10. Viertens multiplizierst du Punkte mit Gewichtung. Fünftens addierst du die gewichteten Punkte. Das Angebot mit der höchsten Summe gewinnt.\n\nDie Nutzwertanalyse ist subjektiv, weil Menschen die Gewichte und Punkte festlegen. Darum muss man die Bewertung begründen.',
        simple:
          'Du gibst jedem Angebot Schulnoten in mehreren Fächern. Wichtige Fächer zählen mehr. Wer am Ende den besten Durchschnitt hat, gewinnt.',
        example:
          'Kriterium Preis 50 %, Service 30 %, Lieferzeit 20 %. Angebot A bekommt 8, 5 und 6 Punkte. Nutzwert = 8 × 0,5 + 5 × 0,3 + 6 × 0,2 = 4 + 1,5 + 1,2 = 6,7.',
        check: {
          q: 'Worauf müssen sich die Gewichtungen in einer Nutzwertanalyse summieren?',
          options: ['10 %', '50 %', '100 %', 'Egal'],
          correct: 2,
          explain: 'Die Gewichte ergeben zusammen 100 % oder 1,0.',
        },
      },
      {
        title: 'Kostenvergleich und Amortisation',
        keys: ['kostenvergleich', 'fixkosten', 'variable kosten', 'kritische menge', 'break even', 'amortisation', 'amortisationszeit', 'rentabilität', 'wirtschaftlichkeit', 'make or buy'],
        text:
          'Fixe Kosten sind unabhängig von der Menge, zum Beispiel die Miete für einen Kopierer. Variable Kosten steigen mit der Menge, zum Beispiel die Kosten pro Kopie. Die Gesamtkosten sind Fixkosten plus variable Kosten mal Menge.\n\nBei zwei Angeboten mit unterschiedlichen Fixkosten und variablen Kosten gibt es eine kritische Menge. Ab dieser Menge ist das andere Angebot günstiger. Man berechnet sie so: Differenz der Fixkosten geteilt durch die Differenz der variablen Kosten.\n\nDie Amortisationszeit sagt, wann sich eine Investition bezahlt gemacht hat. Man teilt die Investition durch die jährliche Ersparnis.\n\nWirtschaftlichkeit ist Ertrag geteilt durch Aufwand. Ist der Wert größer als 1, ist eine Sache wirtschaftlich.',
        simple: 'Amortisation fragt: Nach wie vielen Jahren habe ich das Geld durch die Ersparnis wieder drin?',
        example:
          'Eine neue Telefonanlage kostet 9.000 € und spart 2.250 € pro Jahr. Sie amortisiert sich nach 9.000 ÷ 2.250 = 4 Jahren.',
        check: {
          q: 'Angebot A: 100 € fix + 0,05 €/Seite. Angebot B: 400 € fix + 0,02 €/Seite. Ab welcher Seitenzahl ist B günstiger?',
          options: ['Ab 6.000 Seiten', 'Ab 10.000 Seiten', 'Ab 15.000 Seiten', 'Nie'],
          correct: 1,
          explain: '(400 − 100) ÷ (0,05 − 0,02) = 300 ÷ 0,03 = 10.000 Seiten.',
        },
      },
    ],
    widget: 'nwa',
    widgetTitle: 'Nutzwertanalyse ausprobieren',
    terms: [
      { term: 'TCO', def: 'Gesamtkosten über die Nutzungsdauer, inklusive Betrieb und indirekter Kosten.' },
      { term: 'Leasing', def: 'Nutzung eines Wirtschaftsguts gegen Raten. Eigentümer bleibt der Leasinggeber.' },
      { term: 'Liquidität', def: 'Fähigkeit, Zahlungen fristgerecht zu leisten.' },
      { term: 'Lineare Abschreibung', def: 'Anschaffungskosten gleichmäßig auf die Nutzungsdauer verteilt.' },
      { term: 'Nutzwertanalyse', def: 'Bewertung von Alternativen mit gewichteten Kriterien.' },
      { term: 'Fixkosten', def: 'Kosten, die unabhängig von der Menge anfallen.' },
      { term: 'Variable Kosten', def: 'Kosten, die mit der Menge steigen.' },
      { term: 'Kritische Menge', def: 'Menge, ab der eine andere Alternative günstiger ist.' },
      { term: 'Amortisationszeit', def: 'Zeit, bis eine Investition durch Ersparnisse zurückverdient ist.' },
      { term: 'Wirtschaftlichkeit', def: 'Ertrag geteilt durch Aufwand.' },
    ],
    formulas: [
      'TCO = Anschaffung + jährliche Kosten × Jahre',
      'Leasingkosten = Rate × Monate (+ Sonderzahlung)',
      'Lineare AfA pro Jahr = Anschaffungskosten ÷ Nutzungsdauer',
      'Nutzwert = Σ (Punkte × Gewichtung)',
      'Kritische Menge = (Fix₂ − Fix₁) ÷ (var₁ − var₂)',
      'Amortisationszeit = Investition ÷ jährliche Ersparnis',
      'Wirtschaftlichkeit = Ertrag ÷ Aufwand',
    ],
    merksaetze: [
      'Nicht der Kaufpreis entscheidet, sondern die Gesamtkosten.',
      'Gewichte der Nutzwertanalyse ergeben 100 %.',
      'Leasing schont die Liquidität, ist aber meist teurer.',
    ],
    traps: [
      'Nur den Anschaffungspreis vergleichen.',
      'Bei der Nutzwertanalyse vergessen, mit der Gewichtung zu multiplizieren.',
      'Monatliche und jährliche Kosten mischen.',
      'Beim Leasing die Sonderzahlung vergessen.',
    ],
    summary:
      'TCO umfasst alle Kosten über die Nutzungsdauer. Leasing schont die Liquidität, Kauf ist auf Dauer meist günstiger. Die Nutzwertanalyse bewertet Angebote mit gewichteten Kriterien. Mit der kritischen Menge und der Amortisationszeit triffst du begründete Entscheidungen.',
  },
  {
    id: 'projekt',
    title: 'Beschaffung, Projekt & Service',
    short: 'Projekt & Service',
    area: 'Kaufmännisch & Projekt',
    examWeight: 5,
    intro:
      'Ein IT-Arbeitsplatz entsteht nicht von allein. Erst ermittelt man den Bedarf. Dann holt man Angebote ein, bestellt, installiert und übergibt. Danach kommen Service und Wartung. Dabei wird alles dokumentiert und geprüft.',
    sections: [
      {
        title: 'Bedarfsermittlung, Lastenheft und Pflichtenheft',
        keys: ['bedarf', 'bedarfsermittlung', 'bedarfsanalyse', 'kundenanforderung', 'anforderungen', 'lastenheft', 'pflichtenheft', 'interview', 'fragebogen', 'ist analyse', 'soll konzept', 'muss', 'kann'],
        visual: 'projekt',
        text:
          'Zuerst findest du heraus, was der Kunde wirklich braucht. Das ist die Bedarfsermittlung. Methoden sind Interviews, Fragebögen, Beobachtung am Arbeitsplatz und die Auswertung vorhandener Unterlagen. Man vergleicht den Ist-Zustand mit dem gewünschten Soll-Zustand.\n\nDer Auftraggeber schreibt das Lastenheft. Darin steht, was er will und wofür. Der Auftragnehmer schreibt das Pflichtenheft. Darin steht, wie und womit er die Anforderungen umsetzt. Eine Merkhilfe: Lastenheft = Was und Wofür. Pflichtenheft = Wie und Womit.\n\nAnforderungen teilt man in Muss-Kriterien und Kann-Kriterien ein. Muss-Kriterien müssen erfüllt sein. Kann-Kriterien sind wünschenswert. Man unterscheidet auch funktionale Anforderungen, also was das System tun soll, und nicht-funktionale Anforderungen, zum Beispiel Geschwindigkeit oder Sicherheit.',
        simple: 'Der Kunde schreibt den Wunschzettel. Das ist das Lastenheft. Du schreibst, wie du die Wünsche erfüllst. Das ist das Pflichtenheft.',
        check: {
          q: 'Wer erstellt das Pflichtenheft?',
          options: ['Der Auftraggeber', 'Der Auftragnehmer', 'Die IHK', 'Der Datenschutzbeauftragte'],
          correct: 1,
          explain: 'Der Auftragnehmer beschreibt im Pflichtenheft, wie er das Lastenheft umsetzt.',
        },
      },
      {
        title: 'Beschaffung, Kaufvertrag und Mängel',
        keys: ['beschaffung', 'angebot', 'anfrage', 'bestellung', 'kaufvertrag', 'mangel', 'mängelrüge', 'gewährleistung', 'garantie', 'nacherfüllung', 'rügepflicht', 'hgb', 'lieferverzug'],
        text:
          'Die Beschaffung läuft meist so ab: Anfrage an mehrere Lieferanten, Angebote vergleichen, bestellen, Ware prüfen, Rechnung prüfen und bezahlen. Ein Kaufvertrag entsteht durch zwei übereinstimmende Willenserklärungen, zum Beispiel ein Angebot und eine Bestellung.\n\nBei Geschäften zwischen zwei Unternehmen muss der Käufer die Ware unverzüglich prüfen und Mängel sofort melden. Das steht in § 377 HGB. Wer zu spät rügt, verliert seine Rechte bei offenen Mängeln.\n\nDie gesetzliche Gewährleistung dauert in der Regel zwei Jahre. Bei einem Mangel hat der Käufer zuerst Anspruch auf Nacherfüllung, also Reparatur oder Ersatz. Erst wenn das scheitert, kann er vom Vertrag zurücktreten, den Preis mindern oder Schadensersatz verlangen. Eine Garantie ist dagegen ein freiwilliges Versprechen des Herstellers oder Händlers.',
        simple:
          'Gewährleistung ist Pflicht vom Gesetz. Garantie ist ein freiwilliges Extra. Und als Firma musst du gelieferte Ware sofort prüfen.',
        check: {
          q: 'Was steht dem Käufer bei einem Mangel zuerst zu?',
          options: ['Sofortiger Rücktritt', 'Nacherfüllung', 'Schadensersatz', 'Kostenlose Garantieverlängerung'],
          correct: 1,
          explain: 'Der Verkäufer bekommt zuerst die Chance zur Nacherfüllung.',
        },
      },
      {
        title: 'Installation, Übergabe und Dokumentation',
        keys: ['installation', 'übergabe', 'abnahme', 'abnahmeprotokoll', 'übergabeprotokoll', 'einweisung', 'dokumentation', 'inventar', 'netzplan', 'checkliste', 'qualitätssicherung', 'pdca', 'test'],
        text:
          'Bei der Installation arbeitet man mit Checklisten. So vergisst man keinen Schritt. Nach der Installation testet man alles: Anmeldung, Netzwerk, Drucker, Programme und Datensicherung.\n\nBei der Übergabe weist man den Nutzer in den Arbeitsplatz ein. Man erklärt die wichtigsten Funktionen und wo er Hilfe bekommt. Das Ergebnis hält man in einem Abnahme- oder Übergabeprotokoll fest. Der Kunde unterschreibt, dass alles funktioniert. Ab der Abnahme beginnt oft die Gewährleistung.\n\nZur IT-Dokumentation gehören eine Inventarliste mit Seriennummern, ein Netzplan, die Konfiguration, Lizenznachweise und Anleitungen für Benutzer.\n\nQualitätssicherung kann man mit dem PDCA-Zyklus beschreiben: Plan, Do, Check, Act. Man plant, führt aus, prüft das Ergebnis und verbessert dann den Ablauf.',
        simple: 'Was nicht dokumentiert ist, ist nicht passiert. Und was der Kunde nicht unterschrieben hat, gilt nicht als abgenommen.',
        check: {
          q: 'Wofür steht PDCA?',
          options: ['Plan, Do, Check, Act', 'Prepare, Deploy, Control, Archive', 'Plan, Design, Code, Approve', 'Print, Document, Copy, Archive'],
          correct: 0,
          explain: 'Der Deming-Kreis: planen, umsetzen, überprüfen, verbessern.',
        },
      },
      {
        title: 'Service, Wartung und SLA',
        keys: ['service', 'wartung', 'sla', 'service level', 'reaktionszeit', 'verfügbarkeit', 'support', 'first level', 'second level', 'ticket', 'ticketsystem', 'incident', 'itil', 'eskalation', 'fernwartung', 'entsorgung'],
        text:
          'Ein Service Level Agreement, kurz SLA, ist eine Vereinbarung über die Qualität eines Service. Darin stehen zum Beispiel die Reaktionszeit, die Lösungszeit, die Servicezeiten und die Verfügbarkeit.\n\nEine Verfügbarkeit von 99,9 % klingt hoch. Sie erlaubt aber pro Jahr 0,1 % Ausfall. Das sind 8.760 Stunden × 0,001 = 8,76 Stunden.\n\nIm Support gibt es Stufen. Der First-Level-Support nimmt Anfragen an und löst einfache Probleme. Schwierige Fälle gehen an den Second Level mit Fachleuten. Der Third Level sind Spezialisten oder der Hersteller. Anfragen werden in einem Ticketsystem erfasst. So geht nichts verloren und man kann auswerten, welche Fehler oft vorkommen.\n\nWartung kann vorbeugend sein, also bevor etwas kaputtgeht. Oder sie ist korrigierend, also nach einem Fehler. Alte Geräte werden nach dem ElektroG entsorgt. Datenträger löscht oder vernichtet man vorher sicher, zum Beispiel nach DIN 66399.',
        simple:
          'Ein SLA ist ein Versprechen: Wir kümmern uns innerhalb von zum Beispiel 4 Stunden. Und das System läuft fast immer.',
        example:
          'Ein SLA verspricht 99,5 % Verfügbarkeit im Jahr. Erlaubt sind 8.760 × 0,005 = 43,8 Stunden Ausfall.',
        check: {
          q: 'Wie viele Stunden Ausfall pro Jahr erlaubt eine Verfügbarkeit von 99,9 %?',
          options: ['0,876 h', '8,76 h', '87,6 h', '99,9 h'],
          correct: 1,
          explain: '8.760 h × 0,1 % = 8,76 h.',
        },
      },
    ],
    widget: 'sla-calc',
    widgetTitle: 'SLA- und Verfügbarkeitsrechner',
    terms: [
      { term: 'Lastenheft', def: 'Anforderungen des Auftraggebers: Was und wofür.' },
      { term: 'Pflichtenheft', def: 'Umsetzungsplan des Auftragnehmers: Wie und womit.' },
      { term: 'Muss-Kriterium', def: 'Anforderung, die zwingend erfüllt werden muss.' },
      { term: 'Mängelrüge', def: 'Meldung eines Mangels an den Verkäufer. Bei Firmen unverzüglich (§ 377 HGB).' },
      { term: 'Gewährleistung', def: 'Gesetzliche Haftung des Verkäufers für Mängel, meist 2 Jahre.' },
      { term: 'Garantie', def: 'Freiwilliges Versprechen des Herstellers oder Händlers.' },
      { term: 'Abnahmeprotokoll', def: 'Dokument, in dem der Kunde die Leistung bestätigt.' },
      { term: 'SLA', def: 'Service Level Agreement. Vereinbarte Servicequalität.' },
      { term: 'Ticketsystem', def: 'Software zur Erfassung und Verfolgung von Supportanfragen.' },
      { term: 'First Level Support', def: 'Erste Anlaufstelle. Löst einfache Probleme oder leitet weiter.' },
      { term: 'PDCA', def: 'Plan, Do, Check, Act. Zyklus der Qualitätsverbesserung.' },
    ],
    formulas: ['Ausfallzeit = Gesamtzeit × (1 − Verfügbarkeit)', '1 Jahr = 8.760 Stunden (365 Tage)'],
    merksaetze: [
      'Lastenheft: Was und Wofür. Pflichtenheft: Wie und Womit.',
      'Erst Nacherfüllung, dann Rücktritt oder Minderung.',
      'Ohne Abnahmeprotokoll keine saubere Übergabe.',
    ],
    traps: [
      'Lasten- und Pflichtenheft vertauschen.',
      'Garantie und Gewährleistung gleichsetzen.',
      'Bei 99,9 % Verfügbarkeit mit 1 % statt 0,1 % rechnen.',
      'Datenträger ohne sichere Löschung entsorgen.',
    ],
    summary:
      'Der Bedarf wird ermittelt und im Lastenheft beschrieben, der Auftragnehmer antwortet mit dem Pflichtenheft. Bei der Beschaffung werden Angebote verglichen und Ware sofort geprüft. Installation, Einweisung und Abnahme werden dokumentiert. SLAs legen Reaktionszeiten und Verfügbarkeit fest, der Support arbeitet in Stufen mit einem Ticketsystem.',
  },
];

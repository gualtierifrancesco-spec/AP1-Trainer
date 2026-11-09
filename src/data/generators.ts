import type { Question, TopicId, Level } from '../types';
import { de, eur, int, pick, rng, round2, shuffle, type Rnd } from '../lib/util';
import { prefixToMask, subnetInfo, intToIp, ipToInt, shortenIpv6 } from '../lib/ip';

export interface Generator {
  id: string;
  topic: TopicId;
  level: Level;
  title: string;
  make: (r: Rnd, id: string) => Question;
}

const COMPANIES = ['Hoffmann Logistik GmbH', 'Praxis Dr. Yilmaz', 'Bäckerei Kranz KG', 'Steuerbüro Lange', 'Autohaus Becker', 'Schulz Maschinenbau AG', 'Kita Sonnenschein e. V.', 'Möbel Krüger OHG', 'Ingenieurbüro Pohl', 'Hotel Rheinblick'];

const N = (n: number, d = 2) => de(n, d);

/* ---------------- Subnetting ---------------- */

function randomPrivateIp(r: Rnd): string {
  const k = int(r, 0, 2);
  if (k === 0) return `10.${int(r, 0, 255)}.${int(r, 0, 255)}.${int(r, 1, 254)}`;
  if (k === 1) return `172.${int(r, 16, 31)}.${int(r, 0, 255)}.${int(r, 1, 254)}`;
  return `192.168.${int(r, 0, 255)}.${int(r, 1, 254)}`;
}

const snNet: Generator = {
  id: 'g-sn-net', topic: 'subnetting', level: 2, title: 'Netz- und Broadcast-Adresse bestimmen',
  make: (r, id) => {
    const prefix = pick(r, [20, 21, 22, 23, 25, 26, 27, 28, 29]);
    let ip = randomPrivateIp(r);
    let s = subnetInfo(ip, prefix);
    // Host darf nicht Netz- oder Broadcastadresse sein
    while (ip === s.network || ip === s.broadcast) { ip = randomPrivateIp(r); s = subnetInfo(ip, prefix); }
    const oct = Math.min(4, Math.floor(prefix / 8) + 1);
    const ipOct = Number(ip.split('.')[oct - 1]);
    return {
      id, topic: 'subnetting', level: prefix < 24 ? 3 : 2, points: 6, type: 'calc', generated: true,
      scenario: `Bei der ${pick(r, COMPANIES)} bekommt ein neuer Arbeitsplatz die Adresse ${ip}/${prefix}.`,
      question: `Bestimme für ${ip}/${prefix} die Subnetzmaske, die Netzadresse, die Broadcast-Adresse und die Anzahl nutzbarer Hosts.`,
      fields: [
        { label: 'Subnetzmaske', answer: s.mask },
        { label: 'Netzadresse', answer: s.network },
        { label: 'Broadcast-Adresse', answer: s.broadcast },
        { label: 'Nutzbare Hosts', answer: s.hosts, tolerance: 0 },
      ],
      steps: [
        `Hostbits: 32 − ${prefix} = ${32 - prefix}.`,
        `Interessantes Oktett: das ${oct}. Oktett. Maske: ${s.mask}.`,
        `Blockgröße: 256 − ${s.mask.split('.')[oct - 1]} = ${s.block}.`,
        `${ipOct} liegt im Block ab ${Number(s.network.split('.')[oct - 1])} → Netzadresse ${s.network}.`,
        `Nächster Block minus 1 → Broadcast ${s.broadcast}.`,
        `Hosts: 2^${32 - prefix} − 2 = ${s.hosts}. Bereich ${s.first} bis ${s.last}.`,
      ],
      hints: ['Wie viele Bit bleiben für die Hosts übrig?', 'Rechne die Blockgröße: 256 minus Maskenwert im interessanten Oktett.', 'In welchem Block liegt die Zahl im interessanten Oktett?'],
      explanation: 'Mit der Blockgröße findest du die Netzgrenzen ohne Binärrechnung. Die Oktette hinter dem interessanten Oktett sind bei der Netzadresse 0 und beim Broadcast 255.',
    };
  },
};

const snHosts: Generator = {
  id: 'g-sn-hosts', topic: 'subnetting', level: 1, title: 'Hosts pro Präfix',
  make: (r, id) => {
    const p = int(r, 19, 30);
    const h = 2 ** (32 - p) - 2;
    return {
      id, topic: 'subnetting', level: 1, points: 3, type: 'calc', generated: true,
      question: `Wie viele Hosts können in einem /${p}-Netz adressiert werden? Gib außerdem die Subnetzmaske an.`,
      fields: [{ label: 'Hosts', answer: h, tolerance: 0 }, { label: 'Subnetzmaske', answer: prefixToMask(p) }],
      steps: [`Hostbits: 32 − ${p} = ${32 - p}`, `2^${32 - p} = ${2 ** (32 - p)}`, `minus Netz- und Broadcast-Adresse: ${h}`, `Maske: ${p} Einsen → ${prefixToMask(p)}`],
      hints: ['Wie viele Bit sind für Hosts übrig?', 'Denk an die zwei Adressen, die nicht vergeben werden dürfen.'],
      explanation: 'Die Formel lautet 2^(32 − Präfix) − 2.',
    };
  },
};

const snNeed: Generator = {
  id: 'g-sn-need', topic: 'subnetting', level: 2, title: 'Präfix für Hostanzahl',
  make: (r, id) => {
    const need = int(r, 5, 900);
    let hb = 2;
    while (2 ** hb - 2 < need) hb++;
    const p = 32 - hb;
    const dept = pick(r, ['Buchhaltung', 'Produktion', 'Vertrieb', 'Lager', 'Entwicklung', 'Gäste-WLAN', 'Kundendienst']);
    return {
      id, topic: 'subnetting', level: 2, points: 4, type: 'calc', generated: true,
      question: `Die Abteilung ${dept} braucht ${need} IP-Adressen für Geräte. Welches ist das größte Präfix (kleinste Netz), das ausreicht, und wie viele Hosts bietet es?`,
      fields: [{ label: 'Präfix', answer: `/${p}` }, { label: 'Nutzbare Hosts', answer: 2 ** hb - 2, tolerance: 0 }],
      steps: [`Gesucht: kleinstes n mit 2^n − 2 ≥ ${need}`, `2^${hb - 1} − 2 = ${2 ** (hb - 1) - 2} → zu klein`, `2^${hb} − 2 = ${2 ** hb - 2} → passt`, `Präfix: 32 − ${hb} = /${p}`],
      hints: ['Probiere Zweierpotenzen: 64, 128, 256 …', 'Zieh von jeder Zweierpotenz 2 ab.'],
      explanation: 'Wähle die kleinste Zweierpotenz, die nach Abzug von 2 Adressen noch genug Platz bietet.',
    };
  },
};

const snSplit: Generator = {
  id: 'g-sn-split', topic: 'subnetting', level: 3, title: 'Netz in Subnetze aufteilen',
  make: (r, id) => {
    const base = pick(r, [24, 24, 23, 22]);
    const bits = pick(r, [1, 2, 3, 4]);
    const count = 2 ** bits;
    const np = base + bits;
    const blockOct = 2 ** (24 - base);
    const third = int(r, 0, 256 / blockOct - 1) * blockOct;
    const baseIp = base === 24 ? `192.168.${int(r, 0, 254)}.0` : `10.${int(r, 0, 255)}.${third}.0`;
    const k = int(r, 2, count);
    const size = 2 ** (32 - np);
    const nth = intToIp((ipToInt(baseIp) + (k - 1) * size) >>> 0);
    const s = subnetInfo(nth, np);
    return {
      id, topic: 'subnetting', level: 3, points: 8, type: 'calc', generated: true,
      scenario: `Die ${pick(r, COMPANIES)} möchte das Netz ${baseIp}/${base} in ${count} gleich große Subnetze aufteilen.`,
      question: `Bestimme das neue Präfix, die Hosts pro Subnetz sowie Netz- und Broadcast-Adresse des ${k}. Subnetzes.`,
      fields: [
        { label: 'Neues Präfix', answer: `/${np}` },
        { label: 'Hosts pro Subnetz', answer: size - 2, tolerance: 0 },
        { label: `Netzadresse ${k}. Subnetz`, answer: s.network },
        { label: `Broadcast ${k}. Subnetz`, answer: s.broadcast },
      ],
      steps: [
        `${count} Subnetze = 2^${bits} → ${bits} Bit leihen`,
        `Neues Präfix: ${base} + ${bits} = /${np}`,
        `Adressen pro Subnetz: 2^${32 - np} = ${size}, Hosts ${size - 2}`,
        `${k}. Subnetz beginnt bei ${baseIp} + ${k - 1} × ${size} = ${s.network}`,
        `Broadcast: ${s.broadcast}`,
      ],
      hints: ['Wie viele Bit brauchst du für die gewünschte Anzahl Subnetze?', 'Das erste Subnetz beginnt bei der ursprünglichen Netzadresse.'],
      explanation: 'Jedes geliehene Bit verdoppelt die Zahl der Subnetze und halbiert ihre Größe.',
    };
  },
};

const snSame: Generator = {
  id: 'g-sn-same', topic: 'subnetting', level: 2, title: 'Gleiches Netz?',
  make: (r, id) => {
    const p = pick(r, [25, 26, 27, 28, 29]);
    const o3 = int(r, 0, 254);
    let a = int(r, 1, 250);
    const same = r() < 0.5;
    const block = 2 ** (32 - p);
    const startA = Math.floor(a / block) * block;
    a = startA + 1 + int(r, 0, block - 3);
    const other = same ? startA : startA + block <= 248 ? startA + block : startA - block;
    let b = other + 1 + int(r, 0, block - 3);
    if (b === a) b = b + 1 < other + block - 1 ? b + 1 : b - 1;
    const ipA = `192.168.${o3}.${a}`, ipB = `192.168.${o3}.${b}`;
    const sa = subnetInfo(ipA, p), sb = subnetInfo(ipB, p);
    const isSame = sa.network === sb.network;
    return {
      id, topic: 'subnetting', level: 2, points: 3, type: 'mc', generated: true,
      question: `PC 1 hat ${ipA}/${p}, PC 2 hat ${ipB}/${p}. Befinden sich beide im selben Subnetz?`,
      options: [`Ja, beide liegen in ${sa.network}/${p}`, `Nein, PC 1 liegt in ${sa.network}/${p}, PC 2 in ${sb.network}/${p}`, 'Ja, weil beide mit 192.168 beginnen', 'Das lässt sich ohne Gateway nicht sagen'],
      correct: isSame ? 0 : 1,
      hints: [`Blockgröße bei /${p}: 256 − ${sa.mask.split('.')[3]} = ${block}.`],
      explanation: `Bei /${p} ist die Blockgröße ${block}. ${a} gehört zum Block ab ${sa.network.split('.')[3]}, ${b} zum Block ab ${sb.network.split('.')[3]}. ${isSame ? 'Gleiche Netzadresse, also gleiches Netz.' : 'Verschiedene Netzadressen, also braucht es einen Router.'}`,
    };
  },
};

const ipv6: Generator = {
  id: 'g-ipv6', topic: 'subnetting', level: 2, title: 'IPv6-Adresse kürzen',
  make: (r, id) => {
    const hex = () => int(r, 0, 65535).toString(16).padStart(4, '0');
    const blocks = Array.from({ length: 8 }, () => (r() < 0.45 ? '0000' : hex()));
    blocks[0] = pick(r, ['2001', '2a02', 'fd00', 'fe80']);
    const zs = int(r, 2, 5);
    const zl = int(r, 2, 3);
    for (let i = zs; i < Math.min(8, zs + zl); i++) blocks[i] = '0000';
    const full = blocks.join(':');
    const right = shortenIpv6(full);
    const wrong1 = right.includes('::') ? right.replace('::', ':0:').replace(/^:/, '') : right + '::';
    const wrong2 = blocks.map((b) => b.replace(/0+$/, '') || '0').join(':');
    const wrong3 = right.replace(/::/, '::0::');
    const opts = shuffle(r, Array.from(new Set([right, wrong1, wrong2, wrong3])));
    return {
      id, topic: 'subnetting', level: 2, points: 3, type: 'mc', generated: true,
      question: `Wie lautet die korrekt gekürzte Schreibweise von ${full}?`,
      options: opts, correct: opts.indexOf(right),
      hints: ['Nur führende Nullen eines Blocks dürfen weg, nie Nullen am Ende.', ':: darf nur einmal vorkommen.'],
      explanation: `Richtig ist ${right}. Führende Nullen pro Block entfallen, und die längste Folge von Null-Blöcken wird einmal durch :: ersetzt.`,
    };
  },
};

/* ---------------- Hardware ---------------- */

const transfer: Generator = {
  id: 'g-transfer', topic: 'hardware', level: 2, title: 'Übertragungsdauer',
  make: (r, id) => {
    const gb = pick(r, [1.2, 2.5, 4, 8, 12, 25, 40, 60]);
    const rate = pick(r, [16, 50, 100, 250, 500, 1000]);
    const sec = (gb * 1000 * 8) / rate;
    const min = sec / 60;
    return {
      id, topic: 'hardware', level: 2, points: 4, type: 'calc', generated: true,
      scenario: `Ein Backup von ${N(gb, gb % 1 ? 1 : 0)} GB soll über eine Leitung mit ${rate} Mbit/s an einen externen Speicher übertragen werden.`,
      question: 'Berechne die Übertragungsdauer in Sekunden und in Minuten (dezimal, 1 GB = 1.000 MB, ohne Protokoll-Overhead, auf 2 Nachkommastellen).',
      fields: [{ label: 'Dauer', answer: round2(sec), unit: 's', tolerance: 0.6 }, { label: 'Dauer', answer: round2(min), unit: 'min', tolerance: 0.02 }],
      steps: [`${N(gb, gb % 1 ? 1 : 0)} GB = ${N(gb * 1000, 0)} MB`, `× 8 = ${N(gb * 8000, 0)} Mbit`, `÷ ${rate} Mbit/s = ${N(sec)} s`, `÷ 60 = ${N(min)} min`],
      hints: ['Leitungen messen in Bit, Dateien in Byte.', 'Welcher Faktor liegt zwischen Byte und Bit?'],
      explanation: 'Datenmenge in Bit geteilt durch Datenrate in Bit pro Sekunde ergibt die Zeit in Sekunden.',
    };
  },
};

const image: Generator = {
  id: 'g-image', topic: 'hardware', level: 2, title: 'Bildspeicherbedarf',
  make: (r, id) => {
    const [w, h] = pick(r, [[1920, 1080], [2560, 1440], [3840, 2160], [4000, 3000], [6000, 4000], [1280, 1024]] as const);
    const depth = pick(r, [8, 16, 24, 32]);
    const bytes = (w * h * depth) / 8;
    const mib = bytes / 1048576;
    return {
      id, topic: 'hardware', level: 2, points: 4, type: 'calc', generated: true,
      question: `Ein unkomprimiertes Bild hat ${w} × ${h} Pixel und ${depth} Bit Farbtiefe. Wie groß ist es in Byte und in MiB (auf 2 Nachkommastellen)?`,
      fields: [{ label: 'Größe', answer: bytes, unit: 'Byte', tolerance: 0.5 }, { label: 'Größe', answer: round2(mib), unit: 'MiB', tolerance: 0.011 }],
      steps: [`Pixel: ${w} × ${h} = ${N(w * h, 0)}`, `Bit: × ${depth} = ${N(w * h * depth, 0)} Bit`, `Byte: ÷ 8 = ${N(bytes, 0)} Byte`, `MiB: ÷ 1.048.576 = ${N(mib)} MiB`],
      hints: ['Erst alle Pixel zählen, dann mit der Farbtiefe multiplizieren.', '1 MiB = 1.024 × 1.024 Byte.'],
      explanation: 'MiB ist die binäre Einheit. Für MB (dezimal) teilt man durch 1.000.000.',
    };
  },
};

const power: Generator = {
  id: 'g-power', topic: 'hardware', level: 2, title: 'Stromkosten',
  make: (r, id) => {
    const n = int(r, 4, 30);
    const w = pick(r, [35, 45, 55, 65, 80, 95, 120]);
    const h = pick(r, [6, 8, 9, 10]);
    const d = pick(r, [200, 220, 230, 250]);
    const price = pick(r, [0.28, 0.3, 0.32, 0.35, 0.38]);
    const kwh = (n * w * h * d) / 1000;
    const cost = kwh * price;
    return {
      id, topic: 'hardware', level: 2, points: 4, type: 'calc', generated: true,
      scenario: `Die ${pick(r, COMPANIES)} betreibt ${n} Arbeitsplatz-PCs mit durchschnittlich ${w} W, ${h} Stunden täglich an ${d} Tagen im Jahr. Strompreis: ${N(price)} €/kWh.`,
      question: 'Berechne den jährlichen Energieverbrauch in kWh und die Stromkosten.',
      fields: [{ label: 'Energie', answer: round2(kwh), unit: 'kWh', tolerance: 0.06 }, { label: 'Kosten', answer: round2(cost), unit: '€', tolerance: 0.02 }],
      steps: [`Gesamtleistung: ${n} × ${w} W = ${N(n * w, 0)} W`, `Stunden: ${h} × ${d} = ${N(h * d, 0)} h`, `Energie: ${N(n * w, 0)} W × ${N(h * d, 0)} h = ${N(n * w * h * d, 0)} Wh = ${N(kwh)} kWh`, `Kosten: ${N(kwh)} × ${N(price)} € = ${eur(round2(cost))}`],
      hints: ['Watt mal Stunden ergibt Wattstunden.', 'Wie kommst du von Wh zu kWh?'],
      explanation: 'Energie = Leistung × Zeit. Kosten = kWh × Preis.',
    };
  },
};

const raid: Generator = {
  id: 'g-raid', topic: 'hardware', level: 2, title: 'RAID-Kapazität',
  make: (r, id) => {
    const lvl = pick(r, [0, 1, 5, 6, 10]);
    const disks = lvl === 1 ? 2 : lvl === 10 ? pick(r, [4, 6, 8]) : lvl === 6 ? int(r, 4, 8) : lvl === 5 ? int(r, 3, 8) : int(r, 2, 4);
    const size = pick(r, [1, 2, 4, 8, 12, 16]);
    const usable = lvl === 0 ? disks * size : lvl === 1 ? size : lvl === 5 ? (disks - 1) * size : lvl === 6 ? (disks - 2) * size : (disks / 2) * size;
    const fail = lvl === 0 ? 0 : lvl === 1 ? 1 : lvl === 5 ? 1 : lvl === 6 ? 2 : 1;
    return {
      id, topic: 'hardware', level: 2, points: 4, type: 'calc', generated: true,
      question: `Ein NAS hat ${disks} Festplatten mit je ${size} TB im RAID ${lvl}. Wie viel Speicher ist nutzbar, und wie viele Platten dürfen höchstens ausfallen, ohne dass Daten verloren gehen (garantiert)?`,
      fields: [{ label: 'Nutzbar', answer: usable, unit: 'TB', tolerance: 0 }, { label: 'Ausfall erlaubt', answer: fail, unit: 'Platte(n)', tolerance: 0 }],
      steps: [
        lvl === 0 ? 'RAID 0: alle Platten addieren, keine Redundanz' : lvl === 1 ? 'RAID 1: Spiegelung, nutzbar ist eine Platte' : lvl === 5 ? 'RAID 5: (n − 1) × Größe' : lvl === 6 ? 'RAID 6: (n − 2) × Größe' : 'RAID 10: n ÷ 2 × Größe',
        `Ergebnis: ${usable} TB`,
        `Garantiert verkraftbare Ausfälle: ${fail}${lvl === 10 ? ' (Glücksfall: eine je Spiegelpaar)' : ''}`,
      ],
      hints: ['Wie viel Platz kostet die Redundanz bei diesem Level?'],
      explanation: 'Redundanz kostet Kapazität. RAID ersetzt trotzdem kein Backup.',
    };
  },
};

const units: Generator = {
  id: 'g-units', topic: 'hardware', level: 1, title: 'Einheiten umrechnen',
  make: (r, id) => {
    const tb = pick(r, [0.5, 1, 2, 4, 8]);
    const gib = (tb * 1e12) / 2 ** 30;
    return {
      id, topic: 'hardware', level: 1, points: 3, type: 'calc', generated: true,
      question: `Ein Hersteller verkauft eine SSD mit ${N(tb, tb % 1 ? 1 : 0)} TB (dezimal). Wie viele GiB zeigt das Betriebssystem ungefähr an? (auf 2 Nachkommastellen)`,
      fields: [{ label: 'Anzeige', answer: round2(gib), unit: 'GiB', tolerance: 0.02 }],
      steps: [`${N(tb, tb % 1 ? 1 : 0)} TB = ${N(tb * 1e12, 0)} Byte`, `1 GiB = 2^30 = 1.073.741.824 Byte`, `${N(tb * 1e12, 0)} ÷ 1.073.741.824 = ${N(gib)} GiB`],
      hints: ['Erst in Byte umrechnen.', 'Ein GiB hat 1.024³ Byte.'],
      explanation: 'Die Platte ist nicht kleiner. Nur die Einheit ist anders.',
    };
  },
};

const psu: Generator = {
  id: 'g-psu', topic: 'hardware', level: 2, title: 'Netzteil-Wirkungsgrad',
  make: (r, id) => {
    const out = pick(r, [180, 240, 300, 360, 450, 540]);
    const eta = pick(r, [0.8, 0.85, 0.88, 0.9, 0.92, 0.94]);
    const inp = out / eta;
    return {
      id, topic: 'hardware', level: 2, points: 4, type: 'calc', generated: true,
      question: `Ein Netzteil liefert ${out} W an die Komponenten. Der Wirkungsgrad beträgt ${N(eta * 100, 0)} %. Wie hoch ist die Aufnahmeleistung, und wie viel Verlustleistung entsteht? (auf 2 Nachkommastellen)`,
      fields: [{ label: 'Aufnahme', answer: round2(inp), unit: 'W', tolerance: 0.02 }, { label: 'Verlust', answer: round2(inp - out), unit: 'W', tolerance: 0.02 }],
      steps: [`Aufnahme = Abgabe ÷ η = ${out} ÷ ${N(eta)} = ${N(inp)} W`, `Verlust = ${N(inp)} − ${out} = ${N(inp - out)} W`],
      hints: ['Der Wirkungsgrad ist Abgabe geteilt durch Aufnahme.'],
      explanation: 'Die Verlustleistung wird zu Wärme im Netzteil.',
    };
  },
};

const printCost: Generator = {
  id: 'g-print', topic: 'hardware', level: 2, title: 'Druckkosten pro Seite',
  make: (r, id) => {
    const toner = pick(r, [59, 74, 89, 112, 139, 168]);
    const reach = pick(r, [2000, 2500, 3000, 5000, 8000, 10000]);
    const drum = pick(r, [0, 0, 79, 99]);
    const drumReach = drum ? pick(r, [12000, 20000, 30000]) : 0;
    const paper = pick(r, [0.6, 0.8, 1.0]);
    const cents = (toner / reach + (drum ? drum / drumReach : 0)) * 100 + paper;
    return {
      id, topic: 'hardware', level: 2, points: 4, type: 'calc', generated: true,
      question: `Toner: ${eur(toner)} für ${N(reach, 0)} Seiten.${drum ? ` Trommel: ${eur(drum)} für ${N(drumReach, 0)} Seiten.` : ''} Papier: ${N(paper, 1)} Cent pro Blatt. Wie hoch sind die Kosten pro Seite in Cent (2 Nachkommastellen)?`,
      fields: [{ label: 'Kosten pro Seite', answer: round2(cents), unit: 'Cent', tolerance: 0.011 }],
      steps: [`Toner: ${N(toner)} € ÷ ${N(reach, 0)} = ${N((toner / reach) * 100, 4)} Cent`, ...(drum ? [`Trommel: ${N(drum)} € ÷ ${N(drumReach, 0)} = ${N((drum / drumReach) * 100, 4)} Cent`] : []), `Papier: ${N(paper, 1)} Cent`, `Summe: ${N(cents)} Cent`],
      hints: ['Teile jeden Verbrauchsartikel durch seine Reichweite.'],
      explanation: 'Der Seitenpreis ist ein wichtiger Teil der TCO von Druckern.',
    };
  },
};

/* ---------------- Kaufmännisches Rechnen ---------------- */

const ust: Generator = {
  id: 'g-ust', topic: 'rechnen', level: 1, title: 'Brutto/Netto',
  make: (r, id) => {
    const net = pick(r, [120, 249, 389, 450, 799, 1150, 1349, 2490, 3200]) + pick(r, [0, 0.5, 0.9]);
    const dir = r() < 0.5;
    const tax = round2(net * 0.19);
    const gross = round2(net + tax);
    const item = pick(r, ['Monitor', 'Notebook', 'Drucker', 'Dockingstation', 'Switch', 'Server', 'Firewall-Appliance']);
    return dir
      ? {
          id, topic: 'rechnen', level: 1, points: 3, type: 'calc', generated: true,
          question: `Ein ${item} kostet ${eur(net)} netto. Berechne die Umsatzsteuer (19 %) und den Bruttopreis.`,
          fields: [{ label: 'Umsatzsteuer', answer: tax, unit: '€' }, { label: 'Brutto', answer: gross, unit: '€' }],
          steps: [`USt: ${N(net)} € × 0,19 = ${N(tax)} €`, `Brutto: ${N(net)} € + ${N(tax)} € = ${N(gross)} €`],
          hints: ['Netto ist 100 %.'],
          explanation: 'Netto × 1,19 ergibt direkt den Bruttopreis.',
        }
      : {
          id, topic: 'rechnen', level: 2, points: 3, type: 'calc', generated: true,
          question: `Ein ${item} kostet ${eur(gross)} brutto inklusive 19 % USt. Wie hoch sind Nettopreis und Umsatzsteuer?`,
          fields: [{ label: 'Netto', answer: round2(gross / 1.19), unit: '€' }, { label: 'Umsatzsteuer', answer: round2(gross - gross / 1.19), unit: '€' }],
          steps: [`Brutto = 119 %`, `Netto: ${N(gross)} € ÷ 1,19 = ${N(gross / 1.19)} €`, `USt: ${N(gross)} € − ${N(gross / 1.19)} € = ${N(gross - gross / 1.19)} €`],
          hints: ['Brutto entspricht nicht 100 %.', 'Durch welchen Faktor musst du teilen?'],
          explanation: 'Falle: Wer 19 % vom Bruttopreis abzieht, rechnet falsch.',
        };
  },
};

const bezug: Generator = {
  id: 'g-bezug', topic: 'rechnen', level: 2, title: 'Bezugskalkulation',
  make: (r, id) => {
    const qty = pick(r, [5, 8, 10, 12, 15, 20, 25]);
    const unit = pick(r, [89, 129, 179, 239, 349, 549, 899]);
    const rab = pick(r, [0, 3, 5, 8, 10, 12, 15]);
    const sko = pick(r, [0, 1, 2, 3]);
    const fr = pick(r, [0, 9.9, 14.9, 24.5, 39, 59]);
    const item = pick(r, ['Monitore', 'Notebooks', 'Headsets', 'Dockingstations', 'Thin Clients', 'Etikettendrucker']);
    const list = qty * unit;
    const rabA = round2(list * rab / 100);
    const ziel = round2(list - rabA);
    const skoA = round2(ziel * sko / 100);
    const bar = round2(ziel - skoA);
    const bez = round2(bar + fr);
    return {
      id, topic: 'rechnen', level: 2, points: 6, type: 'calc', generated: true,
      scenario: `Die ${pick(r, COMPANIES)} bestellt ${qty} ${item} zu je ${eur(unit)} netto. Der Lieferant gewährt ${rab} % Rabatt und ${sko} % Skonto. Die Versandkosten betragen ${eur(fr)}.`,
      question: 'Berechne Zieleinkaufspreis, Bareinkaufspreis und Bezugspreis.',
      fields: [{ label: 'Zieleinkaufspreis', answer: ziel, unit: '€' }, { label: 'Bareinkaufspreis', answer: bar, unit: '€' }, { label: 'Bezugspreis', answer: bez, unit: '€' }],
      steps: [`Listenpreis: ${qty} × ${N(unit)} € = ${N(list)} €`, `− ${rab} % Rabatt (${N(rabA)} €) = ${N(ziel)} €`, `− ${sko} % Skonto vom Ziel-EK (${N(skoA)} €) = ${N(bar)} €`, `+ Bezugskosten ${N(fr)} € = ${N(bez)} €`],
      hints: ['Reihenfolge: Rabatt, Skonto, Bezugskosten.', 'Skonto bezieht sich auf den Zieleinkaufspreis.'],
      explanation: 'Die Bezugskalkulation ermittelt den tatsächlichen Einstandspreis.',
    };
  },
};

const dreisatz: Generator = {
  id: 'g-dreisatz', topic: 'rechnen', level: 1, title: 'Dreisatz',
  make: (r, id) => {
    const anti = r() < 0.5;
    if (anti) {
      const t1 = int(r, 2, 6), d1 = pick(r, [4, 6, 8, 10, 12, 15]), t2 = int(r, t1 + 1, t1 + 5);
      const d2 = (t1 * d1) / t2;
      return {
        id, topic: 'rechnen', level: 2, points: 3, type: 'calc', generated: true,
        question: `${t1} Techniker brauchen ${d1} Tage, um alle Arbeitsplätze umzustellen. Wie viele Tage brauchen ${t2} Techniker bei gleicher Leistung? (2 Nachkommastellen)`,
        fields: [{ label: 'Tage', answer: round2(d2), unit: 'Tage' }],
        steps: ['Antiproportional: mehr Techniker → weniger Tage', `1 Techniker: ${t1} × ${d1} = ${t1 * d1} Tage`, `${t2} Techniker: ${t1 * d1} ÷ ${t2} = ${N(d2)} Tage`],
        hints: ['Werden es mehr oder weniger Tage, wenn mehr Leute arbeiten?'],
        explanation: 'Beim antiproportionalen Dreisatz multiplizierst du zuerst und teilst dann.',
      };
    }
    const q1 = int(r, 3, 12), p1 = q1 * pick(r, [19.9, 34.5, 49, 89.5, 129]), q2 = int(r, 13, 40);
    const p2 = (p1 / q1) * q2;
    const what = pick(r, ['Software-Lizenzen', 'Patchkabel-Sets', 'USB-Headsets', 'Tastatur-Maus-Sets']);
    return {
      id, topic: 'rechnen', level: 1, points: 3, type: 'calc', generated: true,
      question: `${q1} ${what} kosten ${eur(p1)}. Wie viel kosten ${q2} Stück zum gleichen Preis?`,
      fields: [{ label: 'Preis', answer: round2(p2), unit: '€' }],
      steps: [`1 Stück: ${N(p1)} € ÷ ${q1} = ${N(p1 / q1)} €`, `${q2} Stück: ${N(p1 / q1)} € × ${q2} = ${N(p2)} €`],
      hints: ['Was kostet ein Stück?'],
      explanation: 'Proportionaler Dreisatz: erst durch, dann mal.',
    };
  },
};

const prozent: Generator = {
  id: 'g-prozent', topic: 'rechnen', level: 1, title: 'Prozentuale Veränderung',
  make: (r, id) => {
    const old = pick(r, [800, 1200, 1500, 2400, 3600, 4800, 6000]);
    const pct = pick(r, [5, 8, 10, 12, 15, 20, 25]);
    const up = r() < 0.5;
    const nw = up ? old * (1 + pct / 100) : old * (1 - pct / 100);
    return {
      id, topic: 'rechnen', level: 1, points: 3, type: 'calc', generated: true,
      question: `Die jährlichen Wartungskosten ${up ? 'steigen' : 'sinken'} von ${eur(old)} auf ${eur(nw)}. Um wie viel Prozent haben sie sich verändert?`,
      fields: [{ label: 'Veränderung', answer: pct, unit: '%' }],
      steps: [`Differenz: ${N(Math.abs(nw - old))} €`, `÷ alter Wert ${N(old)} € × 100 = ${pct} %`],
      hints: ['Der alte Wert ist der Grundwert.'],
      explanation: 'Veränderungen beziehen sich immer auf den Ausgangswert.',
    };
  },
};

const skontoBack: Generator = {
  id: 'g-grundwert', topic: 'rechnen', level: 2, title: 'Verminderter Grundwert',
  make: (r, id) => {
    const base = pick(r, [600, 950, 1250, 1800, 2400, 3150, 4200]);
    const pct = pick(r, [2, 3, 5, 10]);
    const paid = round2(base * (1 - pct / 100));
    return {
      id, topic: 'rechnen', level: 2, points: 3, type: 'calc', generated: true,
      question: `Nach Abzug von ${pct} % Skonto überweist ein Kunde ${eur(paid)}. Wie hoch war der Rechnungsbetrag vor Abzug?`,
      fields: [{ label: 'Rechnungsbetrag', answer: base, unit: '€' }],
      steps: [`${N(paid)} € entsprechen ${100 - pct} %`, `1 % = ${N(paid)} € ÷ ${100 - pct} = ${N(paid / (100 - pct))} €`, `100 % = ${N(base)} €`],
      hints: ['Wie viel Prozent sind die überwiesenen Euro?'],
      explanation: 'Falle: Wer einfach den Prozentsatz wieder aufschlägt, rechnet falsch.',
    };
  },
};

/* ---------------- Wirtschaftlichkeit ---------------- */

const tco: Generator = {
  id: 'g-tco', topic: 'wirtschaftlichkeit', level: 3, title: 'TCO-Vergleich',
  make: (r, id) => {
    const years = pick(r, [3, 4, 5]);
    const aA = pick(r, [649, 729, 799]), aB = pick(r, [899, 999, 1099]);
    const wA = pick(r, [35, 45, 55]), wB = pick(r, [18, 22, 28]);
    const sA = pick(r, [90, 110, 140]), sB = pick(r, [40, 60, 80]);
    const hours = pick(r, [1800, 2000, 2200]);
    const price = pick(r, [0.3, 0.32, 0.35]);
    const eA = round2((wA * hours) / 1000 * price), eB = round2((wB * hours) / 1000 * price);
    const tA = round2(aA + years * (eA + sA)), tB = round2(aB + years * (eB + sB));
    return {
      id, topic: 'wirtschaftlichkeit', level: 3, points: 6, type: 'calc', generated: true,
      scenario: `Für ${pick(r, COMPANIES)} vergleichst du zwei Thin-Client-Modelle über ${years} Jahre. Betriebsstunden pro Jahr: ${N(hours, 0)} h, Strompreis ${N(price)} €/kWh.`,
      table: { caption: 'Angebotsdaten (netto)', headers: ['', 'Modell A', 'Modell B'], rows: [['Anschaffung', eur(aA), eur(aB)], ['Leistungsaufnahme', `${wA} W`, `${wB} W`], ['Wartung/Support pro Jahr', eur(sA), eur(sB)]] },
      question: 'Berechne die TCO beider Modelle über die gesamte Nutzungsdauer (je Gerät).',
      fields: [{ label: 'TCO Modell A', answer: tA, unit: '€', tolerance: 0.06 }, { label: 'TCO Modell B', answer: tB, unit: '€', tolerance: 0.06 }],
      steps: [`Strom A pro Jahr: ${wA} W × ${N(hours, 0)} h = ${N((wA * hours) / 1000, 1)} kWh × ${N(price)} € = ${N(eA)} €`, `Strom B pro Jahr: ${N((wB * hours) / 1000, 1)} kWh × ${N(price)} € = ${N(eB)} €`, `A: ${N(aA)} + ${years} × (${N(eA)} + ${N(sA)}) = ${N(tA)} €`, `B: ${N(aB)} + ${years} × (${N(eB)} + ${N(sB)}) = ${N(tB)} €`, tA < tB ? `Modell A ist um ${N(tB - tA)} € günstiger.` : `Modell B ist um ${N(tA - tB)} € günstiger.`],
      hints: ['Rechne zuerst die jährlichen Kosten je Modell.', 'Anschaffung einmal, laufende Kosten mal Jahre.'],
      explanation: 'Der TCO-Vergleich zeigt, ob sich eine höhere Anschaffung über niedrigere Betriebskosten lohnt.',
    };
  },
};

const krit: Generator = {
  id: 'g-krit', topic: 'wirtschaftlichkeit', level: 3, title: 'Kritische Menge',
  make: (r, id) => {
    const f1 = pick(r, [50, 80, 120, 150]), v1 = pick(r, [0.06, 0.07, 0.08, 0.09]);
    const f2 = f1 + pick(r, [150, 210, 240, 300, 360]), v2 = round2(v1 - pick(r, [0.02, 0.03, 0.04]));
    const k = (f2 - f1) / (v1 - v2);
    return {
      id, topic: 'wirtschaftlichkeit', level: 3, points: 4, type: 'calc', generated: true,
      question: `Kopiererangebot A: ${eur(f1)} Grundgebühr pro Monat und ${N(v1)} € pro Kopie. Angebot B: ${eur(f2)} Grundgebühr und ${N(v2)} € pro Kopie. Ab wie vielen Kopien pro Monat ist B günstiger? (Kritische Menge, auf ganze Kopien)`,
      fields: [{ label: 'Kritische Menge', answer: Math.round(k), unit: 'Kopien', tolerance: 1 }],
      steps: [`Fixkostendifferenz: ${N(f2)} − ${N(f1)} = ${N(f2 - f1)} €`, `Differenz variable Kosten: ${N(v1)} − ${N(v2)} = ${N(v1 - v2)} €`, `Kritische Menge: ${N(f2 - f1)} ÷ ${N(v1 - v2)} = ${N(k, 0)} Kopien`],
      hints: ['Setze beide Kostenfunktionen gleich.'],
      explanation: 'Unterhalb der kritischen Menge ist das Angebot mit niedrigen Fixkosten günstiger, darüber das mit niedrigen variablen Kosten.',
    };
  },
};

const leasing: Generator = {
  id: 'g-leasing', topic: 'wirtschaftlichkeit', level: 2, title: 'Leasing vs. Kauf',
  make: (r, id) => {
    const price = pick(r, [3600, 4800, 6200, 8900, 12500]);
    const months = pick(r, [24, 36, 48]);
    const factor = pick(r, [1.04, 1.08, 1.12, 1.15]);
    const sz = pick(r, [0, 0, 250, 500]);
    const rate = round2((price * factor - sz) / months);
    const total = round2(rate * months + sz);
    return {
      id, topic: 'wirtschaftlichkeit', level: 2, points: 4, type: 'calc', generated: true,
      question: `Ein Server kostet im Kauf ${eur(price)}. Leasing: ${months} Monate à ${eur(rate)}${sz ? ` plus Sonderzahlung ${eur(sz)}` : ''}. Wie hoch sind die Leasingkosten insgesamt und die Mehrkosten gegenüber dem Kauf?`,
      fields: [{ label: 'Leasing gesamt', answer: total, unit: '€' }, { label: 'Mehrkosten', answer: round2(total - price), unit: '€' }],
      steps: [`${months} × ${N(rate)} € = ${N(rate * months)} €`, ...(sz ? [`+ Sonderzahlung ${N(sz)} €`] : []), `Gesamt: ${N(total)} €`, `Mehrkosten: ${N(total)} − ${N(price)} = ${N(total - price)} €`],
      hints: ['Rate mal Laufzeit, Sonderzahlung nicht vergessen.'],
      explanation: 'Leasing ist meist teurer, schont aber die Liquidität.',
    };
  },
};

const afa: Generator = {
  id: 'g-afa', topic: 'wirtschaftlichkeit', level: 1, title: 'Lineare Abschreibung',
  make: (r, id) => {
    const ak = pick(r, [2400, 3600, 4500, 7200, 9600, 15000]);
    const nd = pick(r, [3, 4, 5, 6]);
    const y = int(r, 1, nd - 1);
    return {
      id, topic: 'wirtschaftlichkeit', level: 1, points: 3, type: 'calc', generated: true,
      question: `Eine IT-Anlage hat Anschaffungskosten von ${eur(ak)} und eine Nutzungsdauer von ${nd} Jahren (lineare Abschreibung). Wie hoch ist die jährliche AfA, und wie hoch ist der Restbuchwert nach ${y} Jahr(en)?`,
      fields: [{ label: 'AfA pro Jahr', answer: round2(ak / nd), unit: '€' }, { label: `Restbuchwert nach ${y} J.`, answer: round2(ak - (ak / nd) * y), unit: '€' }],
      steps: [`AfA: ${N(ak)} € ÷ ${nd} = ${N(ak / nd)} €`, `Restbuchwert: ${N(ak)} € − ${y} × ${N(ak / nd)} € = ${N(ak - (ak / nd) * y)} €`],
      hints: ['Die Kosten werden gleichmäßig verteilt.'],
      explanation: 'Linear bedeutet: jedes Jahr derselbe Betrag.',
    };
  },
};

const amort: Generator = {
  id: 'g-amort', topic: 'wirtschaftlichkeit', level: 2, title: 'Amortisationszeit',
  make: (r, id) => {
    const inv = pick(r, [6000, 9000, 12000, 18000, 24000]);
    const save = pick(r, [1500, 2000, 2400, 3000, 4000, 4800]);
    const t = inv / save;
    return {
      id, topic: 'wirtschaftlichkeit', level: 2, points: 3, type: 'calc', generated: true,
      question: `Eine Virtualisierungslösung kostet ${eur(inv)} und spart jährlich ${eur(save)} an Strom und Wartung. Nach wie vielen Jahren ist sie amortisiert? (2 Nachkommastellen)`,
      fields: [{ label: 'Amortisationszeit', answer: round2(t), unit: 'Jahre' }],
      steps: [`${N(inv)} € ÷ ${N(save)} € = ${N(t)} Jahre`],
      hints: ['Investition geteilt durch jährliche Ersparnis.'],
      explanation: 'Je kürzer die Amortisationszeit, desto schneller hat sich die Investition bezahlt gemacht.',
    };
  },
};

const nwa: Generator = {
  id: 'g-nwa', topic: 'wirtschaftlichkeit', level: 3, title: 'Nutzwertanalyse',
  make: (r, id) => {
    const crit = shuffle(r, ['Preis', 'Service', 'Lieferzeit', 'Energieeffizienz', 'Garantie', 'Bedienbarkeit']).slice(0, 3);
    const w = pick(r, [[50, 30, 20], [40, 35, 25], [45, 30, 25], [60, 25, 15], [30, 40, 30]]);
    const pa = crit.map(() => int(r, 3, 10)), pb = crit.map(() => int(r, 3, 10));
    const va = round2(pa.reduce((s, p, i) => s + p * w[i] / 100, 0));
    const vb = round2(pb.reduce((s, p, i) => s + p * w[i] / 100, 0));
    return {
      id, topic: 'wirtschaftlichkeit', level: 3, points: 5, type: 'calc', generated: true,
      question: 'Berechne die gewichteten Nutzwerte beider Angebote (Punkte 1 bis 10).',
      table: { caption: 'Nutzwertanalyse', headers: ['Kriterium', 'Gewicht', 'Angebot A', 'Angebot B'], rows: crit.map((c, i) => [c, `${w[i]} %`, pa[i], pb[i]]) },
      fields: [{ label: 'Nutzwert A', answer: va, tolerance: 0.006 }, { label: 'Nutzwert B', answer: vb, tolerance: 0.006 }],
      steps: [`A: ${crit.map((_, i) => `${pa[i]} × ${N(w[i] / 100)}`).join(' + ')} = ${N(va)}`, `B: ${crit.map((_, i) => `${pb[i]} × ${N(w[i] / 100)}`).join(' + ')} = ${N(vb)}`, va === vb ? 'Gleichstand.' : `${va > vb ? 'A' : 'B'} hat den höheren Nutzwert.`],
      hints: ['Multipliziere jede Punktzahl mit ihrem Gewicht.', 'Addiere die Ergebnisse je Angebot.'],
      explanation: 'Die Gewichtung spiegelt wider, wie wichtig ein Kriterium für den Kunden ist.',
    };
  },
};

/* ---------------- Projekt & Sicherheit ---------------- */

const sla: Generator = {
  id: 'g-sla', topic: 'projekt', level: 2, title: 'SLA-Ausfallzeit',
  make: (r, id) => {
    const v = pick(r, [99, 99.5, 99.8, 99.9, 99.95, 99.99]);
    const scope = pick(r, ['Jahr', 'Monat']);
    const hours = scope === 'Jahr' ? 8760 : 720;
    const down = hours * (1 - v / 100);
    return {
      id, topic: 'projekt', level: 2, points: 3, type: 'calc', generated: true,
      question: `Ein SLA garantiert ${N(v, v % 1 ? 2 : 0)} % Verfügbarkeit rund um die Uhr. Wie viele Minuten Ausfall sind pro ${scope} höchstens erlaubt (${scope === 'Jahr' ? '365 Tage' : '30 Tage'})? (auf ganze Minuten gerundet)`,
      fields: [{ label: 'Ausfall', answer: Math.round(down * 60), unit: 'min', tolerance: 1 }],
      steps: [`Stunden pro ${scope}: ${N(hours, 0)} h`, `Ausfallanteil: ${N(100 - v, 2)} %`, `${N(hours, 0)} h × ${N((100 - v) / 100, 4)} = ${N(down, 3)} h`, `× 60 = ${N(down * 60, 0)} min`],
      hints: ['Rechne mit dem Anteil, der NICHT verfügbar sein darf.'],
      explanation: 'Schon 0,1 % Unterschied bedeutet im Jahr fast 9 Stunden.',
    };
  },
};

const backup: Generator = {
  id: 'g-backup', topic: 'sicherheit', level: 2, title: 'Backup-Wiederherstellung',
  make: (r, id) => {
    const days = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
    const inc = r() < 0.5;
    const failIdx = int(r, 1, 5); // Ausfall am Morgen dieses Tages (vor dessen Sicherung)
    const needed = inc ? 1 + failIdx : failIdx >= 1 ? 2 : 1;
    return {
      id, topic: 'sicherheit', level: 2, points: 3, type: 'calc', generated: true,
      question: `Jeden Sonntagabend läuft eine Vollsicherung, an allen anderen Abenden eine ${inc ? 'inkrementelle' : 'differenzielle'} Sicherung. Am ${days[failIdx]}morgen fällt der Server aus. Wie viele Sicherungen brauchst du für die vollständige Wiederherstellung?`,
      fields: [{ label: 'Anzahl Sicherungen', answer: needed, tolerance: 0 }],
      steps: inc
        ? ['Vollsicherung Sonntag: 1', `Inkremente ${days.slice(0, failIdx).join(', ')}: ${failIdx}`, `Gesamt: ${needed}`]
        : ['Vollsicherung Sonntag: 1', `Letzte differenzielle Sicherung (${days[failIdx - 1]}): 1`, `Gesamt: ${needed}`],
      hints: ['Welche Änderungen enthält die letzte Sicherung?'],
      explanation: 'Inkrementell: Vollsicherung plus jedes Inkrement. Differenziell: Vollsicherung plus die letzte Differenzielle.',
    };
  },
};

const pwSpace: Generator = {
  id: 'g-pw', topic: 'sicherheit', level: 3, title: 'Passwort-Kombinationen',
  make: (r, id) => {
    const len = pick(r, [4, 5, 6, 8]);
    const set = pick(r, [[10, 'nur Ziffern'], [26, 'nur Kleinbuchstaben'], [36, 'Kleinbuchstaben und Ziffern'], [62, 'Groß-, Kleinbuchstaben und Ziffern']] as const);
    const comb = set[0] ** len;
    const speed = pick(r, [1e6, 1e8, 1e9]);
    const sec = comb / speed;
    return {
      id, topic: 'sicherheit', level: 3, points: 4, type: 'calc', generated: true,
      question: `Ein Passwort hat ${len} Stellen aus ${set[1]} (${set[0]} Zeichen). Wie viele Kombinationen gibt es, und wie viele Sekunden braucht ein Angreifer mit ${N(speed, 0)} Versuchen pro Sekunde maximal? (Sekunden auf 2 Nachkommastellen)`,
      fields: [{ label: 'Kombinationen', answer: comb, tolerance: 0.5 }, { label: 'Maximale Dauer', answer: round2(sec), unit: 's', tolerance: Math.max(0.011, sec * 0.0005) }],
      steps: [`Kombinationen = Zeichenanzahl ^ Länge = ${set[0]}^${len} = ${N(comb, 0)}`, `Zeit = ${N(comb, 0)} ÷ ${N(speed, 0)} = ${N(sec)} s`],
      hints: ['Jede Stelle hat gleich viele Möglichkeiten.'],
      explanation: 'Die Länge wirkt als Exponent. Darum bringen zusätzliche Stellen mehr als zusätzliche Zeichenarten.',
    };
  },
};

export const GENERATORS: Generator[] = [
  snNet, snHosts, snNeed, snSplit, snSame, ipv6,
  transfer, image, power, raid, units, psu, printCost,
  ust, bezug, dreisatz, prozent, skontoBack,
  tco, krit, leasing, afa, amort, nwa,
  sla, backup, pwSpace,
];

/** Feste Varianten je Generator, die zum Fragenpool zählen */
export const VARIANTS_PER_GENERATOR = 10;

export function generatorVariant(g: Generator, n: number): Question {
  const seed = [...g.id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) + n * 9973;
  return g.make(rng(seed), `${g.id}#${n}`);
}

export function freshGenerated(g: Generator, seed: number): Question {
  return g.make(rng(seed), `${g.id}@${seed}`);
}

import { useMemo, useState } from 'react';
import type { WidgetId } from '../data/topicTypes';
import { de, eur, int, parseNum, pick, rng, round2, shuffle } from '../lib/util';
import { isValidIp, subnetInfo, toBin8 } from '../lib/ip';
import { normIp } from '../lib/grading';

export function Widget({ id }: { id: WidgetId }) {
  switch (id) {
    case 'hardware-match': return <PairGame pairs={HW_PAIRS} leftTitle="Komponente" rightTitle="Aufgabe" />;
    case 'ergo-check': return <ErgoCheck />;
    case 'net-builder': return <NetBuilder />;
    case 'osi-explorer': return <OsiExplorer />;
    case 'subnet-trainer': return <SubnetTrainer />;
    case 'license-sort': return <ChoiceCases cases={LICENSE_CASES} options={LICENSE_OPTS} />;
    case 'phishing': return <Phishing />;
    case 'dsgvo-cases': return <ChoiceCases cases={DSGVO_CASES} options={['zulässig', 'nicht zulässig', 'nur mit Einwilligung']} />;
    case 'calc-stepper': return <CalcStepper />;
    case 'nwa': return <Nwa />;
    case 'sla-calc': return <SlaCalc />;
    case 'wiso-cases': return <ChoiceCases cases={WISO_CASES} options={['Krankenversicherung', 'Rentenversicherung', 'Arbeitslosenversicherung', 'Pflegeversicherung', 'Unfallversicherung']} />;
  }
}

/* ---------- Zuordnungsspiel ---------- */
const HW_PAIRS: [string, string][] = [
  ['CPU', 'Führt Befehle aus und rechnet'],
  ['RAM', 'Hält laufende Programme, flüchtig'],
  ['SSD (NVMe)', 'Speichert dauerhaft, sehr schnell'],
  ['Mainboard', 'Verbindet alle Komponenten'],
  ['Netzteil', 'Wandelt Wechsel- in Gleichstrom'],
  ['Grafikkarte', 'Berechnet und gibt Bilder aus'],
  ['UEFI', 'Startet den PC und prüft die Hardware'],
  ['Netzwerkkarte', 'Verbindet den PC mit dem LAN, hat eine MAC-Adresse'],
];

function PairGame({ pairs, leftTitle, rightTitle }: { pairs: [string, string][]; leftTitle: string; rightTitle: string }) {
  const [seed, setSeed] = useState(1);
  const rights = useMemo(() => shuffle(rng(seed * 97), pairs.map((p, i) => ({ t: p[1], i }))), [seed, pairs]);
  const [sel, setSel] = useState<number | null>(null);
  const [done, setDone] = useState<Set<number>>(new Set());
  const [wrong, setWrong] = useState<number | null>(null);
  const [tries, setTries] = useState(0);
  const pickRight = (i: number) => {
    if (sel === null) return;
    setTries((t) => t + 1);
    if (i === sel) { setDone(new Set(done).add(i)); setSel(null); }
    else { setWrong(i); setTimeout(() => setWrong(null), 600); }
  };
  const finished = done.size === pairs.length;
  return (
    <div className="stack">
      <p className="muted">Wähle links eine {leftTitle} und rechts die passende {rightTitle}.</p>
      <div className="grid g2">
        <div className="hw-board">
          {pairs.map(([l], i) => (
            <button key={i} className={`hw-item ${done.has(i) ? 'ok' : sel === i ? 'sel' : ''}`} disabled={done.has(i)} onClick={() => setSel(i)}>{l}</button>
          ))}
        </div>
        <div className="stack tight">
          {rights.map((r) => (
            <button key={r.i} className={`hw-item ${done.has(r.i) ? 'ok' : wrong === r.i ? 'shake' : ''}`} disabled={done.has(r.i) || sel === null} onClick={() => pickRight(r.i)}>{r.t}</button>
          ))}
        </div>
      </div>
      <div className="row between">
        <span className="small muted tnum">{done.size} von {pairs.length} richtig · {tries} Versuche</span>
        {finished && <span className="badge good">Geschafft! {tries === pairs.length ? 'Ohne Fehler.' : ''}</span>}
        <button className="btn sm" onClick={() => { setSeed(seed + 1); setDone(new Set()); setSel(null); setTries(0); }}>Neu mischen</button>
      </div>
    </div>
  );
}

/* ---------- Ergonomie-Check ---------- */
function ErgoCheck() {
  const [dist, setDist] = useState(45);
  const [height, setHeight] = useState('über Augenhöhe');
  const [win, setWin] = useState('vor dem Bildschirm');
  const [lux, setLux] = useState(300);
  const [chair, setChair] = useState(false);
  const [pause, setPause] = useState(false);
  const issues: string[] = [];
  if (dist < 50) issues.push(`Der Monitor steht mit ${dist} cm zu nah. Rück ihn auf 50 bis 80 cm zurück.`);
  if (dist > 80) issues.push(`Mit ${dist} cm ist der Monitor recht weit weg. Prüfe, ob die Schrift noch gut lesbar ist.`);
  if (height !== 'auf oder leicht unter Augenhöhe') issues.push('Stell den Monitor so ein, dass die oberste Zeile auf oder leicht unter Augenhöhe liegt.');
  if (win !== 'seitlich') issues.push('Dreh den Arbeitsplatz, sodass das Fenster seitlich liegt. So vermeidest du Blendung und Spiegelungen.');
  if (lux < 500) issues.push(`Mit ${lux} Lux ist es zu dunkel. Für Büroarbeit sind etwa 500 Lux vorgesehen.`);
  if (!chair) issues.push('Ein höhenverstellbarer Bürostuhl mit Lordosenstütze fehlt.');
  if (!pause) issues.push('Plane Pausen oder Tätigkeitswechsel ein. Das nennt man Mischarbeit.');
  return (
    <div className="stack">
      <p className="muted">Stell einen Arbeitsplatz ein und lass ihn prüfen.</p>
      <div className="grid g2">
        <div className="field"><label htmlFor="ergo-dist">Sehabstand: {dist} cm</label><input id="ergo-dist" type="range" min={25} max={110} value={dist} onChange={(e) => setDist(Number(e.target.value))} /></div>
        <div className="field"><label htmlFor="ergo-lux">Beleuchtung: {lux} Lux</label><input id="ergo-lux" type="range" min={100} max={1000} step={50} value={lux} onChange={(e) => setLux(Number(e.target.value))} /></div>
        <div className="field"><label htmlFor="ergo-h">Monitorhöhe (oberste Zeile)</label><select id="ergo-h" value={height} onChange={(e) => setHeight(e.target.value)}><option>über Augenhöhe</option><option>auf oder leicht unter Augenhöhe</option><option>deutlich unter Augenhöhe</option></select></div>
        <div className="field"><label htmlFor="ergo-w">Fenster liegt …</label><select id="ergo-w" value={win} onChange={(e) => setWin(e.target.value)}><option>vor dem Bildschirm</option><option>hinter dem Nutzer</option><option>seitlich</option></select></div>
      </div>
      <div className="row">
        <label className="row small"><input id="ergo-chair" type="checkbox" checked={chair} onChange={(e) => setChair(e.target.checked)} /> Höhenverstellbarer Bürostuhl</label>
        <label className="row small"><input id="ergo-pause" type="checkbox" checked={pause} onChange={(e) => setPause(e.target.checked)} /> Pausen und Tätigkeitswechsel geplant</label>
      </div>
      <div className={`feedback ${issues.length ? 'teilweise' : 'richtig'}`}>
        <h4>{issues.length ? `${issues.length} Verbesserung(en) nötig` : 'Dieser Arbeitsplatz erfüllt die wichtigsten Anforderungen.'}</h4>
        {issues.length > 0 && <p>{issues.join(' ')}</p>}
      </div>
    </div>
  );
}

/* ---------- Netzwerk zusammenstecken ---------- */
const NODES = [
  { id: 'inet', label: 'Internet', x: 50, y: 10 },
  { id: 'router', label: 'Router', x: 50, y: 32 },
  { id: 'switch', label: 'Switch', x: 50, y: 56 },
  { id: 'pc1', label: 'PC 1', x: 10, y: 86 },
  { id: 'pc2', label: 'PC 2', x: 30, y: 90 },
  { id: 'srv', label: 'Server', x: 50, y: 92 },
  { id: 'prn', label: 'Drucker', x: 70, y: 90 },
  { id: 'ap', label: 'Access Point', x: 89, y: 86 },
];
const NEEDED = ['inet-router', 'router-switch', 'switch-pc1', 'switch-pc2', 'switch-srv', 'switch-prn', 'switch-ap'];
const key = (a: string, b: string) => [a, b].sort((x, y) => NODES.findIndex((n) => n.id === x) - NODES.findIndex((n) => n.id === y)).join('-');

function NetBuilder() {
  const [links, setLinks] = useState<string[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const click = (id: string) => {
    setChecked(false);
    if (!sel) return setSel(id);
    if (sel === id) return setSel(null);
    const k = key(sel, id);
    setLinks((l) => (l.includes(k) ? l.filter((x) => x !== k) : [...l, k]));
    setSel(null);
  };
  const wrong = links.filter((l) => !NEEDED.includes(l));
  const missing = NEEDED.filter((l) => !links.includes(l));
  const name = (k: string) => k.split('-').map((i) => NODES.find((n) => n.id === i)!.label).join(' ↔ ');
  return (
    <div className="stack">
      <p className="muted">Klicke zwei Geräte nacheinander an, um sie mit einem Kabel zu verbinden. Ein zweiter Klick auf dieselbe Verbindung entfernt sie. Baue ein Firmennetz in Sterntopologie.</p>
      <div className="net-canvas" style={{ height: 340 }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          {links.map((l) => {
            const [a, b] = l.split('-').map((i) => NODES.find((n) => n.id === i)!);
            const bad = checked && !NEEDED.includes(l);
            return <line key={l} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={bad ? 'var(--bad)' : 'var(--accent)'} strokeWidth={0.8} vectorEffect="non-scaling-stroke" style={{ strokeWidth: 3 }} />;
          })}
        </svg>
        {NODES.map((n) => (
          <button key={n.id} className={`node ${sel === n.id ? 'sel' : ''}`} style={{ left: `${n.x}%`, top: `${n.y}%` }} onClick={() => click(n.id)}>{n.label}</button>
        ))}
      </div>
      <div className="row">
        <button className="btn primary" onClick={() => setChecked(true)}>Netz prüfen</button>
        <button className="btn" onClick={() => { setLinks([]); setChecked(false); setSel(null); }}>Alles entfernen</button>
      </div>
      {checked && (
        <div className={`feedback ${!wrong.length && !missing.length ? 'richtig' : 'teilweise'}`}>
          {!wrong.length && !missing.length ? (
            <p><b>Perfekt.</b> Der Router verbindet das Firmennetz mit dem Internet und ist das Standardgateway. Alle Endgeräte hängen sternförmig am Switch. Fällt ein Kabel aus, ist nur ein Gerät betroffen.</p>
          ) : (
            <p>
              {wrong.length > 0 && `Diese Verbindungen passen nicht: ${wrong.map(name).join(', ')}. Endgeräte hängen nicht direkt am Internet oder aneinander, sondern am Switch. `}
              {missing.length > 0 && `Es fehlen noch ${missing.length} Verbindung(en). Tipp: Welches Gerät verbindet alle Endgeräte im LAN, und welches Gerät verbindet das LAN mit dem Internet?`}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ---------- OSI ---------- */
const OSI = [
  { n: 7, name: 'Anwendungsschicht', what: 'Schnittstelle zu den Programmen. Hier arbeiten Protokolle wie HTTP, SMTP, IMAP, DNS und FTP.', dev: 'Gateway, Proxy, Firewall (Anwendungsebene)', pdu: 'Daten' },
  { n: 6, name: 'Darstellungsschicht', what: 'Wandelt Datenformate um, z. B. Zeichensätze, Kompression und Verschlüsselung.', dev: '–', pdu: 'Daten' },
  { n: 5, name: 'Sitzungsschicht', what: 'Baut Sitzungen zwischen zwei Programmen auf, hält sie und beendet sie.', dev: '–', pdu: 'Daten' },
  { n: 4, name: 'Transportschicht', what: 'Ende-zu-Ende-Transport mit TCP (zuverlässig) oder UDP (schnell). Ports ordnen die Daten den Diensten zu.', dev: 'Firewall (Port-Filter)', pdu: 'Segment / Datagramm' },
  { n: 3, name: 'Vermittlungsschicht', what: 'Logische Adressierung mit IP-Adressen und Wegewahl (Routing) zwischen Netzen.', dev: 'Router, Layer-3-Switch', pdu: 'Paket' },
  { n: 2, name: 'Sicherungsschicht', what: 'Adressierung im lokalen Netz mit MAC-Adressen, Fehlererkennung, Zugriff auf das Medium.', dev: 'Switch, Bridge, Access Point', pdu: 'Frame' },
  { n: 1, name: 'Bitübertragungsschicht', what: 'Überträgt Bits als Signale über Kabel, Glasfaser oder Funk. Stecker, Spannungen, Frequenzen.', dev: 'Kabel, Hub, Repeater', pdu: 'Bit' },
];
function OsiExplorer() {
  const [on, setOn] = useState(3);
  const [seed, setSeed] = useState(3);
  const order = useMemo(() => shuffle(rng(seed), OSI.map((o) => o.n)), [seed]);
  const [picked, setPicked] = useState<number[]>([]);
  const [err, setErr] = useState(false);
  const l = OSI.find((o) => o.n === on)!;
  const next = picked.length + 1;
  return (
    <div className="stack">
      <div className="grid g2">
        <div className="osi-stack">
          {OSI.map((o) => (
            <button key={o.n} className={`osi-layer ${on === o.n ? 'on' : ''}`} onClick={() => setOn(o.n)}>
              <span className="n">{o.n}</span><span>{o.name}</span>
            </button>
          ))}
        </div>
        <div className="card tint stack">
          <h3>Schicht {l.n}: {l.name}</h3>
          <p>{l.what}</p>
          <p className="small"><b>Geräte:</b> {l.dev}</p>
          <p className="small"><b>Dateneinheit:</b> {l.pdu}</p>
        </div>
      </div>
      <div className="card flat stack">
        <h3>Sortier-Übung</h3>
        <p className="muted">Klicke die Schichten in der richtigen Reihenfolge an, beginnend mit Schicht 1 (unten).</p>
        <div className="chips">
          {order.map((n) => {
            const o = OSI.find((x) => x.n === n)!;
            const done = picked.includes(n);
            return (
              <button key={n} className="chip" aria-pressed={done} disabled={done} onClick={() => {
                if (n === next) { setPicked([...picked, n]); setErr(false); } else setErr(true);
              }}>{o.name}</button>
            );
          })}
        </div>
        {err && <p className="small" style={{ color: 'var(--bad)' }}>Nicht ganz. Gesucht ist Schicht {next}. Eselsbrücke: Please Do Not Throw Sausage Pizza Away.</p>}
        {picked.length === 7 && <p className="badge good">Alle sieben Schichten in der richtigen Reihenfolge!</p>}
        <button className="btn sm" style={{ alignSelf: 'flex-start' }} onClick={() => { setPicked([]); setSeed(seed + 1); setErr(false); }}>Neu mischen</button>
      </div>
    </div>
  );
}

/* ---------- Subnetting ---------- */
function BinIp({ ip, prefix }: { ip: string; prefix: number }) {
  const octs = ip.split('.').map(Number);
  let bit = 0;
  return (
    <span className="bin">
      {octs.map((o, i) => (
        <span key={i}>
          {toBin8(o).split('').map((c, j) => {
            const isNet = bit++ < prefix;
            return <span key={j} className={isNet ? 'n' : 'h'}>{c}</span>;
          })}
          {i < 3 && '.'}
        </span>
      ))}
    </span>
  );
}

function SubnetTrainer() {
  const [ip, setIp] = useState('192.168.5.77');
  const [prefix, setPrefix] = useState(28);
  const valid = isValidIp(ip) && prefix >= 8 && prefix <= 30;
  const info = valid ? subnetInfo(ip, prefix) : null;
  const oct = Math.min(4, Math.floor(prefix / 8) + 1);

  const [task, setTask] = useState(() => newTask(1));
  const [ans, setAns] = useState({ net: '', bc: '', hosts: '' });
  const [res, setRes] = useState<null | { net: boolean; bc: boolean; hosts: boolean }>(null);
  function newTask(seed: number) {
    const r = rng(seed * 7717 + Date.now() % 100000);
    const p = pick(r, [22, 23, 25, 26, 27, 28, 29]);
    const a = `${pick(r, ['10', '172', '192'])}.${int(r, 16, 31)}.${int(r, 0, 255)}.${int(r, 1, 254)}`.replace(/^192\.\d+/, `192.168`);
    return { ip: a, p, info: subnetInfo(a, p), seed };
  }
  const check = () => setRes({
    net: normIp(ans.net) === task.info.network,
    bc: normIp(ans.bc) === task.info.broadcast,
    hosts: parseNum(ans.hosts) === task.info.hosts,
  });

  return (
    <div className="stack">
      <div className="grid g2">
        <div className="field"><label htmlFor="sn-ip">IP-Adresse</label><input id="sn-ip" type="text" className="mono" value={ip} onChange={(e) => setIp(e.target.value.trim())} /></div>
        <div className="field"><label htmlFor="sn-p">Präfix: /{prefix}</label><input id="sn-p" type="range" min={8} max={30} value={prefix} onChange={(e) => setPrefix(Number(e.target.value))} /></div>
      </div>
      {!valid && <p className="small" style={{ color: 'var(--bad)' }}>Bitte eine gültige IPv4-Adresse eingeben, zum Beispiel 192.168.1.10.</p>}
      {info && (
        <div className="card tint stack">
          <div style={{ overflowX: 'auto' }}>
            <p className="small"><b>IP binär:</b> <BinIp ip={ip} prefix={prefix} /></p>
            <p className="small"><b>Maske binär:</b> <BinIp ip={info.mask} prefix={prefix} /></p>
          </div>
          <p className="small"><span style={{ color: 'var(--accent)', fontWeight: 700 }}>Blau</span> ist der Netzanteil, <span style={{ color: 'var(--flag)', fontWeight: 700 }}>orange</span> der Hostanteil.</p>
          <div className="tbl-wrap">
            <table className="tbl">
              <tbody>
                <tr><th>Subnetzmaske</th><td className="mono">{info.mask}</td></tr>
                <tr><th>Netzadresse</th><td className="mono">{info.network}</td></tr>
                <tr><th>Erste nutzbare Adresse</th><td className="mono">{info.first}</td></tr>
                <tr><th>Letzte nutzbare Adresse</th><td className="mono">{info.last}</td></tr>
                <tr><th>Broadcast</th><td className="mono">{info.broadcast}</td></tr>
                <tr><th>Nutzbare Hosts</th><td className="mono">{de(info.hosts, 0)}</td></tr>
              </tbody>
            </table>
          </div>
          <p>So rechnest du: Es bleiben 32 − {prefix} = {32 - prefix} Hostbits. Das interessante Oktett ist das {oct}. Oktett mit dem Maskenwert {info.mask.split('.')[oct - 1]}. Die Blockgröße ist {prefix % 8 === 0 ? '256 im nächsten Oktett' : `256 − ${info.mask.split('.')[oct - 1]} = ${info.block}`}. Die Zahl {ip.split('.')[oct - 1]} liegt im Block ab {info.network.split('.')[oct - 1]}. Das ergibt die Netzadresse {info.network}. Die Hosts sind 2 hoch {32 - prefix} minus 2, also {de(info.hosts, 0)}.</p>
        </div>
      )}
      <div className="card flat stack">
        <h3>Jetzt du: Übungsaufgabe</h3>
        <p>Bestimme für <span className="mono"><b>{task.ip}/{task.p}</b></span> die Netzadresse, die Broadcast-Adresse und die Anzahl der Hosts.</p>
        <div className="grid g3">
          <div className="field"><label htmlFor="sn-a1">Netzadresse</label><input id="sn-a1" type="text" className="mono" value={ans.net} onChange={(e) => setAns({ ...ans, net: e.target.value })} /></div>
          <div className="field"><label htmlFor="sn-a2">Broadcast</label><input id="sn-a2" type="text" className="mono" value={ans.bc} onChange={(e) => setAns({ ...ans, bc: e.target.value })} /></div>
          <div className="field"><label htmlFor="sn-a3">Hosts</label><input id="sn-a3" type="text" inputMode="numeric" className="mono" value={ans.hosts} onChange={(e) => setAns({ ...ans, hosts: e.target.value })} /></div>
        </div>
        <div className="row">
          <button className="btn primary" onClick={check}>Prüfen</button>
          <button className="btn" onClick={() => { setIp(task.ip); setPrefix(task.p); }}>Im Rechner ansehen</button>
          <button className="btn ghost" onClick={() => { setTask(newTask(task.seed + 1)); setAns({ net: '', bc: '', hosts: '' }); setRes(null); }}>Neue Aufgabe</button>
        </div>
        {res && (
          <div className={`feedback ${res.net && res.bc && res.hosts ? 'richtig' : 'teilweise'}`}>
            <p>
              Netzadresse {res.net ? 'richtig' : `falsch, richtig ist ${task.info.network}`}. Broadcast {res.bc ? 'richtig' : `falsch, richtig ist ${task.info.broadcast}`}. Hosts {res.hosts ? 'richtig' : `falsch, richtig sind ${de(task.info.hosts, 0)}`}.
              {!(res.net && res.bc && res.hosts) && ' Schau dir den Rechenweg im Rechner oben an.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- Fallbeurteilung (Lizenzen, DSGVO) ---------- */
interface Case { text: string; answer: string; why: string }
const LICENSE_OPTS = ['OEM-Lizenz', 'Volumenlizenz', 'Abonnement', 'Floating-Lizenz', 'Open Source', 'Freeware'];
const LICENSE_CASES: Case[] = [
  { text: 'Ein Unternehmen mit 120 Arbeitsplätzen will Windows und Office zentral verwalten und günstiger einkaufen.', answer: 'Volumenlizenz', why: 'Volumenverträge sind für viele Installationen gedacht und erlauben zentrale Verwaltung.' },
  { text: 'Ein Kunde kauft einen neuen Fertig-PC mit vorinstalliertem Windows.', answer: 'OEM-Lizenz', why: 'Die Lizenz wird mit dem Gerät verkauft und ist an dieses Gerät gebunden.' },
  { text: 'Ein Ingenieurbüro hat 25 Mitarbeitende, aber nur 6 nutzen gleichzeitig eine teure CAD-Software.', answer: 'Floating-Lizenz', why: 'Es zählt die Zahl der gleichzeitigen Nutzer.' },
  { text: 'Eine Agentur möchte immer die neueste Version, monatlich zahlen und Lizenzen flexibel anpassen.', answer: 'Abonnement', why: 'Abos sind flexibel, kosten aber dauerhaft.' },
  { text: 'Ein Startup will die Software verändern und den Quellcode einsehen dürfen.', answer: 'Open Source', why: 'Nur bei Open Source ist der Quellcode offen und Änderungen sind erlaubt.' },
  { text: 'Ein Verein nutzt ein kostenloses Programm zum PDF-Zusammenfügen, dessen Quellcode geschlossen ist.', answer: 'Freeware', why: 'Kostenlos, aber nicht offen. Achtung: Manche Freeware ist nur privat kostenlos.' },
];
const WISO_CASES: Case[] = [
  { text: 'Ein Techniker schneidet sich beim Öffnen eines Servergehäuses beim Kunden tief in die Hand.', answer: 'Unfallversicherung', why: 'Das ist ein Arbeitsunfall. Zuständig ist die Berufsgenossenschaft.' },
  { text: 'Eine Mitarbeiterin ist seit acht Wochen wegen einer Lungenentzündung krank und bekommt kein Gehalt mehr vom Arbeitgeber.', answer: 'Krankenversicherung', why: 'Nach sechs Wochen Entgeltfortzahlung zahlt die Krankenkasse Krankengeld.' },
  { text: 'Wegen fehlender Aufträge wird im Betrieb für drei Monate die Arbeitszeit gekürzt. Die Beschäftigten erhalten einen Ausgleich.', answer: 'Arbeitslosenversicherung', why: 'Das Kurzarbeitergeld zahlt die Bundesagentur für Arbeit.' },
  { text: 'Ein Mitarbeiter kann nach einer schweren Erkrankung dauerhaft nur noch zwei Stunden am Tag arbeiten.', answer: 'Rentenversicherung', why: 'Die Rentenversicherung zahlt eine Rente wegen Erwerbsminderung.' },
  { text: 'Die Mutter einer Kollegin braucht nach einem Schlaganfall täglich Hilfe beim Waschen und Anziehen.', answer: 'Pflegeversicherung', why: 'Die Pflegeversicherung zahlt je nach Pflegegrad Pflegegeld oder Sachleistungen.' },
  { text: 'Eine Auszubildende stürzt morgens auf dem direkten Weg zum Betrieb mit dem Roller.', answer: 'Unfallversicherung', why: 'Ein Unfall auf dem direkten Weg zur Arbeit ist ein Wegeunfall.' },
  { text: 'Nach dem Ende eines befristeten Vertrags findet ein Fachinformatiker zunächst keine neue Stelle.', answer: 'Arbeitslosenversicherung', why: 'Sie zahlt Arbeitslosengeld und unterstützt bei der Stellensuche.' },
];
const DSGVO_CASES: Case[] = [
  { text: 'Ein Onlineshop speichert Name und Adresse, um eine Bestellung zu liefern.', answer: 'zulässig', why: 'Die Daten sind für die Erfüllung des Vertrags nötig (Art. 6 Abs. 1 lit. b).' },
  { text: 'Ein Shop schickt allen Kunden ohne Nachfrage einen Werbe-Newsletter.', answer: 'nur mit Einwilligung', why: 'Für E-Mail-Werbung braucht man in der Regel eine Einwilligung.' },
  { text: 'Der Chef liest heimlich die privaten Chats seiner Mitarbeitenden.', answer: 'nicht zulässig', why: 'Dafür gibt es keine Rechtsgrundlage. Es verletzt die Vertraulichkeit massiv.' },
  { text: 'Ein Unternehmen bewahrt Rechnungen zehn Jahre auf, obwohl der Kunde die Löschung verlangt.', answer: 'zulässig', why: 'Gesetzliche Aufbewahrungspflichten gehen dem Löschanspruch vor.' },
  { text: 'Fotos von der Firmenfeier sollen auf der öffentlichen Website erscheinen.', answer: 'nur mit Einwilligung', why: 'Personen auf Fotos müssen in der Regel zustimmen.' },
  { text: 'Eine Arztpraxis gibt Patientendaten ohne Vertrag an einen Cloud-Dienst weiter.', answer: 'nicht zulässig', why: 'Ohne Auftragsverarbeitungsvertrag (Art. 28) und Prüfung der Sicherheit ist das nicht erlaubt.' },
];
function ChoiceCases({ cases, options }: { cases: Case[]; options: string[] }) {
  const [ans, setAns] = useState<Record<number, string>>({});
  const right = cases.filter((c, i) => ans[i] === c.answer).length;
  return (
    <div className="stack">
      {cases.map((c, i) => (
        <div key={i} className="card flat stack">
          <p>{c.text}</p>
          <div className="chips">
            {options.map((o) => (
              <button key={o} className="chip" aria-pressed={ans[i] === o} disabled={ans[i] !== undefined} onClick={() => setAns({ ...ans, [i]: o })}>{o}</button>
            ))}
          </div>
          {ans[i] !== undefined && (
            <p className="small"><b style={{ color: ans[i] === c.answer ? 'var(--good)' : 'var(--bad)' }}>{ans[i] === c.answer ? 'Richtig.' : `Nicht ganz, richtig ist: ${c.answer}.`}</b> {c.why}</p>
          )}
        </div>
      ))}
      <div className="row between"><span className="small muted tnum">{right} von {cases.length} richtig</span><button className="btn sm" onClick={() => setAns({})}>Zurücksetzen</button></div>
    </div>
  );
}

/* ---------- Phishing ---------- */
const SPOTS = [
  { id: 'from', text: 'service@sparkasse-sicherheit-login.com', bad: true, why: 'Die Absenderdomain gehört nicht zur Bank.' },
  { id: 'greet', text: 'Sehr geehrter Kunde', bad: true, why: 'Unpersönliche Anrede. Echte Banken kennen deinen Namen. (Achtung: Auch eine korrekte Anrede beweist keine Echtheit.)' },
  { id: 'time', text: 'innerhalb von 24 Stunden', bad: true, why: 'Künstlicher Zeitdruck soll dich zu unüberlegtem Handeln bringen.' },
  { id: 'link', text: 'Jetzt Konto bestätigen', bad: true, why: 'Der Link führt zu http://sparkasse.konto-check.ru – einer fremden Domain.' },
  { id: 'att', text: 'Kontoauszug.zip', bad: true, why: 'Unerwartete Archiv-Anhänge können Schadsoftware enthalten.' },
  { id: 'date', text: 'Montag, 10:14 Uhr', bad: false, why: 'Datum und Uhrzeit sind unauffällig.' },
  { id: 'sig', text: 'Ihr Kundenservice', bad: false, why: 'Eine allgemeine Signatur allein ist kein starkes Merkmal.' },
];
function Phishing() {
  const [found, setFound] = useState<string[]>([]);
  const [last, setLast] = useState<string | null>(null);
  const S = (id: string) => {
    const s = SPOTS.find((x) => x.id === id)!;
    const on = found.includes(id);
    return <button className={`spot ${on && s.bad ? 'found' : ''}`} onClick={() => { if (!on) setFound([...found, id]); setLast(id); }}>{s.text}</button>;
  };
  const bad = SPOTS.filter((s) => s.bad);
  const hits = found.filter((f) => SPOTS.find((s) => s.id === f)!.bad).length;
  const info = last ? SPOTS.find((s) => s.id === last)! : null;
  return (
    <div className="stack">
      <p className="muted">Finde die verdächtigen Stellen in dieser E-Mail. Klicke auf alles, was dir komisch vorkommt.</p>
      <div className="mail">
        <div className="mail-head">
          <span><b>Von:</b> {S('from')}</span>
          <span><b>Betreff:</b> Ihr Konto wurde eingeschränkt</span>
          <span className="muted"><b>Gesendet:</b> {S('date')}</span>
        </div>
        <div className="mail-body">
          <p>{S('greet')},</p>
          <p>wir haben ungewöhnliche Aktivitäten festgestellt. Bitte bestätigen Sie Ihre Daten {S('time')}, sonst wird Ihr Online-Banking dauerhaft gesperrt.</p>
          <p><span className="btn primary sm" style={{ pointerEvents: 'none' }}>▶</span> {S('link')}</p>
          <p>Ihren aktuellen Kontoauszug finden Sie im Anhang: 📎 {S('att')}</p>
          <p>Mit freundlichen Grüßen<br />{S('sig')}</p>
        </div>
      </div>
      {info && <div className={`feedback ${info.bad ? 'richtig' : 'teilweise'}`}><p><b>{info.bad ? 'Gefunden: ' : 'Unauffällig: '}</b>{info.why}</p></div>}
      <div className="row between">
        <span className="small muted tnum">{hits} von {bad.length} Warnzeichen gefunden</span>
        {hits === bad.length && <span className="badge good">Alle gefunden. Richtige Reaktion: nicht klicken, Mail an die IT melden, Bank über bekannte Nummer kontaktieren.</span>}
        <button className="btn sm" onClick={() => { setFound([]); setLast(null); }}>Zurücksetzen</button>
      </div>
    </div>
  );
}

/* ---------- Bezugskalkulation ---------- */
function makeBezug(seed: number) {
  const r = rng(seed);
  const qty = pick(r, [5, 8, 10, 12, 15]);
  const unit = pick(r, [149, 189, 229, 279, 349]);
  const rab = pick(r, [5, 8, 10, 12]);
  const sko = pick(r, [2, 3]);
  const fr = pick(r, [12.5, 19.9, 24.5, 35]);
  const list = qty * unit;
  const ziel = round2(list * (1 - rab / 100));
  const bar = round2(ziel - round2(ziel * sko / 100));
  return { qty, unit, rab, sko, fr, steps: [list, ziel, bar, round2(bar + fr)] };
}
function CalcStepper() {
  const [seed, setSeed] = useState(11);
  const d = useMemo(() => makeBezug(seed), [seed]);
  const labels = ['Listeneinkaufspreis', 'Zieleinkaufspreis (nach Rabatt)', 'Bareinkaufspreis (nach Skonto)', 'Bezugspreis (mit Versand)'];
  const hints = [
    `Menge mal Stückpreis: ${d.qty} × ${de(d.unit)} €.`,
    `Zieh ${d.rab} % vom Listeneinkaufspreis ab.`,
    `Zieh ${d.sko} % vom Zieleinkaufspreis ab, nicht vom Listenpreis.`,
    `Addiere die Versandkosten von ${eur(d.fr)}.`,
  ];
  const [vals, setVals] = useState<string[]>(['', '', '', '']);
  const [step, setStep] = useState(0);
  const [msg, setMsg] = useState<string | null>(null);
  const check = () => {
    const n = parseNum(vals[step]);
    if (n !== null && Math.abs(n - d.steps[step]) < 0.015) {
      setMsg(null);
      setStep(step + 1);
    } else setMsg(`Noch nicht richtig. Tipp: ${hints[step]}`);
  };
  return (
    <div className="stack">
      <p>Ihr bestellt {d.qty} Monitore zu je {eur(d.unit)} netto. Der Lieferant gibt {d.rab} % Rabatt und {d.sko} % Skonto. Der Versand kostet {eur(d.fr)}. Rechne Schritt für Schritt.</p>
      {labels.map((l, i) => (
        <div key={i} className="row" style={{ opacity: i > step ? 0.45 : 1 }}>
          <label htmlFor={`cs-${i}`} style={{ minWidth: 240, fontWeight: 600 }}>{l}</label>
          <div className="calc-in" style={{ maxWidth: 220 }}>
            <input id={`cs-${i}`} type="text" inputMode="decimal" className="mono" disabled={i !== step} value={i < step ? de(d.steps[i]) : vals[i]} onChange={(e) => { const v = vals.slice(); v[i] = e.target.value; setVals(v); }}
              onKeyDown={(e) => { if (e.key === 'Enter') check(); }} />
            <span className="unit">€</span>
          </div>
          {i < step && <span className="badge good">✓</span>}
        </div>
      ))}
      {msg && <p className="small" style={{ color: 'var(--bad)' }}>{msg}</p>}
      <div className="row">
        {step < 4 ? <button className="btn primary" onClick={check}>Schritt prüfen</button> : <span className="badge good">Fertig! Bezugspreis {eur(d.steps[3])}</span>}
        <button className="btn ghost" onClick={() => setMsg(`Tipp: ${hints[Math.min(step, 3)]}`)} disabled={step >= 4}>Tipp</button>
        <button className="btn" onClick={() => { setSeed(seed + 1); setVals(['', '', '', '']); setStep(0); setMsg(null); }}>Neue Zahlen</button>
      </div>
    </div>
  );
}

/* ---------- Nutzwertanalyse ---------- */
function Nwa() {
  const [crit, setCrit] = useState([
    { name: 'Preis', w: 40, a: 8, b: 6 },
    { name: 'Service', w: 35, a: 5, b: 9 },
    { name: 'Lieferzeit', w: 25, a: 7, b: 6 },
  ]);
  const sumW = crit.reduce((s, c) => s + c.w, 0);
  const va = crit.reduce((s, c) => s + (c.a * c.w) / 100, 0);
  const vb = crit.reduce((s, c) => s + (c.b * c.w) / 100, 0);
  const upd = (i: number, k: 'w' | 'a' | 'b', v: string) => {
    const n = Math.max(0, Math.min(k === 'w' ? 100 : 10, Number(v) || 0));
    setCrit(crit.map((c, j) => (j === i ? { ...c, [k]: n } : c)));
  };
  return (
    <div className="stack">
      <p className="muted">Ändere Gewichte und Punkte (0 bis 10). Beobachte, wie die Gewichtung das Ergebnis dreht.</p>
      <div className="tbl-wrap">
        <table className="tbl">
          <thead><tr><th>Kriterium</th><th>Gewicht %</th><th>Punkte A</th><th>gew. A</th><th>Punkte B</th><th>gew. B</th></tr></thead>
          <tbody>
            {crit.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td><input id={`nwa-w-${i}`} aria-label={`Gewicht ${c.name}`} type="number" style={{ width: 80 }} value={c.w} onChange={(e) => upd(i, 'w', e.target.value)} /></td>
                <td><input id={`nwa-a-${i}`} aria-label={`Punkte A ${c.name}`} type="number" style={{ width: 70 }} value={c.a} onChange={(e) => upd(i, 'a', e.target.value)} /></td>
                <td className="mono">{de((c.a * c.w) / 100)}</td>
                <td><input id={`nwa-b-${i}`} aria-label={`Punkte B ${c.name}`} type="number" style={{ width: 70 }} value={c.b} onChange={(e) => upd(i, 'b', e.target.value)} /></td>
                <td className="mono">{de((c.b * c.w) / 100)}</td>
              </tr>
            ))}
            <tr><th>Summe</th><th style={{ color: sumW === 100 ? 'var(--good)' : 'var(--bad)' }}>{sumW} %</th><th></th><th className="mono">{de(va)}</th><th></th><th className="mono">{de(vb)}</th></tr>
          </tbody>
        </table>
      </div>
      {sumW !== 100 ? <p className="small" style={{ color: 'var(--bad)' }}>Die Gewichte ergeben {sumW} %. Sie müssen zusammen genau 100 % ergeben.</p>
        : <p><b>{va === vb ? 'Gleichstand.' : `Angebot ${va > vb ? 'A' : 'B'} gewinnt mit ${de(Math.max(va, vb))} Punkten.`}</b> Der Nutzwert ist die Summe aus Punkte mal Gewicht.</p>}
    </div>
  );
}

/* ---------- SLA ---------- */
function SlaCalc() {
  const [v, setV] = useState('99.9');
  const [scope, setScope] = useState<'jahr' | 'monat' | 'woche' | 'gz'>('jahr');
  const hours = scope === 'jahr' ? 8760 : scope === 'monat' ? 720 : scope === 'woche' ? 168 : 2500;
  const n = parseNum(v);
  const down = n !== null && n <= 100 ? hours * (1 - n / 100) : null;
  return (
    <div className="stack">
      <div className="grid g2">
        <div className="field"><label htmlFor="sla-v">Verfügbarkeit in %</label><input id="sla-v" type="text" inputMode="decimal" className="mono" value={v} onChange={(e) => setV(e.target.value)} /></div>
        <div className="field"><label htmlFor="sla-s">Zeitraum</label>
          <select id="sla-s" value={scope} onChange={(e) => setScope(e.target.value as typeof scope)}>
            <option value="jahr">Jahr, 24/7 (8.760 h)</option><option value="monat">Monat, 24/7 (720 h)</option><option value="woche">Woche, 24/7 (168 h)</option><option value="gz">Geschäftszeit 10 h × 250 Tage (2.500 h)</option>
          </select>
        </div>
      </div>
      {down !== null ? (
        <div className="card tint">
          <p>Erlaubte Ausfallzeit: <b className="mono">{de(down, 2)} Stunden</b>, das sind <b className="mono">{de(down * 60, 0)} Minuten</b>.</p>
          <p className="small muted">Rechnung: {de(hours, 0)} h × (100 % − {v.replace('.', ',')} %) = {de(down, 3)} h</p>
        </div>
      ) : <p className="small" style={{ color: 'var(--bad)' }}>Bitte eine Zahl bis 100 eingeben.</p>}
      <div className="chips">{['99', '99.5', '99.9', '99.95', '99.99'].map((x) => <button key={x} className="chip" aria-pressed={v === x} onClick={() => setV(x)}>{x.replace('.', ',')} %</button>)}</div>
    </div>
  );
}


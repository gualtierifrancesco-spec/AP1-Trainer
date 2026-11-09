import type { VisualId } from '../data/topicTypes';

const T = { fill: 'var(--ink)', fontSize: 13 } as const;
const S = { fill: 'var(--ink-2)', fontSize: 11 } as const;

function Box({ x, y, w, h, label, sub, tone = 'surface' }: { x: number; y: number; w: number; h: number; label: string; sub?: string; tone?: 'surface' | 'accent' | 'flag' | 'good' }) {
  const fill = tone === 'accent' ? 'var(--accent-soft)' : tone === 'flag' ? 'var(--flag-soft)' : tone === 'good' ? 'var(--good-soft)' : 'var(--surface)';
  const stroke = tone === 'accent' ? 'var(--accent)' : tone === 'flag' ? 'var(--flag)' : tone === 'good' ? 'var(--good)' : 'var(--line)';
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={7} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 2 : h / 2 + 4)} textAnchor="middle" {...T} fontWeight={700}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" {...S}>{sub}</text>}
    </g>
  );
}

const Line = ({ x1, y1, x2, y2, dash }: { x1: number; y1: number; x2: number; y2: number; dash?: boolean }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--ink-3)" strokeWidth={2} strokeDasharray={dash ? '5 4' : undefined} markerEnd="url(#arr)" />
);
const Defs = () => (
  <defs>
    <marker id="arr" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink-3)" /></marker>
  </defs>
);

export function Visual({ id }: { id: VisualId }) {
  switch (id) {
    case 'pc-parts':
      return (
        <svg viewBox="0 0 480 270" role="img" aria-label="EVA-Prinzip mit Komponenten">
          <Defs />
          <Box x={10} y={20} w={120} h={60} label="Eingabe" sub="Tastatur, Scanner" />
          <Box x={180} y={20} w={120} h={60} label="Verarbeitung" sub="CPU + RAM" tone="accent" />
          <Box x={350} y={20} w={120} h={60} label="Ausgabe" sub="Monitor, Drucker" />
          <Line x1={130} y1={50} x2={178} y2={50} />
          <Line x1={300} y1={50} x2={348} y2={50} />
          <Box x={180} y={120} w={120} h={50} label="Speicherung" sub="SSD / HDD" />
          <Line x1={240} y1={80} x2={240} y2={118} />
          <rect x={10} y={195} width={460} height={64} rx={8} fill="none" stroke="var(--ink-3)" strokeDasharray="5 4" />
          <text x={22} y={214} {...S} fontWeight={700}>MAINBOARD verbindet alles</text>
          {['CPU-Sockel', 'RAM-Slots', 'M.2 / SATA', 'PCIe (GPU)', 'Chipsatz', 'UEFI-ROM'].map((l, i) => (
            <g key={l}><rect x={22 + i * 74} y={222} width={68} height={28} rx={5} fill="var(--surface)" stroke="var(--line)" /><text x={56 + i * 74} y={240} textAnchor="middle" {...S}>{l}</text></g>
          ))}
        </svg>
      );
    case 'ergo':
      return (
        <svg viewBox="0 0 480 260" role="img" aria-label="Ergonomischer Bildschirmarbeitsplatz">
          <rect x={410} y={20} width={60} height={150} fill="var(--accent-soft)" stroke="var(--accent)" />
          <text x={440} y={100} textAnchor="middle" {...S} transform="rotate(90 440 100)">Fenster (seitlich)</text>
          <rect x={40} y={170} width={300} height={8} fill="var(--ink-3)" /><text x={190} y={196} textAnchor="middle" {...S}>Tisch</text>
          <rect x={250} y={80} width={10} height={80} fill="var(--ink)" /><rect x={235} y={160} width={40} height={10} fill="var(--ink)" />
          <circle cx={110} cy={80} r={18} fill="var(--surface)" stroke="var(--ink)" strokeWidth={2} />
          <line x1={110} y1={98} x2={110} y2={160} stroke="var(--ink)" strokeWidth={3} />
          <line x1={110} y1={120} x2={150} y2={150} stroke="var(--ink)" strokeWidth={3} /><line x1={150} y1={150} x2={200} y2={162} stroke="var(--ink)" strokeWidth={3} />
          <line x1={110} y1={160} x2={160} y2={160} stroke="var(--ink)" strokeWidth={3} /><line x1={160} y1={160} x2={160} y2={240} stroke="var(--ink)" strokeWidth={3} />
          <line x1={128} y1={80} x2={250} y2={92} stroke="var(--flag)" strokeWidth={1.5} strokeDasharray="5 4" />
          <text x={180} y={74} textAnchor="middle" {...S} fill="var(--flag)">Blick leicht nach unten</text>
          <line x1={128} y1={60} x2={250} y2={60} stroke="var(--accent)" strokeWidth={1.5} />
          <text x={190} y={52} textAnchor="middle" {...S} fill="var(--accent)">50–80 cm</text>
          <text x={176} y={146} {...S}>≈ 90°</text><text x={168} y={210} {...S}>Füße flach</text>
          <text x={12} y={30} {...T} fontWeight={700}>ArbStättV Anhang 6</text>
          <text x={12} y={48} {...S}>500 Lux · Pausen/Mischarbeit</text>
        </svg>
      );
    case 'topo':
      return (
        <svg viewBox="0 0 480 270" role="img" aria-label="Sterntopologie mit Router und Switch">
          <Defs />
          <Box x={180} y={6} w={120} h={40} label="Internet (WAN)" tone="flag" />
          <Box x={180} y={76} w={120} h={46} label="Router" sub="Gateway · NAT · Firewall" tone="accent" />
          <Box x={180} y={150} w={120} h={40} label="Switch (PoE)" />
          <Line x1={240} y1={46} x2={240} y2={74} /><Line x1={240} y1={122} x2={240} y2={148} />
          {[['PC 1', 30], ['PC 2', 120], ['Server', 210], ['Drucker', 300], ['Access Point', 390]].map(([l, x]) => (
            <g key={l as string}><Line x1={240} y1={190} x2={(x as number) + 40} y2={218} /><Box x={x as number} y={220} w={82} h={36} label={l as string} /></g>
          ))}
          <text x={320} y={100} {...S}>Schicht 3: IP</text><text x={320} y={174} {...S}>Schicht 2: MAC</text>
        </svg>
      );
    case 'osi':
      return (
        <svg viewBox="0 0 480 300" role="img" aria-label="OSI-Modell mit sieben Schichten">
          {[
            ['7', 'Anwendung', 'HTTP, SMTP, DNS', 'Daten'], ['6', 'Darstellung', 'TLS, JPEG, UTF-8', 'Daten'], ['5', 'Sitzung', 'RPC, Sitzungen', 'Daten'],
            ['4', 'Transport', 'TCP, UDP, Ports', 'Segment'], ['3', 'Vermittlung', 'IP, ICMP · Router', 'Paket'], ['2', 'Sicherung', 'Ethernet, MAC · Switch', 'Frame'], ['1', 'Bitübertragung', 'Kabel, Funk · Hub', 'Bits'],
          ].map(([n, name, ex, pdu], i) => (
            <g key={n}>
              <rect x={10} y={8 + i * 41} width={460} height={36} rx={6} fill={i < 3 ? 'var(--accent-soft)' : i === 3 ? 'var(--flag-soft)' : 'var(--surface)'} stroke="var(--line)" />
              <text x={30} y={31 + i * 41} {...T} fontWeight={800} fill="var(--accent)">{n}</text>
              <text x={56} y={31 + i * 41} {...T} fontWeight={700}>{name}</text>
              <text x={200} y={31 + i * 41} {...S}>{ex}</text>
              <text x={455} y={31 + i * 41} textAnchor="end" {...S} fontWeight={700}>{pdu}</text>
            </g>
          ))}
        </svg>
      );
    case 'ip-binary':
      return (
        <svg viewBox="0 0 480 190" role="img" aria-label="IP-Adresse binär mit Netz- und Hostanteil">
          <text x={10} y={22} {...T} fontWeight={700}>192.168.10.25 /24</text>
          {['11000000', '10101000', '00001010', '00011001'].map((b, i) => (
            <g key={i}>
              <rect x={10 + i * 116} y={36} width={110} height={34} rx={5} fill={i < 3 ? 'var(--accent-soft)' : 'var(--flag-soft)'} stroke={i < 3 ? 'var(--accent)' : 'var(--flag)'} />
              <text x={65 + i * 116} y={58} textAnchor="middle" fontFamily="var(--f-mono)" fontSize={13} fill="var(--ink)">{b}</text>
              <text x={65 + i * 116} y={88} textAnchor="middle" {...S}>{[192, 168, 10, 25][i]}</text>
            </g>
          ))}
          <text x={180} y={112} textAnchor="middle" {...S} fill="var(--accent)" fontWeight={700}>Netzanteil (24 Bit)</text>
          <text x={413} y={112} textAnchor="middle" {...S} fill="var(--flag)" fontWeight={700}>Hostanteil (8 Bit)</text>
          <text x={10} y={140} {...S} fontWeight={700}>Stellenwerte eines Oktetts</text>
          {[128, 64, 32, 16, 8, 4, 2, 1].map((v, i) => (
            <g key={v}><rect x={10 + i * 58} y={150} width={52} height={28} rx={4} fill="var(--surface)" stroke="var(--line)" /><text x={36 + i * 58} y={169} textAnchor="middle" fontFamily="var(--f-mono)" fontSize={12} fill="var(--ink)">{v}</text></g>
          ))}
        </svg>
      );
    case 'os-layers':
      return (
        <svg viewBox="0 0 480 200" role="img" aria-label="Schichten von Hardware bis Anwendung">
          {[['Anwendungen', 'Office, Browser, Fachsoftware', 'surface'], ['Betriebssystem', 'Windows, Linux · Benutzer, Dateien, Prozesse', 'accent'], ['Kernel + Treiber', 'steuern die Geräte', 'flag'], ['Hardware / Firmware (UEFI)', 'CPU, RAM, SSD, Netzwerkkarte', 'surface']].map(([l, s2, tone], i) => (
            <Box key={l} x={30 + i * 10} y={8 + i * 47} w={420 - i * 20} h={40} label={l} sub={s2} tone={tone as 'surface'} />
          ))}
        </svg>
      );
    case 'cia':
      return (
        <svg viewBox="0 0 480 230" role="img" aria-label="Schutzziele Vertraulichkeit, Integrität, Verfügbarkeit">
          <polygon points="240,20 420,200 60,200" fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={2} />
          <text x={240} y={14} textAnchor="middle" {...T} fontWeight={800}>Vertraulichkeit</text>
          <text x={240} y={60} textAnchor="middle" {...S}>Verschlüsselung, Rechte</text>
          <text x={60} y={222} textAnchor="middle" {...T} fontWeight={800}>Integrität</text>
          <text x={120} y={186} textAnchor="middle" {...S}>Hash, Signatur</text>
          <text x={420} y={222} textAnchor="middle" {...T} fontWeight={800}>Verfügbarkeit</text>
          <text x={360} y={186} textAnchor="middle" {...S}>Backup, RAID, USV</text>
          <text x={240} y={140} textAnchor="middle" {...T}>Schutzziele</text>
        </svg>
      );
    case 'backup':
      return (
        <svg viewBox="0 0 480 220" role="img" aria-label="Voll, inkrementell, differenziell">
          {['So', 'Mo', 'Di', 'Mi', 'Do'].map((d, i) => <text key={d} x={110 + i * 74} y={18} textAnchor="middle" {...S} fontWeight={700}>{d}</text>)}
          <text x={8} y={52} {...S} fontWeight={700}>Inkrementell</text>
          <text x={8} y={122} {...S} fontWeight={700}>Differenziell</text>
          {[0, 1].map((row) => (
            <g key={row}>
              <rect x={80} y={34 + row * 70} width={60} height={28} rx={4} fill="var(--accent)" /><text x={110} y={53 + row * 70} textAnchor="middle" fill="var(--accent-ink)" fontSize={11} fontWeight={700}>Voll</text>
              {[1, 2, 3, 4].map((i) => (
                <g key={i}>
                  <rect x={80 + i * 74} y={34 + row * 70} width={row === 0 ? 24 : 16 + i * 12} height={28} rx={4} fill="var(--flag-soft)" stroke="var(--flag)" />
                  <text x={84 + i * 74} y={76 + row * 70} {...S}>{row === 0 ? 'seit gestern' : 'seit So'}</text>
                </g>
              ))}
            </g>
          ))}
          <rect x={8} y={165} width={464} height={46} rx={6} fill="var(--surface)" stroke="var(--line)" />
          <text x={20} y={185} {...T} fontWeight={700}>3-2-1-Regel</text>
          <text x={20} y={202} {...S}>3 Kopien · 2 verschiedene Medien · 1 Kopie außer Haus (offline gegen Ransomware)</text>
        </svg>
      );
    case 'dsgvo':
      return (
        <svg viewBox="0 0 480 210" role="img" aria-label="Prüfschema Datenschutz">
          <Defs />
          <Box x={10} y={10} w={140} h={54} label="Personen­bezogen?" sub="Name, IP, Foto …" tone="accent" />
          <Box x={170} y={10} w={140} h={54} label="Rechtsgrundlage" sub="Art. 6: Vertrag, Einwilligung …" />
          <Box x={330} y={10} w={140} h={54} label="Grundsätze" sub="Zweck, Minimierung" />
          <Line x1={150} y1={37} x2={168} y2={37} /><Line x1={310} y1={37} x2={328} y2={37} />
          <Box x={10} y={100} w={140} h={54} label="Betroffenen­rechte" sub="Auskunft, Löschung" />
          <Box x={170} y={100} w={140} h={54} label="TOM (Art. 32)" sub="Verschlüsselung, Rechte" />
          <Box x={330} y={100} w={140} h={54} label="Panne?" sub="Meldung in 72 h" tone="flag" />
          <text x={240} y={190} textAnchor="middle" {...S}>Dienstleister verarbeitet Daten im Auftrag → AVV (Art. 28)</text>
        </svg>
      );
    case 'bezug':
      return (
        <svg viewBox="0 0 480 230" role="img" aria-label="Schema der Bezugskalkulation">
          {[['Listeneinkaufspreis', '2.000,00 €', ''], ['− Liefererrabatt 10 %', '200,00 €', 'flag'], ['= Zieleinkaufspreis', '1.800,00 €', 'accent'], ['− Liefererskonto 2 %', '36,00 €', 'flag'], ['= Bareinkaufspreis', '1.764,00 €', 'accent'], ['+ Bezugskosten', '25,00 €', ''], ['= Bezugspreis', '1.789,00 €', 'good']].map(([l, v, tone], i) => (
            <g key={l}>
              <rect x={40} y={6 + i * 31} width={400} height={27} rx={4} fill={tone === 'accent' ? 'var(--accent-soft)' : tone === 'flag' ? 'var(--flag-soft)' : tone === 'good' ? 'var(--good-soft)' : 'var(--surface)'} stroke="var(--line)" />
              <text x={54} y={24 + i * 31} {...T} fontWeight={l.startsWith('=') ? 700 : 400}>{l}</text>
              <text x={426} y={24 + i * 31} textAnchor="end" fontFamily="var(--f-mono)" fontSize={12} fill="var(--ink)">{v}</text>
            </g>
          ))}
        </svg>
      );
    case 'tco':
      return (
        <svg viewBox="0 0 480 220" role="img" aria-label="TCO als Eisberg">
          <rect x={0} y={70} width={480} height={150} fill="var(--accent-soft)" />
          <text x={470} y={88} textAnchor="end" {...S}>Wasserlinie</text>
          <polygon points="240,10 300,70 180,70" fill="var(--surface)" stroke="var(--ink-3)" />
          <text x={240} y={60} textAnchor="middle" {...S} fontWeight={700}>Kaufpreis</text>
          <polygon points="180,70 300,70 400,210 80,210" fill="var(--surface)" stroke="var(--ink-3)" />
          {['Strom und Verbrauchsmaterial', 'Wartung, Support, Lizenzen', 'Schulung, Ausfallzeiten', 'Entsorgung, Datenlöschung'].map((l, i) => <text key={l} x={240} y={104 + i * 26} textAnchor="middle" {...S}>{l}</text>)}
        </svg>
      );
    case 'projekt':
      return (
        <svg viewBox="0 0 480 160" role="img" aria-label="Ablauf von Bedarf bis Service">
          <Defs />
          {['Bedarf', 'Lastenheft', 'Angebote', 'Bestellung', 'Installation', 'Abnahme', 'Service'].map((l, i) => {
            const row = i < 4 ? 0 : 1;
            const col = i < 4 ? i : i - 4;
            const x = 6 + col * 120;
            const y = row === 0 ? 8 : 92;
            const last = row === 0 ? i === 3 : i === 6;
            return (
              <g key={l}>
                <Box x={x} y={y} w={104} h={44} label={l} tone={l === 'Abnahme' ? 'good' : i === 0 ? 'accent' : 'surface'} />
                {!last && <Line x1={x + 105} y1={y + 22} x2={x + 118} y2={y + 22} />}
              </g>
            );
          })}
          <path d="M418 52 V72 H58 V88" fill="none" stroke="var(--ink-3)" strokeWidth={2} markerEnd="url(#arr)" />
          <text x={420} y={120} textAnchor="middle" {...S}>Dokumentation</text>
          <text x={420} y={134} textAnchor="middle" {...S}>begleitet jeden Schritt</text>
        </svg>
      );
  }
}

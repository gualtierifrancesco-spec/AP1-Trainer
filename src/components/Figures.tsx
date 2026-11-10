import type { FigureId } from '../types';

/** Selbst gezeichnete, schematische Abbildungen für Aufgaben (keine Fotos, keine fremden Vorlagen). */

const ink = 'var(--ink)';
const line = 'var(--ink-3)';
const face = 'var(--surface)';
const label = { fill: ink, fontSize: 15, fontWeight: 800 } as const;
const small = { fill: 'var(--ink-2)', fontSize: 10 } as const;

function Pins({ x, y, cols, rows, dx, dy, r = 1.6, offsetOdd = 0 }: { x: number; y: number; cols: number; rows: number; dx: number; dy: number; r?: number; offsetOdd?: number }) {
  const out = [];
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) out.push(<circle key={`${i}-${j}`} cx={x + i * dx + (j % 2 ? offsetOdd : 0)} cy={y + j * dy} r={r} fill={ink} />);
  return <>{out}</>;
}

export function Figure({ id }: { id: FigureId }) {
  switch (id) {
    case 'ports':
      return (
        <svg viewBox="0 0 480 150" role="img" aria-label="Vier verschiedene Monitoranschlüsse, beschriftet mit A bis D">
          <rect x={4} y={34} width={472} height={78} rx={6} fill="var(--surface-2)" stroke={line} />
          {/* A: DisplayPort – Rechteck mit einer abgeschrägten Ecke */}
          <path d="M28 56 H92 V90 H38 L28 80 Z" fill={face} stroke={ink} strokeWidth={2} />
          <rect x={38} y={68} width={46} height={5} fill={ink} />
          <text x={60} y={24} textAnchor="middle" {...label}>A</text>
          {/* B: HDMI – unten beidseitig abgeschrägt */}
          <path d="M132 58 H200 V76 L190 90 H142 L132 76 Z" fill={face} stroke={ink} strokeWidth={2} />
          <rect x={144} y={68} width={44} height={5} fill={ink} />
          <text x={166} y={24} textAnchor="middle" {...label}>B</text>
          {/* C: DVI-D – breit, eckige Kontakte, flacher Steg */}
          <rect x={236} y={52} width={104} height={42} rx={5} fill={face} stroke={ink} strokeWidth={2} />
          {[0, 1, 2].map((r) => Array.from({ length: 8 }, (_, c) => <rect key={`${r}-${c}`} x={246 + c * 8.6} y={60 + r * 9.5} width={4.4} height={4.4} fill={ink} />))}
          <rect x={320} y={70} width={13} height={3.5} fill={ink} />
          <circle cx={228} cy={73} r={4} fill={face} stroke={ink} /><circle cx={348} cy={73} r={4} fill={face} stroke={ink} />
          <text x={288} y={24} textAnchor="middle" {...label}>C</text>
          {/* D: VGA – Trapez, 15 runde Kontakte in drei Reihen */}
          <path d="M384 54 H456 L448 92 H392 Z" fill={face} stroke={ink} strokeWidth={2} />
          <Pins x={398} y={63} cols={5} rows={3} dx={11} dy={9.5} r={2} offsetOdd={-5} />
          <circle cx={374} cy={73} r={4} fill={face} stroke={ink} /><circle cx={466} cy={73} r={4} fill={face} stroke={ink} />
          <text x={420} y={24} textAnchor="middle" {...label}>D</text>
          <text x={240} y={136} textAnchor="middle" {...small}>Schematische Darstellung, nicht maßstabsgetreu</text>
        </svg>
      );
    case 'ram-slots':
      return (
        <svg viewBox="0 0 480 170" role="img" aria-label="Vier Speichersteckplätze: A1 grau, A2 blau, B1 grau, B2 blau">
          <rect x={4} y={4} width={472} height={162} rx={6} fill="var(--surface-2)" stroke={line} />
          <text x={22} y={90} {...small} transform="rotate(-90 22 90)" textAnchor="middle">Richtung CPU ↑</text>
          {[['DIMM A1', false], ['DIMM A2', true], ['DIMM B1', false], ['DIMM B2', true]].map(([name, blue], i) => {
            const y = 18 + i * 37;
            return (
              <g key={name as string}>
                <rect x={44} y={y} width={330} height={24} rx={3} fill={blue ? 'var(--accent)' : 'var(--ink-3)'} stroke={ink} />
                <rect x={52} y={y + 8} width={150} height={8} fill="var(--surface)" opacity={0.85} />
                <rect x={212} y={y + 8} width={154} height={8} fill="var(--surface)" opacity={0.85} />
                <rect x={36} y={y + 3} width={10} height={18} rx={2} fill={face} stroke={ink} />
                <rect x={372} y={y + 3} width={10} height={18} rx={2} fill={face} stroke={ink} />
                <text x={394} y={y + 17} {...label} fontSize={13}>{name as string}</text>
              </g>
            );
          })}
        </svg>
      );
    case 'usb-ports':
      return (
        <svg viewBox="0 0 480 130" role="img" aria-label="Anschlussfeld mit schwarzen, blauen und einem gelben USB-A-Anschluss mit Blitzsymbol sowie einem USB-C-Anschluss">
          <rect x={4} y={4} width={472} height={122} rx={6} fill="var(--surface-2)" stroke={line} />
          {[
            { x: 28, c: '#2b2b2b', t: 'schwarz' },
            { x: 108, c: '#2b2b2b', t: 'schwarz' },
            { x: 188, c: '#1f6fd6', t: 'blau' },
            { x: 268, c: '#e0b000', t: 'gelb', bolt: true },
          ].map((p) => (
            <g key={p.x}>
              <rect x={p.x} y={34} width={62} height={30} rx={3} fill={face} stroke={ink} strokeWidth={2} />
              <rect x={p.x + 6} y={40} width={50} height={10} fill={p.c} />
              <text x={p.x + 31} y={84} textAnchor="middle" {...small}>{p.t}</text>
              {p.bolt && <path d={`M${p.x + 34} 8 L${p.x + 24} 21 H${p.x + 31} L${p.x + 27} 31 L${p.x + 39} 17 H${p.x + 32} Z`} fill="#e0b000" stroke={ink} strokeWidth={0.8} />}
            </g>
          ))}
          <rect x={372} y={40} width={64} height={20} rx={10} fill={face} stroke={ink} strokeWidth={2} />
          <rect x={384} y={48} width={40} height={4} rx={2} fill={ink} />
          <text x={404} y={84} textAnchor="middle" {...small}>USB-C</text>
          <text x={240} y={112} textAnchor="middle" {...small}>USB-A-Anschlüsse in drei Farben und ein USB-C-Anschluss</text>
        </svg>
      );
  }
}

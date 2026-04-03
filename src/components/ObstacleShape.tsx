import { CELL_SIZE } from '../gameLogic';
import type { Obstacle } from '../types';

interface Props {
  obstacle: Obstacle;
}

export default function ObstacleShape({ obstacle }: Props) {
  const x = obstacle.origin.col * CELL_SIZE;
  const y = obstacle.origin.row * CELL_SIZE;
  const W = obstacle.cols * CELL_SIZE;
  const H = obstacle.rows * CELL_SIZE;

  switch (obstacle.kind) {

    // ── AUTO (2×3 = 100×150px) — top-down parked car ─────────────────────
    case 'auto': return (
      <g style={{ pointerEvents: 'none' }}>
        {/* Body */}
        <rect x={x+4}   y={y+4}   width={W-8}  height={H-8}  rx={8}  fill="#c0392b" stroke="#7b241c" strokeWidth={2} />
        {/* Cabin area (slightly darker) */}
        <rect x={x+10}  y={y+22}  width={W-20} height={H-50} rx={4}  fill="#a93226" />
        {/* Front windshield */}
        <rect x={x+12}  y={y+10}  width={W-24} height={22}   rx={3}  fill="#aed6f1" opacity={0.88} />
        {/* Front hood line */}
        <line x1={x+8}  y1={y+32} x2={x+W-8}  y2={y+32} stroke="#7b241c" strokeWidth={1.5} />
        {/* Side windows */}
        <rect x={x+6}   y={y+35}  width={12}   height={H-76} rx={2}  fill="#aed6f1" opacity={0.6} />
        <rect x={x+W-18} y={y+35} width={12}   height={H-76} rx={2}  fill="#aed6f1" opacity={0.6} />
        {/* Rear windshield */}
        <rect x={x+12}  y={y+H-32} width={W-24} height={22}  rx={3}  fill="#aed6f1" opacity={0.7} />
        {/* Rear trunk line */}
        <line x1={x+8}  y1={y+H-32} x2={x+W-8} y2={y+H-32} stroke="#7b241c" strokeWidth={1.5} />
        {/* Wheels — 4 corners */}
        <rect x={x+1}    y={y+8}    width={9}  height={20} rx={3} fill="#1a1a1a" />
        <rect x={x+W-10} y={y+8}    width={9}  height={20} rx={3} fill="#1a1a1a" />
        <rect x={x+1}    y={y+H-28} width={9}  height={20} rx={3} fill="#1a1a1a" />
        <rect x={x+W-10} y={y+H-28} width={9}  height={20} rx={3} fill="#1a1a1a" />
        {/* Wheel rims */}
        <rect x={x+3}    y={y+11}   width={5}  height={14} rx={2} fill="#555" />
        <rect x={x+W-8}  y={y+11}   width={5}  height={14} rx={2} fill="#555" />
        <rect x={x+3}    y={y+H-25} width={5}  height={14} rx={2} fill="#555" />
        <rect x={x+W-8}  y={y+H-25} width={5}  height={14} rx={2} fill="#555" />
        {/* License plate front */}
        <rect x={x+W/2-12} y={y+5}    width={24} height={7}  rx={1} fill="#e8e8d0" stroke="#aaa" strokeWidth={0.5} />
        {/* License plate rear */}
        <rect x={x+W/2-12} y={y+H-12} width={24} height={7}  rx={1} fill="#e8e8d0" stroke="#aaa" strokeWidth={0.5} />
      </g>
    );

    // ── KIOSK (2×3 = 100×150px) — top-down Ruch/Kolporter kiosk ─────────
    case 'kiosk': return (
      <g style={{ pointerEvents: 'none' }}>
        {/* Foundation / floor */}
        <rect x={x}    y={y}    width={W}    height={H}    fill="#9a8050" />
        {/* Walls */}
        <rect x={x+3}  y={y+3}  width={W-6}  height={H-6}  fill="#c8a855" stroke="#8B7435" strokeWidth={2} />
        {/* Roof/top dark band */}
        <rect x={x+3}  y={y+3}  width={W-6}  height={18}   fill="#6e5420" />
        {/* Sign board (yellow, top) */}
        <rect x={x+8}  y={y+6}  width={W-16} height={11}   rx={1} fill="#f0c040" />
        <text x={x+W/2} y={y+14} textAnchor="middle" fontSize={7} fill="#5a3a00" fontFamily="'Courier New',monospace" fontWeight="bold">RUCH</text>
        {/* Red awning stripe */}
        <rect x={x+3}  y={y+21} width={W-6}  height={8}    fill="#cc2020" opacity={0.85} />
        {/* Main counter / window area */}
        <rect x={x+8}  y={y+32} width={W-16} height={H-65} rx={2} fill="#d4b870" stroke="#9a7830" strokeWidth={1} />
        {/* Glass counter window */}
        <rect x={x+12} y={y+36} width={W-24} height={H-80} rx={1} fill="#c8e8f8" opacity={0.7} stroke="#7aaabb" strokeWidth={1} />
        {/* Shelves inside */}
        <line x1={x+13} y1={y+54} x2={x+W-13} y2={y+54} stroke="#8a7030" strokeWidth={1} opacity={0.6}/>
        <line x1={x+13} y1={y+70} x2={x+W-13} y2={y+70} stroke="#8a7030" strokeWidth={1} opacity={0.6}/>
        {/* Front counter ledge */}
        <rect x={x+4}  y={y+H-30} width={W-8} height={10} fill="#a08040" stroke="#7a6020" strokeWidth={1} />
        {/* Door */}
        <rect x={x+W/2-8} y={y+H-30} width={16} height={27} rx={1} fill="#7a5820" stroke="#5a4010" strokeWidth={1} />
        {/* Door knob */}
        <circle cx={x+W/2+5} cy={y+H-17} r={2} fill="#d4a020" />
      </g>
    );

    // ── ŁAWKA (2×1 = 100×50px) — top-down park bench ────────────────────
    case 'lawka': return (
      <g style={{ pointerEvents: 'none' }}>
        {/* Shadow/ground */}
        <rect x={x+4}  y={y+4}  width={W-8}  height={H-8}  rx={4} fill="#a09070" opacity={0.4} />
        {/* Backrest plank */}
        <rect x={x+5}  y={y+6}  width={W-10} height={10}   rx={3} fill="#7a5c10" stroke="#4a3800" strokeWidth={1.5} />
        {/* Seat plank 1 */}
        <rect x={x+5}  y={y+18} width={W-10} height={9}    rx={2} fill="#8B6914" stroke="#4a3800" strokeWidth={1.2} />
        {/* Seat plank 2 */}
        <rect x={x+5}  y={y+28} width={W-10} height={9}    rx={2} fill="#9a7820" stroke="#4a3800" strokeWidth={1.2} />
        {/* Legs */}
        <rect x={x+9}  y={y+37} width={7}    height={9}    rx={2} fill="#4a3800" />
        <rect x={x+W/2-4} y={y+37} width={7} height={9}   rx={2} fill="#4a3800" />
        <rect x={x+W-16} y={y+37} width={7}  height={9}   rx={2} fill="#4a3800" />
        {/* Armrests */}
        <rect x={x+4}  y={y+5}  width={5}    height={28}   rx={2} fill="#5a4400" />
        <rect x={x+W-9} y={y+5} width={5}    height={28}   rx={2} fill="#5a4400" />
      </g>
    );

    // ── KOSZ (1×1 = 50×50px) — top-down trash bin ────────────────────────
    case 'kosz': return (
      <g style={{ pointerEvents: 'none' }}>
        {/* Bin body */}
        <ellipse cx={x+25} cy={y+28} rx={16} ry={14} fill="#4a4a4a" stroke="#2a2a2a" strokeWidth={1.5} />
        {/* Inner dark */}
        <ellipse cx={x+25} cy={y+27} rx={11} ry={10} fill="#2e2e2e" />
        {/* Lid */}
        <ellipse cx={x+25} cy={y+16} rx={17} ry={6}  fill="#5e5e5e" stroke="#2a2a2a" strokeWidth={1} />
        {/* Handle */}
        <rect    x={x+20}  y={y+8}  width={10} height={5} rx={2} fill="#777" />
        {/* Rib lines */}
        <ellipse cx={x+25} cy={y+28} rx={16} ry={5}  fill="none" stroke="#3a3a3a" strokeWidth={1} opacity={0.6} />
      </g>
    );
  }
}

import { CELL_SIZE } from '../gameLogic';
import type { Obstacle } from '../types';

interface ObstacleShapeProps {
  obstacle: Obstacle;
}

export default function ObstacleShape({ obstacle }: ObstacleShapeProps) {
  const x = obstacle.pos.col * CELL_SIZE;
  const y = obstacle.pos.row * CELL_SIZE;
  const S = CELL_SIZE; // 50

  switch (obstacle.kind) {
    case 'kosz':
      return (
        <g style={{ pointerEvents: 'none' }}>
          {/* Outer bin body */}
          <ellipse cx={x + S/2} cy={y + S/2 + 4} rx={15} ry={16} fill="#4a4a4a" stroke="#2a2a2a" strokeWidth={1.5} />
          {/* Inner shadow */}
          <ellipse cx={x + S/2} cy={y + S/2 + 3} rx={10} ry={11} fill="#333" />
          {/* Lid */}
          <ellipse cx={x + S/2} cy={y + S/2 - 10} rx={16} ry={6} fill="#5e5e5e" stroke="#2a2a2a" strokeWidth={1} />
          {/* Handle */}
          <rect x={x + S/2 - 5} y={y + S/2 - 18} width={10} height={5} rx={2} fill="#777" />
        </g>
      );

    case 'kiosk':
      return (
        <g style={{ pointerEvents: 'none' }}>
          {/* Base walls */}
          <rect x={x + 3} y={y + 6} width={S - 6} height={S - 9} fill="#c8a855" stroke="#8B7435" strokeWidth={1.5} />
          {/* Roof overhang */}
          <rect x={x + 0} y={y + 2} width={S} height={8} fill="#7a6020" />
          {/* Sign strip */}
          <rect x={x + 4} y={y + 3} width={S - 8} height={5} fill="#f0c040" />
          {/* Awning stripe */}
          <rect x={x + 3} y={y + 14} width={S - 6} height={5} fill="#cc2222" opacity={0.85} />
          {/* Counter window */}
          <rect x={x + 7} y={y + 20} width={S - 14} height={16} rx={1} fill="#a8d8f0" stroke="#5a8aaa" strokeWidth={1} />
          {/* Door */}
          <rect x={x + 14} y={y + 36} width={12} height={S - 37} fill="#8B6914" />
        </g>
      );

    case 'auto':
      return (
        <g style={{ pointerEvents: 'none' }}>
          {/* Car body */}
          <rect x={x + 5} y={y + 5} width={S - 10} height={S - 10} rx={5} fill="#c0392b" stroke="#922b21" strokeWidth={1.5} />
          {/* Cabin/roof area */}
          <rect x={x + 10} y={y + 10} width={S - 20} height={S - 20} rx={3} fill="#a93226" />
          {/* Front windshield */}
          <rect x={x + 12} y={y + 11} width={S - 24} height={10} rx={2} fill="#aed6f1" opacity={0.9} />
          {/* Rear window */}
          <rect x={x + 12} y={y + 29} width={S - 24} height={9} rx={2} fill="#aed6f1" opacity={0.7} />
          {/* Wheels — 4 corners */}
          <rect x={x + 2}      y={y + 7}      width={7} height={10} rx={2} fill="#111" />
          <rect x={x + S - 9}  y={y + 7}      width={7} height={10} rx={2} fill="#111" />
          <rect x={x + 2}      y={y + S - 17} width={7} height={10} rx={2} fill="#111" />
          <rect x={x + S - 9}  y={y + S - 17} width={7} height={10} rx={2} fill="#111" />
        </g>
      );
  }
}

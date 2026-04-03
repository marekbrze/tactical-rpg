import { CELL_SIZE } from '../gameLogic';
import type { Position } from '../types';

interface OverlayProps {
  positions: Position[];
  variant: 'move' | 'attack';
}

export default function Overlay({ positions, variant }: OverlayProps) {
  return (
    <>
      {positions.map((pos) => (
        <rect
          key={`${pos.row}-${pos.col}`}
          x={pos.col * CELL_SIZE}
          y={pos.row * CELL_SIZE}
          width={CELL_SIZE}
          height={CELL_SIZE}
          className={`overlay overlay--${variant}`}
          style={{ pointerEvents: 'none' }}
        />
      ))}
    </>
  );
}

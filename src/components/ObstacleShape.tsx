import { CELL_SIZE } from '../gameLogic';
import type { Obstacle } from '../types';

interface Props {
  obstacle: Obstacle;
}

export default function ObstacleShape({ obstacle }: Props) {
  const x = obstacle.origin.col * CELL_SIZE;
  const y = obstacle.origin.row * CELL_SIZE;

  return (
    <image
      href={`${import.meta.env.BASE_URL}assets/sprites/${obstacle.kind}.svg`}
      x={x}
      y={y}
      width={obstacle.cols * CELL_SIZE}
      height={obstacle.rows * CELL_SIZE}
      style={{ imageRendering: 'pixelated', pointerEvents: 'none' }}
    />
  );
}

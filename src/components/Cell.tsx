import { CELL_SIZE } from '../gameLogic';

interface CellProps {
  row: number;
  col: number;
}

export default function Cell({ row, col }: CellProps) {
  const x = col * CELL_SIZE;
  const y = row * CELL_SIZE;
  const tile = (row + col) % 2 === 0 ? 'asphalt-a' : 'asphalt-b';

  return (
    <g>
      <image
        href={`/assets/sprites/${tile}.svg`}
        x={x}
        y={y}
        width={CELL_SIZE}
        height={CELL_SIZE}
        style={{ imageRendering: 'pixelated' }}
      />
      {/* Transparent hit-target — preserves data-row/data-col for Board's click handler */}
      <rect
        x={x}
        y={y}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill="none"
        className="cell"
        data-row={row}
        data-col={col}
      />
    </g>
  );
}

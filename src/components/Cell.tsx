import { CELL_SIZE } from '../gameLogic';

interface CellProps {
  row: number;
  col: number;
}

export default function Cell({ row, col }: CellProps) {
  const x = col * CELL_SIZE;
  const y = row * CELL_SIZE;
  const checker = (row + col) % 2 === 0 ? 'cell-a' : 'cell-b';

  return (
    <rect
      x={x}
      y={y}
      width={CELL_SIZE}
      height={CELL_SIZE}
      className={`cell ${checker}`}
      data-row={row}
      data-col={col}
    />
  );
}

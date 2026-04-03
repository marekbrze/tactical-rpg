import { CELL_SIZE } from '../gameLogic';
import type { Figure as FigureType } from '../types';

interface FigureProps {
  figure: FigureType;
  isSelected: boolean;
}

const RADIUS = 18;
const HP_BAR_HEIGHT = 4;
const HP_BAR_WIDTH = CELL_SIZE - 10;

export default function Figure({ figure, isSelected }: FigureProps) {
  const cx = figure.pos.col * CELL_SIZE + CELL_SIZE / 2;
  const cy = figure.pos.row * CELL_SIZE + CELL_SIZE / 2;

  const hpRatio = figure.hp / figure.maxHp;
  const hpBarX = cx - HP_BAR_WIDTH / 2;
  const hpBarY = cy + RADIUS - 2;

  const spent = figure.hasMoved && figure.hasAttacked;
  const label = figure.team === 'skejci'
    ? `S${figure.id.split('-')[1] ? String(Number(figure.id.split('-')[1]) + 1) : ''}`
    : `D${figure.id.split('-')[1] ? String(Number(figure.id.split('-')[1]) + 1) : ''}`;

  return (
    <g
      className={`figure figure--${figure.team}${isSelected ? ' figure--selected' : ''}${spent ? ' figure--spent' : ''}`}
      data-row={figure.pos.row}
      data-col={figure.pos.col}
      data-figureid={figure.id}
    >
      {/* Selection ring */}
      {isSelected && (
        <circle
          cx={cx}
          cy={cy}
          r={RADIUS + 4}
          className="figure__selection-ring"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Body */}
      <circle
        cx={cx}
        cy={cy}
        r={RADIUS}
        className="figure__body"
        data-row={figure.pos.row}
        data-col={figure.pos.col}
        data-figureid={figure.id}
      />

      {/* Label */}
      <text
        x={cx}
        y={cy + 5}
        textAnchor="middle"
        className="figure__label"
        style={{ pointerEvents: 'none' }}
      >
        {label}
      </text>

      {/* HP bar background */}
      <rect
        x={hpBarX}
        y={hpBarY}
        width={HP_BAR_WIDTH}
        height={HP_BAR_HEIGHT}
        className="figure__hp-bg"
        style={{ pointerEvents: 'none' }}
      />

      {/* HP bar fill */}
      <rect
        x={hpBarX}
        y={hpBarY}
        width={HP_BAR_WIDTH * hpRatio}
        height={HP_BAR_HEIGHT}
        className={`figure__hp-fill figure__hp-fill--${hpRatio > 0.5 ? 'ok' : hpRatio > 0.25 ? 'low' : 'critical'}`}
        style={{ pointerEvents: 'none' }}
      />
    </g>
  );
}

import { CELL_SIZE } from '../gameLogic';
import type { Figure as FigureType } from '../types';

interface FigureProps {
  figure: FigureType;
  isSelected: boolean;
}

const HP_BAR_HEIGHT = 4;
const HP_BAR_WIDTH = CELL_SIZE - 10;

export default function Figure({ figure, isSelected }: FigureProps) {
  const x = figure.pos.col * CELL_SIZE;
  const y = figure.pos.row * CELL_SIZE;

  const hpRatio = figure.hp / figure.maxHp;
  const hpBarX = x + (CELL_SIZE - HP_BAR_WIDTH) / 2;
  const hpBarY = y + CELL_SIZE - HP_BAR_HEIGHT - 2;

  const spent = figure.hasMoved && figure.hasAttacked;
  const sprite = figure.team === 'skejci' ? 'skejc' : 'dresiar';

  return (
    <g
      className={`figure figure--${figure.team}${isSelected ? ' figure--selected' : ''}${spent ? ' figure--spent' : ''}`}
    >
      {/* Selection ring — square cursor suits pixel art */}
      {isSelected && (
        <rect
          x={x + 2}
          y={y + 2}
          width={CELL_SIZE - 4}
          height={CELL_SIZE - 4}
          className="figure__selection-ring"
          style={{ pointerEvents: 'none' }}
        />
      )}

      {/* Pixel art sprite */}
      <image
        href={`${import.meta.env.BASE_URL}assets/sprites/${sprite}.svg`}
        x={x}
        y={y}
        width={CELL_SIZE}
        height={CELL_SIZE}
        style={{ imageRendering: 'pixelated', pointerEvents: 'none' }}
      />

      {/* Transparent click target — carries data-* for Board's event handler */}
      <rect
        x={x}
        y={y}
        width={CELL_SIZE}
        height={CELL_SIZE}
        fill="none"
        data-row={figure.pos.row}
        data-col={figure.pos.col}
        data-figureid={figure.id}
      />

      {/* HP bar */}
      <rect
        x={hpBarX}
        y={hpBarY}
        width={HP_BAR_WIDTH}
        height={HP_BAR_HEIGHT}
        className="figure__hp-bg"
        style={{ pointerEvents: 'none' }}
      />
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

import type { GameState, GameAction } from '../types';
import { GRID_ROWS, GRID_COLS, CELL_SIZE } from '../gameLogic';
import { resolveClick } from '../reducer';
import Cell from './Cell';
import Figure from './Figure';
import Overlay from './Overlay';
import ObstacleShape from './ObstacleShape';
import './Board.css';

interface BoardProps {
  state: GameState;
  dispatch: (action: GameAction) => void;
}

const VIEW_W = GRID_COLS * CELL_SIZE;
const VIEW_H = GRID_ROWS * CELL_SIZE;

export default function Board({ state, dispatch }: BoardProps) {
  function handleClick(e: React.MouseEvent<SVGSVGElement>) {
    const target = e.target as SVGElement;

    let el: Element | null = target;
    while (el && el !== e.currentTarget) {
      const row = (el as HTMLElement).dataset?.row;
      const col = (el as HTMLElement).dataset?.col;
      if (row !== undefined && col !== undefined) {
        resolveClick(state, Number(row), Number(col), dispatch);
        return;
      }
      el = el.parentElement;
    }
  }

  const cells = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      cells.push(<Cell key={`${r}-${c}`} row={r} col={c} />);
    }
  }

  return (
    <div className="board-container">
      <svg
        className="board"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        onClick={handleClick}
      >
        {/* Layer 1: grid cells */}
        {cells}

        {/* Layer 2: valid move highlights */}
        <Overlay positions={state.validMoves} variant="move" />

        {/* Layer 3: valid attack highlights */}
        <Overlay positions={state.validAttacks} variant="attack" />

        {/* Layer 4: obstacles (non-interactive) */}
        {state.obstacles.map((obs) => (
          <ObstacleShape
            key={`${obs.pos.row}-${obs.pos.col}`}
            obstacle={obs}
          />
        ))}

        {/* Layer 5: figures */}
        {state.figures
          .filter((f) => f.hp > 0)
          .map((f) => (
            <Figure
              key={f.id}
              figure={f}
              isSelected={f.id === state.selectedFigureId}
            />
          ))}
      </svg>
    </div>
  );
}

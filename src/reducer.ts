import type { Figure, Obstacle, GameState, GameAction, TeamId } from './types';
import {
  computeMoveRange,
  computeAttackRange,
  posInList,
  figureAt,
} from './gameLogic';

const MAX_HP = 50;
const MOVE_RANGE = 4;
const ATTACK_DAMAGE = 15;

function makeFigure(
  team: TeamId,
  index: number,
  row: number,
  col: number,
): Figure {
  return {
    id: `${team}-${index}`,
    team,
    name: `${team === 'skejci' ? 'Skejter' : 'Dres'} #${index + 1}`,
    hp: MAX_HP,
    maxHp: MAX_HP,
    moveRange: MOVE_RANGE,
    attackDamage: ATTACK_DAMAGE,
    pos: { row, col },
    hasMoved: false,
    hasAttacked: false,
  };
}

// cols=2 rows=3 → 6 cells (≈ samochód / kiosk)
// cols=2 rows=1 → 2 cells (≈ ławka)
// cols=1 rows=1 → 1 cell  (≈ kosz)
const OBSTACLES: Obstacle[] = [
  // Auta (2×3)
  { id: 'auto-0', kind: 'auto',  origin: { row: 1,  col: 7  }, cols: 2, rows: 3 },
  { id: 'auto-1', kind: 'auto',  origin: { row: 1,  col: 11 }, cols: 2, rows: 3 },
  { id: 'auto-2', kind: 'auto',  origin: { row: 10, col: 7  }, cols: 2, rows: 3 },
  { id: 'auto-3', kind: 'auto',  origin: { row: 10, col: 11 }, cols: 2, rows: 3 },
  // Kiosks (2×3)
  { id: 'kiosk-0', kind: 'kiosk', origin: { row: 4, col: 4  }, cols: 2, rows: 3 },
  { id: 'kiosk-1', kind: 'kiosk', origin: { row: 4, col: 14 }, cols: 2, rows: 3 },
  { id: 'kiosk-2', kind: 'kiosk', origin: { row: 6, col: 9  }, cols: 2, rows: 3 },
  // Ławki (2×1)
  { id: 'lawka-0', kind: 'lawka', origin: { row: 0,  col: 9  }, cols: 2, rows: 1 },
  { id: 'lawka-1', kind: 'lawka', origin: { row: 7,  col: 5  }, cols: 2, rows: 1 },
  { id: 'lawka-2', kind: 'lawka', origin: { row: 7,  col: 13 }, cols: 2, rows: 1 },
  { id: 'lawka-3', kind: 'lawka', origin: { row: 13, col: 9  }, cols: 2, rows: 1 },
  // Kosze (1×1)
  { id: 'kosz-0', kind: 'kosz', origin: { row: 0,  col: 6  }, cols: 1, rows: 1 },
  { id: 'kosz-1', kind: 'kosz', origin: { row: 0,  col: 13 }, cols: 1, rows: 1 },
  { id: 'kosz-2', kind: 'kosz', origin: { row: 3,  col: 9  }, cols: 1, rows: 1 },
  { id: 'kosz-3', kind: 'kosz', origin: { row: 3,  col: 10 }, cols: 1, rows: 1 },
  { id: 'kosz-4', kind: 'kosz', origin: { row: 9,  col: 8  }, cols: 1, rows: 1 },
  { id: 'kosz-5', kind: 'kosz', origin: { row: 9,  col: 11 }, cols: 1, rows: 1 },
  { id: 'kosz-6', kind: 'kosz', origin: { row: 13, col: 6  }, cols: 1, rows: 1 },
  { id: 'kosz-7', kind: 'kosz', origin: { row: 13, col: 13 }, cols: 1, rows: 1 },
];

export function createInitialState(): GameState {
  const figures: Figure[] = [
    makeFigure('skejci', 0, 1,  0),
    makeFigure('skejci', 1, 4,  0),
    makeFigure('skejci', 2, 6,  0),
    makeFigure('skejci', 3, 9,  0),
    makeFigure('skejci', 4, 12, 0),
    makeFigure('dresy',  0, 1,  19),
    makeFigure('dresy',  1, 4,  19),
    makeFigure('dresy',  2, 6,  19),
    makeFigure('dresy',  3, 9,  19),
    makeFigure('dresy',  4, 12, 19),
  ];

  return {
    figures,
    obstacles: OBSTACLES,
    currentTeam: 'skejci',
    phase: 'idle',
    selectedFigureId: null,
    validMoves: [],
    validAttacks: [],
    log: ['Gra rozpoczęta. Ruch: Skejci.'],
    winner: null,
  };
}

function checkWinner(figures: Figure[]): TeamId | null {
  const skejciAlive = figures.some((f) => f.team === 'skejci' && f.hp > 0);
  const dresyAlive  = figures.some((f) => f.team === 'dresy'  && f.hp > 0);
  if (!skejciAlive) return 'dresy';
  if (!dresyAlive)  return 'skejci';
  return null;
}

function addLog(log: string[], msg: string): string[] {
  return [...log.slice(-9), msg];
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  if (state.winner) return state;

  switch (action.type) {
    case 'SELECT_FIGURE': {
      const figure = state.figures.find((f) => f.id === action.figureId);
      if (!figure || figure.team !== state.currentTeam || figure.hp <= 0) return state;
      if (figure.hasMoved && figure.hasAttacked) return state;

      const validMoves   = figure.hasMoved ? [] : computeMoveRange(figure, state.figures, state.obstacles);
      const validAttacks = computeAttackRange(figure, state.figures);

      return { ...state, phase: figure.hasMoved ? 'moved' : 'selected', selectedFigureId: figure.id, validMoves, validAttacks };
    }

    case 'MOVE_FIGURE': {
      if (state.phase !== 'selected' || !state.selectedFigureId) return state;
      if (!posInList(action.to, state.validMoves)) return state;

      const figures = state.figures.map((f) =>
        f.id === state.selectedFigureId ? { ...f, pos: action.to, hasMoved: true } : f,
      );
      const moved        = figures.find((f) => f.id === state.selectedFigureId)!;
      const validAttacks = computeAttackRange(moved, figures);

      return { ...state, figures, phase: 'moved', validMoves: [], validAttacks };
    }

    case 'ATTACK_FIGURE': {
      if (!state.selectedFigureId) return state;
      if (state.phase !== 'selected' && state.phase !== 'moved') return state;

      const attacker = state.figures.find((f) => f.id === state.selectedFigureId);
      const target   = state.figures.find((f) => f.id === action.targetId);
      if (!attacker || !target) return state;
      if (!posInList(target.pos, state.validAttacks)) return state;

      const damage = attacker.attackDamage;
      const newHp  = Math.max(0, target.hp - damage);
      const figures = state.figures.map((f) => {
        if (f.id === attacker.id) return { ...f, hasAttacked: true };
        if (f.id === target.id)   return { ...f, hp: newHp };
        return f;
      });

      const winner = checkWinner(figures);
      const logMsg = newHp <= 0
        ? `${attacker.name} nokautuje ${target.name}!`
        : `${attacker.name} atakuje ${target.name} (-${damage} HP → ${newHp})`;

      return { ...state, figures, phase: 'idle', selectedFigureId: null, validMoves: [], validAttacks: [], winner, log: addLog(state.log, logMsg) };
    }

    case 'END_TURN': {
      const nextTeam: TeamId = state.currentTeam === 'skejci' ? 'dresy' : 'skejci';
      const figures = state.figures.map((f) =>
        f.team === nextTeam ? { ...f, hasMoved: false, hasAttacked: false } : f,
      );
      const teamName = nextTeam === 'skejci' ? 'Skejci' : 'Dresy';
      return { ...state, figures, currentTeam: nextTeam, phase: 'idle', selectedFigureId: null, validMoves: [], validAttacks: [], log: addLog(state.log, `Ruch: ${teamName}.`) };
    }

    case 'DESELECT':
      return { ...state, phase: 'idle', selectedFigureId: null, validMoves: [], validAttacks: [] };

    default:
      return state;
  }
}

export function resolveClick(
  state: GameState,
  row: number,
  col: number,
  dispatch: (action: GameAction) => void,
) {
  const pos = { row, col };
  const clickedFigure = figureAt(pos, state.figures);

  if (clickedFigure && clickedFigure.team === state.currentTeam) {
    if (state.selectedFigureId === clickedFigure.id && state.phase !== 'moved') {
      dispatch({ type: 'DESELECT' });
    } else {
      dispatch({ type: 'SELECT_FIGURE', figureId: clickedFigure.id });
    }
    return;
  }

  if (clickedFigure && clickedFigure.team !== state.currentTeam) {
    if (state.selectedFigureId && posInList(pos, state.validAttacks) && (state.phase === 'selected' || state.phase === 'moved')) {
      dispatch({ type: 'ATTACK_FIGURE', targetId: clickedFigure.id });
    }
    return;
  }

  if (!clickedFigure) {
    if (state.selectedFigureId && posInList(pos, state.validMoves)) {
      dispatch({ type: 'MOVE_FIGURE', to: pos });
      return;
    }
    if (state.selectedFigureId) dispatch({ type: 'DESELECT' });
  }
}

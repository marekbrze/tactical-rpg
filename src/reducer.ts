import type { Figure, GameState, GameAction, TeamId } from './types';
import {
  computeMoveRange,
  computeAttackRange,
  posInList,
  figureAt,
} from './gameLogic';

const MAX_HP = 50;
const MOVE_RANGE = 3;
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

export function createInitialState(): GameState {
  const figures: Figure[] = [
    // Skejci — lewa strona (kol 0-1)
    makeFigure('skejci', 0, 1, 0),
    makeFigure('skejci', 1, 3, 0),
    makeFigure('skejci', 2, 5, 0),
    makeFigure('skejci', 3, 7, 0),
    makeFigure('skejci', 4, 9, 1),
    // Dresy — prawa strona (kol 10-11)
    makeFigure('dresy', 0, 1, 11),
    makeFigure('dresy', 1, 3, 11),
    makeFigure('dresy', 2, 5, 11),
    makeFigure('dresy', 3, 7, 11),
    makeFigure('dresy', 4, 9, 10),
  ];

  return {
    figures,
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
  const dresyAlive = figures.some((f) => f.team === 'dresy' && f.hp > 0);
  if (!skejciAlive) return 'dresy';
  if (!dresyAlive) return 'skejci';
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
      if (!figure || figure.team !== state.currentTeam || figure.hp <= 0)
        return state;
      if (figure.hasMoved && figure.hasAttacked) return state;

      const validMoves = figure.hasMoved
        ? []
        : computeMoveRange(figure, state.figures);
      const validAttacks = computeAttackRange(figure, state.figures);

      return {
        ...state,
        phase: figure.hasMoved ? 'moved' : 'selected',
        selectedFigureId: figure.id,
        validMoves,
        validAttacks,
      };
    }

    case 'MOVE_FIGURE': {
      if (state.phase !== 'selected' || !state.selectedFigureId) return state;
      if (!posInList(action.to, state.validMoves)) return state;

      const figures = state.figures.map((f) =>
        f.id === state.selectedFigureId
          ? { ...f, pos: action.to, hasMoved: true }
          : f,
      );

      const moved = figures.find((f) => f.id === state.selectedFigureId)!;
      const validAttacks = computeAttackRange(moved, figures);

      return {
        ...state,
        figures,
        phase: 'moved',
        validMoves: [],
        validAttacks,
      };
    }

    case 'ATTACK_FIGURE': {
      if (!state.selectedFigureId) return state;
      if (state.phase !== 'selected' && state.phase !== 'moved') return state;

      const attacker = state.figures.find(
        (f) => f.id === state.selectedFigureId,
      );
      const target = state.figures.find((f) => f.id === action.targetId);
      if (!attacker || !target) return state;
      if (!posInList(target.pos, state.validAttacks)) return state;

      const damage = attacker.attackDamage;
      const newHp = Math.max(0, target.hp - damage);

      const figures = state.figures.map((f) => {
        if (f.id === attacker.id) return { ...f, hasAttacked: true };
        if (f.id === target.id) return { ...f, hp: newHp };
        return f;
      });

      const winner = checkWinner(figures);
      const logMsg =
        newHp <= 0
          ? `${attacker.name} nokautuje ${target.name}!`
          : `${attacker.name} atakuje ${target.name} (-${damage} HP → ${newHp})`;

      return {
        ...state,
        figures,
        phase: 'idle',
        selectedFigureId: null,
        validMoves: [],
        validAttacks: [],
        winner,
        log: addLog(state.log, logMsg),
      };
    }

    case 'END_TURN': {
      const nextTeam: TeamId =
        state.currentTeam === 'skejci' ? 'dresy' : 'skejci';
      const figures = state.figures.map((f) =>
        f.team === nextTeam ? { ...f, hasMoved: false, hasAttacked: false } : f,
      );
      const teamName = nextTeam === 'skejci' ? 'Skejci' : 'Dresy';

      return {
        ...state,
        figures,
        currentTeam: nextTeam,
        phase: 'idle',
        selectedFigureId: null,
        validMoves: [],
        validAttacks: [],
        log: addLog(state.log, `Ruch: ${teamName}.`),
      };
    }

    case 'DESELECT': {
      return {
        ...state,
        phase: 'idle',
        selectedFigureId: null,
        validMoves: [],
        validAttacks: [],
      };
    }

    default:
      return state;
  }
}

// Handle click on the board — dispatches correct action based on game state
export function resolveClick(
  state: GameState,
  row: number,
  col: number,
  dispatch: (action: GameAction) => void,
) {
  const pos = { row, col };
  const clickedFigure = figureAt(pos, state.figures);

  // Click on own figure → select/reselect
  if (clickedFigure && clickedFigure.team === state.currentTeam) {
    if (
      state.selectedFigureId === clickedFigure.id &&
      state.phase !== 'moved'
    ) {
      dispatch({ type: 'DESELECT' });
    } else {
      dispatch({ type: 'SELECT_FIGURE', figureId: clickedFigure.id });
    }
    return;
  }

  // Click on enemy figure → attack if valid
  if (clickedFigure && clickedFigure.team !== state.currentTeam) {
    if (
      state.selectedFigureId &&
      posInList(pos, state.validAttacks) &&
      (state.phase === 'selected' || state.phase === 'moved')
    ) {
      dispatch({ type: 'ATTACK_FIGURE', targetId: clickedFigure.id });
    }
    return;
  }

  // Click on empty cell → move if valid
  if (!clickedFigure) {
    if (state.selectedFigureId && posInList(pos, state.validMoves)) {
      dispatch({ type: 'MOVE_FIGURE', to: pos });
      return;
    }
    // Click empty non-valid cell → deselect
    if (state.selectedFigureId) {
      dispatch({ type: 'DESELECT' });
    }
  }
}

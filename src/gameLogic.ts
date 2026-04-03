import type { Figure, Obstacle, Position } from './types';

export const GRID_ROWS = 14;
export const GRID_COLS = 20;
export const CELL_SIZE = 50;

export function posEq(a: Position, b: Position): boolean {
  return a.row === b.row && a.col === b.col;
}

export function chebyshev(a: Position, b: Position): number {
  return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
}

export function obstacleKeys(obs: Obstacle): string[] {
  const keys: string[] = [];
  for (let r = obs.origin.row; r < obs.origin.row + obs.rows; r++) {
    for (let c = obs.origin.col; c < obs.origin.col + obs.cols; c++) {
      keys.push(`${r},${c}`);
    }
  }
  return keys;
}

export function computeMoveRange(
  figure: Figure,
  allFigures: Figure[],
  obstacles: Obstacle[],
): Position[] {
  const blocked = new Set<string>();

  for (const f of allFigures) {
    if (f.id !== figure.id) blocked.add(`${f.pos.row},${f.pos.col}`);
  }
  for (const o of obstacles) {
    for (const key of obstacleKeys(o)) blocked.add(key);
  }

  const results: Position[] = [];
  for (let r = 0; r < GRID_ROWS; r++) {
    for (let c = 0; c < GRID_COLS; c++) {
      const dist = chebyshev(figure.pos, { row: r, col: c });
      if (dist > 0 && dist <= figure.moveRange && !blocked.has(`${r},${c}`)) {
        results.push({ row: r, col: c });
      }
    }
  }
  return results;
}

export function computeAttackRange(
  figure: Figure,
  allFigures: Figure[],
): Position[] {
  return allFigures
    .filter((f) => f.team !== figure.team && f.hp > 0)
    .filter((f) => chebyshev(figure.pos, f.pos) === 1)
    .map((f) => f.pos);
}

export function posInList(pos: Position, list: Position[]): boolean {
  return list.some((p) => posEq(p, pos));
}

export function figureAt(
  pos: Position,
  figures: Figure[],
): Figure | undefined {
  return figures.find((f) => posEq(f.pos, pos) && f.hp > 0);
}

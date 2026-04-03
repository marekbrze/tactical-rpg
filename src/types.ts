export type TeamId = 'skejci' | 'dresy';
export type TurnPhase = 'idle' | 'selected' | 'moved';
export type ObstacleKind = 'kosz' | 'kiosk' | 'auto';

export interface Obstacle {
  pos: Position;
  kind: ObstacleKind;
}

export interface Position {
  row: number;
  col: number;
}

export interface Figure {
  id: string;
  team: TeamId;
  name: string;
  hp: number;
  maxHp: number;
  moveRange: number;
  attackDamage: number;
  pos: Position;
  hasMoved: boolean;
  hasAttacked: boolean;
}

export interface GameState {
  figures: Figure[];
  obstacles: Obstacle[];
  currentTeam: TeamId;
  phase: TurnPhase;
  selectedFigureId: string | null;
  validMoves: Position[];
  validAttacks: Position[];
  log: string[];
  winner: TeamId | null;
}

export type GameAction =
  | { type: 'SELECT_FIGURE'; figureId: string }
  | { type: 'MOVE_FIGURE'; to: Position }
  | { type: 'ATTACK_FIGURE'; targetId: string }
  | { type: 'END_TURN' }
  | { type: 'DESELECT' };

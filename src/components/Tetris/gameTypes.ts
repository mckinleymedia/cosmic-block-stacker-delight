
import { TetrominoType } from './tetrominos';

export type Cell = {
  filled: boolean;
  color: string;
};

export type Position = {
  x: number;
  y: number;
};

export type ActiveTetromino = {
  type: TetrominoType;
  position: Position;
  shape: number[][];
};

export type GameState = {
  board: Cell[][];
  activeTetromino: ActiveTetromino | null;
  nextTetromino: TetrominoType;
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  isPaused: boolean;
};

export type GameAction = 
  | 'LEFT' 
  | 'RIGHT' 
  | 'DOWN' 
  | 'ROTATE' 
  | 'PAUSE' 
  | 'RESTART'
  | 'QUIT';

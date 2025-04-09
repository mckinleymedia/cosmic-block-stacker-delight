
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
  nextTetrominoShape: number[][]; // The preselected shape for the next tetromino
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  isPaused: boolean;
  quadMode: boolean; // Add quad mode flag
};

export type GameAction = 
  | 'LEFT' 
  | 'RIGHT' 
  | 'DOWN' 
  | 'ROTATE' 
  | 'PAUSE' 
  | 'RESTART'
  | 'QUIT'
  | 'TOGGLE_QUAD_MODE'; // Add new action

export type LeaderboardEntry = {
  id: string;
  playerName: string;
  score: number;
  level: number;
  linesCleared: number;
  date: string;
};

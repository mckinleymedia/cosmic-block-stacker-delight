
import { TetrominoType } from './tetrominos';

export type Cell = {
  filled: boolean;
  color: string;
};

export type Position = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type ActiveTetromino = {
  type: TetrominoType;
  position: Position;
  shape: number[][];
  direction?: Direction; // Direction for quad mode
};

export type QuadScores = {
  up: number;
  down: number;
  left: number;
  right: number;
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
  quadDirection?: Direction; // Current direction in quad mode
  quadScores: QuadScores; // Separate scores for each quad direction
  quadLinesCleared: QuadScores; // Separate lines cleared for each quad direction
};

export type GameAction = 
  | 'LEFT' 
  | 'RIGHT' 
  | 'DOWN' 
  | 'ROTATE' 
  | 'PAUSE' 
  | 'RESTART'
  | 'QUIT'
  | 'TOGGLE_QUAD_MODE'; // Add toggle quad mode action

export type LeaderboardEntry = {
  id: string;
  playerName: string;
  score: number;
  level: number;
  linesCleared: number;
  date: string;
};

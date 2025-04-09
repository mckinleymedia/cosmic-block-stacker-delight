
import { BOARD_HEIGHT, BOARD_WIDTH, POINTS } from './gameConstants';
import { Cell, ActiveTetromino, GameState, Position, Direction, QuadScores } from './gameTypes';
import { TETROMINOS } from './tetrominos';

// Create an empty board
export const createEmptyBoard = (): Cell[][] => {
  return Array(BOARD_HEIGHT).fill(null).map(() => 
    Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' }))
  );
};

// Check for collision
export const checkCollision = (
  position: Position, 
  shape: number[][], 
  board: Cell[][]
): boolean => {
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const boardX = position.x + x;
        const boardY = position.y + y;

        // Skip collision detection for cells above the board
        if (boardY < 0) {
          continue;
        }

        if (
          boardX < 0 || 
          boardX >= BOARD_WIDTH || 
          boardY >= BOARD_HEIGHT
        ) {
          return true;
        }

        if (boardY >= 0 && board[boardY][boardX].filled) {
          return true;
        }
      }
    }
  }
  return false;
};

// Update board with locked tetromino and handle line clearing
export const updateBoardWithTetromino = (
  gameState: GameState
): { 
  newBoard: Cell[][], 
  linesCleared: number, 
  pointsScored: number,
  quadDirection?: Direction,
  quadLinesCleared?: Partial<QuadScores>,
  quadPointsScored?: Partial<QuadScores>
} => {
  if (!gameState.activeTetromino) {
    return { 
      newBoard: gameState.board, 
      linesCleared: 0, 
      pointsScored: 0 
    };
  }

  const { position, shape, type, direction } = gameState.activeTetromino;
  const newBoard = JSON.parse(JSON.stringify(gameState.board));
  
  // Place the tetromino on the board
  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      if (shape[y][x] !== 0) {
        const boardY = position.y + y;
        const boardX = position.x + x;
        
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = {
            filled: true,
            color: TETROMINOS[type].color
          };
        }
      }
    }
  }

  // Check for completed lines
  const completedLines: number[] = [];
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (newBoard[y].every(cell => cell.filled)) {
      completedLines.push(y);
    }
  }

  // Remove completed lines and add new empty lines at the top
  if (completedLines.length > 0) {
    for (const line of completedLines) {
      newBoard.splice(line, 1);
      newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' })));
    }
  }
  
  const pointsScored = completedLines.length > 0 
    ? POINTS[completedLines.length as keyof typeof POINTS] * gameState.level
    : 0;
  
  // For quad mode, track which direction gets the points
  if (gameState.quadMode && direction) {
    const quadLinesCleared: Partial<QuadScores> = {};
    const quadPointsScored: Partial<QuadScores> = {};
    
    if (completedLines.length > 0) {
      quadLinesCleared[direction.toLowerCase() as keyof QuadScores] = completedLines.length;
      quadPointsScored[direction.toLowerCase() as keyof QuadScores] = pointsScored;
    }
    
    return {
      newBoard,
      linesCleared: completedLines.length,
      pointsScored: gameState.quadMode ? 0 : pointsScored, // In quad mode, we use separate scoring
      quadDirection: direction,
      quadLinesCleared,
      quadPointsScored
    };
  }
  
  return {
    newBoard,
    linesCleared: completedLines.length,
    pointsScored
  };
};


import { ActiveTetromino, Position, GameState } from './gameTypes';
import { BOARD_WIDTH } from './gameConstants';
import { checkCollision } from './boardUtils';
import { randomTetromino, TETROMINOS, rotateTetromino as rotateMatrix, TetrominoType, getRandomlyRotatedShape } from './tetrominos';

// Get initial position for a new tetromino
export const getInitialPosition = (): Position => {
  return { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
};

// Find the lowest block in each column of the tetromino shape
const findLowestBlocks = (shape: number[][]): number => {
  const height = shape.length;
  
  // Start from the bottom of the shape and move up
  for (let y = height - 1; y >= 0; y--) {
    // Check if this row has any filled cells
    if (shape[y].some(cell => cell !== 0)) {
      return y;
    }
  }
  
  return 0; // Default if shape is empty (shouldn't happen with valid tetrominos)
};

// Create a new active tetromino
export const createTetromino = (type: TetrominoType): ActiveTetromino => {
  const shape = getRandomlyRotatedShape(type);
  const lowestRow = findLowestBlocks(shape);
  
  // Position the piece so its lowest row is at y=0
  const position = getInitialPosition();
  position.y = -lowestRow;
  
  return {
    type,
    position,
    shape
  };
};

// Move tetromino in a direction if possible
export const moveTetromino = (
  gameState: GameState,
  direction: 'LEFT' | 'RIGHT' | 'DOWN'
): { 
  newTetromino: ActiveTetromino | null, 
  collided: boolean 
} => {
  if (!gameState.activeTetromino) {
    return { newTetromino: null, collided: false };
  }

  const { position, shape } = gameState.activeTetromino;
  let newPosition = { ...position };

  if (direction === 'LEFT') {
    newPosition.x -= 1;
  } else if (direction === 'RIGHT') {
    newPosition.x += 1;
  } else if (direction === 'DOWN') {
    newPosition.y += 1;
  }

  const hasCollision = checkCollision(newPosition, shape, gameState.board);

  if (!hasCollision) {
    return { 
      newTetromino: {
        ...gameState.activeTetromino,
        position: newPosition
      },
      collided: false
    };
  } else if (direction === 'DOWN') {
    return { newTetromino: gameState.activeTetromino, collided: true };
  }
  
  return { newTetromino: gameState.activeTetromino, collided: false };
};

// Rotate tetromino if possible
export const rotateTetromino = (
  gameState: GameState
): ActiveTetromino | null => {
  if (!gameState.activeTetromino) return null;

  const rotatedShape = rotateMatrix(gameState.activeTetromino.shape);
  
  if (!checkCollision(gameState.activeTetromino.position, rotatedShape, gameState.board)) {
    return {
      ...gameState.activeTetromino,
      shape: rotatedShape
    };
  }
  
  return gameState.activeTetromino;
};

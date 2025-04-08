
import { ActiveTetromino, Position, GameState } from './gameTypes';
import { BOARD_WIDTH } from './gameConstants';
import { checkCollision } from './boardUtils';
import { randomTetromino, TETROMINOS, rotateTetromino as rotateMatrix, TetrominoType, getRandomlyRotatedShape } from './tetrominos';

// Get initial position for a new tetromino
export const getInitialPosition = (): Position => {
  return { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
};

// Create a new active tetromino
export const createTetromino = (type: TetrominoType): ActiveTetromino => {
  return {
    type,
    position: getInitialPosition(),
    shape: getRandomlyRotatedShape(type)
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

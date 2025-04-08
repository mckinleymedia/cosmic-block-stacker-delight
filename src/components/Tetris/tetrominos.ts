
// Tetromino shapes and colors
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

export interface Tetromino {
  shape: number[][];
  color: string;
}

export const TETROMINOS: Record<TetrominoType, Tetromino> = {
  'I': {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ],
    color: 'bg-tetris-i'
  },
  'J': {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-tetris-j'
  },
  'L': {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-tetris-l'
  },
  'O': {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: 'bg-tetris-o'
  },
  'S': {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0]
    ],
    color: 'bg-tetris-s'
  },
  'T': {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-tetris-t'
  },
  'Z': {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0]
    ],
    color: 'bg-tetris-z'
  }
};

// Return a random tetromino
export const randomTetromino = (): TetrominoType => {
  const tetrominos: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
  const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
  return randTetromino;
};

// Rotate a tetromino
export const rotateTetromino = (matrix: number[][]): number[][] => {
  const N = matrix.length;
  const rotated = Array(N).fill(null).map(() => Array(N).fill(0));
  
  // Transpose matrix
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N; j++) {
      rotated[j][N - 1 - i] = matrix[i][j];
    }
  }
  
  return rotated;
};

// Get a tetromino shape with random rotation
export const getRandomlyRotatedShape = (type: TetrominoType): number[][] => {
  // Start with the original shape
  let shape = [...TETROMINOS[type].shape];
  
  // 'O' tetromino doesn't need rotation as it's a square
  if (type === 'O') {
    return shape;
  }
  
  // Random number of rotations (0-3)
  const rotations = Math.floor(Math.random() * 4);
  
  // Apply rotations
  for (let i = 0; i < rotations; i++) {
    shape = rotateTetromino(shape);
  }
  
  return shape;
};

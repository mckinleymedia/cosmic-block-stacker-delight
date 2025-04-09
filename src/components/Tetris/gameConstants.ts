
// Game board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Quad mode dimensions - doubled from previous 44x44 to 88x88
export const QUAD_BOARD_SIZE = 88;
export const QUAD_CENTER_SIZE = 8; // Center size doubled from 4x4 to 8x8
export const QUAD_CENTER_POSITION = {
  x: Math.floor(QUAD_BOARD_SIZE / 2) - Math.floor(QUAD_CENTER_SIZE / 2),
  y: Math.floor(QUAD_BOARD_SIZE / 2) - Math.floor(QUAD_CENTER_SIZE / 2)
};

// Score per lines cleared
export const POINTS = {
  1: 100,
  2: 300,
  3: 500,
  4: 800
};

// Game drop interval calculation based on level
export const calculateDropInterval = (level: number): number => {
  return Math.max(800 - (level - 1) * 100, 100);
};

// Random direction for quad mode
export const getRandomDirection = (): 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' => {
  const directions: Array<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
  return directions[Math.floor(Math.random() * directions.length)];
};

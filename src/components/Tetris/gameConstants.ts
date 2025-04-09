
// Game board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Cross-shaped board dimensions
export const CROSS_BOARD_WIDTH = 10;  // Width of each arm
export const CROSS_BOARD_HEIGHT = 44; // Height/length of each arm
export const CROSS_CENTER_SIZE = 10;  // Size of center intersection

// Center position calculation for cross board
export const CROSS_CENTER_POSITION = {
  x: 0,  // Will be calculated based on the cross board dimensions
  y: 0   // Will be calculated based on the cross board dimensions
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

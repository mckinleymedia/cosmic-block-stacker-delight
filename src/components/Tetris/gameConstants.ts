
// Game board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Cross-shaped board dimensions
export const CROSS_BOARD_WIDTH = 30;  // Total width of the board area
export const CROSS_BOARD_HEIGHT = 40; // Total height of the board area
export const CROSS_CENTER_SIZE = 10;  // Size of center intersection

// Center position calculation for cross board
export const CROSS_CENTER_POSITION = {
  x: 10,  // Center x-coordinate in the cross board
  y: 15   // Center y-coordinate in the cross board
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

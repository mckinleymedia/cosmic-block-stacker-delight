
// Game board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

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

import React from 'react';
import { Cell, ActiveTetromino } from './gameTypes';
import { cn } from '@/lib/utils';
import { TETROMINOS } from './tetrominos';
import { Button } from '@/components/ui/button';
import { 
  CROSS_BOARD_WIDTH, 
  CROSS_BOARD_HEIGHT, 
  BOARD_HEIGHT, 
  BOARD_WIDTH 
} from './gameConstants';

interface GameBoardProps {
  board: Cell[][];
  activeTetromino: ActiveTetromino | null;
  gameOver: boolean;
  isPaused: boolean;
  quadMode?: boolean;
  onQuit?: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  activeTetromino, 
  gameOver,
  isPaused,
  quadMode = false,
  onQuit
}) => {
  // Create a new copy of the board for rendering
  const renderBoard = JSON.parse(JSON.stringify(board));
  
  // Add the active tetromino to the render board only if one exists
  if (activeTetromino) {
    const { position, shape, type } = activeTetromino;
    const color = TETROMINOS[type].color;
    
    // Only add the tetromino shape to the render board once
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
          // Only render cells that are within the board boundaries
          if (
            boardY >= 0 && 
            boardY < renderBoard.length && 
            boardX >= 0 && 
            boardX < renderBoard[0].length
          ) {
            renderBoard[boardY][boardX] = {
              filled: true,
              color: color
            };
          }
        }
      }
    }
  }

  // Standard tetris board rendering
  if (!quadMode) {
    return (
      <div className={cn(
        "relative border-2 border-tetris-border rounded overflow-hidden",
        (gameOver || isPaused) && "opacity-60"
      )}>
        <div className="grid grid-cols-10">
          {renderBoard.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div 
                key={`${rowIndex}-${cellIndex}`}
                className={cn(
                  "w-6 h-6 sm:w-8 sm:h-8 border border-tetris-grid",
                  cell.filled ? cell.color : "bg-tetris-bg"
                )}
              />
            ))
          )}
        </div>
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <p className="text-3xl font-bold text-red-500 mb-2">GAME OVER</p>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70">
            <p className="text-xl font-bold text-white mb-2">GAME PAUSED</p>
            
            {onQuit && (
              <Button 
                variant="outline" 
                onClick={onQuit}
                className="mt-2 bg-red-600 hover:bg-red-500 text-white border-0"
              >
                <span>Quit</span>
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  const cellSize = "w-[10px] h-[10px] sm:w-[12px] sm:h-[12px]";
  
  // Function to determine if a cell is part of the plus shape
  const isInPlusShape = (row: number, col: number): boolean => {
    const centerX = Math.floor(CROSS_BOARD_WIDTH / 2);
    const centerY = Math.floor(CROSS_BOARD_HEIGHT / 2);
    
    // Width of the vertical bar of the plus
    const verticalBarWidth = 10; 
    // Height of the horizontal bar of the plus
    const horizontalBarHeight = 10;
    
    // Calculate the boundaries of the vertical bar
    const verticalBarStart = centerX - Math.floor(verticalBarWidth / 2);
    const verticalBarEnd = verticalBarStart + verticalBarWidth;
    
    // Calculate the boundaries of the horizontal bar
    const horizontalBarStart = centerY - Math.floor(horizontalBarHeight / 2);
    const horizontalBarEnd = horizontalBarStart + horizontalBarHeight;
    
    // Check if the cell is within the vertical bar
    if (col >= verticalBarStart && col < verticalBarEnd) {
      return true;
    }
    
    // Check if the cell is within the horizontal bar
    if (row >= horizontalBarStart && row < horizontalBarEnd) {
      return true;
    }
    
    return false;
  };
  
  // Create an empty board for the plus-shaped area
  const plusShapeBoard: (Cell | null)[][] = Array.from({ length: CROSS_BOARD_HEIGHT }).map(() => 
    Array.from({ length: CROSS_BOARD_WIDTH }).map(() => null)
  );
  
  // Map the regular board cells to the plus-shaped board
  for (let rowIndex = 0; rowIndex < BOARD_HEIGHT; rowIndex++) {
    for (let cellIndex = 0; cellIndex < BOARD_WIDTH; cellIndex++) {
      const cellContent = renderBoard[rowIndex][cellIndex];
      
      // Calculate position in the plus-shaped board (centered)
      const plusRow = rowIndex + Math.floor((CROSS_BOARD_HEIGHT - BOARD_HEIGHT) / 2);
      const plusCol = cellIndex + Math.floor((CROSS_BOARD_WIDTH - BOARD_WIDTH) / 2);
      
      if (isInPlusShape(plusRow, plusCol)) {
        plusShapeBoard[plusRow][plusCol] = cellContent;
      }
    }
  }
  
  // If there's an active tetromino, add it to the plus-shaped board
  if (activeTetromino && quadMode) {
    const { position, shape, type } = activeTetromino;
    const color = TETROMINOS[type].color;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          // Calculate position in the plus-shaped board
          const plusRow = position.y + y + Math.floor((CROSS_BOARD_HEIGHT - BOARD_HEIGHT) / 2);
          const plusCol = position.x + x + Math.floor((CROSS_BOARD_WIDTH - BOARD_WIDTH) / 2);
          
          if (
            plusRow >= 0 && 
            plusRow < CROSS_BOARD_HEIGHT && 
            plusCol >= 0 && 
            plusCol < CROSS_BOARD_WIDTH &&
            isInPlusShape(plusRow, plusCol)
          ) {
            plusShapeBoard[plusRow][plusCol] = {
              filled: true,
              color: color
            };
          }
        }
      }
    }
  }
  
  return (
    <div className={cn(
      "relative overflow-hidden mx-auto",
      (gameOver || isPaused) && "opacity-60"
    )}>
      <div className="relative w-fit mx-auto border-2 border-tetris-border rounded" 
           style={{ maxWidth: '100%', maxHeight: '70vh' }}>
        <div className="grid" 
             style={{ gridTemplateColumns: `repeat(${CROSS_BOARD_WIDTH}, minmax(0, 1fr))` }}>
          {Array.from({ length: CROSS_BOARD_HEIGHT }).map((_, rowIndex) =>
            Array.from({ length: CROSS_BOARD_WIDTH }).map((_, colIndex) => {
              // Only render cells that are part of the plus shape
              if (!isInPlusShape(rowIndex, colIndex)) {
                return <div key={`plus-${rowIndex}-${colIndex}`} className="hidden"></div>;
              }
              
              const cellContent = plusShapeBoard[rowIndex][colIndex] || { filled: false, color: '' };
              
              return (
                <div 
                  key={`plus-${rowIndex}-${colIndex}`}
                  className={cn(
                    cellSize,
                    "border border-tetris-grid/50",
                    cellContent.filled ? cellContent.color : "bg-tetris-bg"
                  )}
                />
              );
            })
          )}
        </div>

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
            <p className="text-3xl font-bold text-red-500 mb-2">GAME OVER</p>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-50">
            <p className="text-xl font-bold text-white mb-2">GAME PAUSED</p>
            
            {onQuit && (
              <Button 
                variant="outline" 
                onClick={onQuit}
                className="mt-2 bg-red-600 hover:bg-red-500 text-white border-0"
              >
                <span>Quit</span>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GameBoard;

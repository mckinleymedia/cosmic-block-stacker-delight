
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
  
  const isInCustomShape = (row: number, col: number): boolean => {
    const centerColStart = 17;
    const centerColEnd = 27;
    
    const centerRowStart = 17;
    const centerRowEnd = 27;
    
    // Define the plus shape pattern
    if (col >= centerColStart && col < centerColEnd) {
      if (row < centerRowStart) {
        return row >= centerRowStart - 17;
      }
      if (row >= centerRowEnd) {
        return row < centerRowEnd + 17;
      }
    }
    
    if (row >= centerRowStart && row < centerRowEnd && col < centerColStart) {
      return col >= centerColStart - 17;
    }
    
    if (row >= centerRowStart && row < centerRowEnd && col >= centerColEnd) {
      return col < centerColEnd + 17;
    }
    
    // Check corners
    if (row < centerRowStart && col < centerColStart) {
      const verticalDistance = centerRowStart - row;
      const horizontalDistance = centerColStart - col;
      return verticalDistance <= 17 && horizontalDistance <= 10;
    }
    
    if (row < centerRowStart && col >= centerColEnd) {
      const verticalDistance = centerRowStart - row;
      const horizontalDistance = col - centerColEnd + 1;
      return verticalDistance <= 10 && horizontalDistance <= 17;
    }
    
    if (row >= centerRowEnd && col < centerColStart) {
      const verticalDistance = row - centerRowEnd + 1;
      const horizontalDistance = centerColStart - col;
      return verticalDistance <= 10 && horizontalDistance <= 17;
    }
    
    if (row >= centerRowEnd && col >= centerColEnd) {
      const verticalDistance = row - centerRowEnd + 1;
      const horizontalDistance = col - centerColEnd + 1;
      return verticalDistance <= 17 && horizontalDistance <= 10;
    }
    
    if (row >= centerRowStart && row < centerRowEnd && col >= centerColStart && col < centerColEnd) {
      return true;
    }
    
    return false;
  };
  
  // Create an empty special board for the cross shape
  const specialRenderBoard: (Cell | null)[][] = Array.from({ length: CROSS_BOARD_HEIGHT }).map(() => 
    Array.from({ length: CROSS_BOARD_HEIGHT }).map(() => null)
  );
  
  // Map each cell of the game board to the correct position in the cross board
  // Only process cells once to prevent duplicates
  for (let rowIndex = 0; rowIndex < BOARD_HEIGHT; rowIndex++) {
    for (let cellIndex = 0; cellIndex < BOARD_WIDTH; cellIndex++) {
      let cellContent = renderBoard[rowIndex][cellIndex];
      
      // Calculate the position in the cross board
      let crossRow = rowIndex + 17; // Center offset
      let crossCol = cellIndex + 17; // Center offset
      
      if (isInCustomShape(crossRow, crossCol)) {
        specialRenderBoard[crossRow][crossCol] = cellContent;
      }
    }
  }
  
  // If there's an active tetromino, add it to the special board without duplication
  if (activeTetromino && quadMode) {
    const { position, shape, type } = activeTetromino;
    const color = TETROMINOS[type].color;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const crossRow = position.y + y + 17; // Center offset
          const crossCol = position.x + x + 17; // Center offset
          
          if (
            crossRow >= 0 && 
            crossRow < CROSS_BOARD_HEIGHT && 
            crossCol >= 0 && 
            crossCol < CROSS_BOARD_HEIGHT &&
            isInCustomShape(crossRow, crossCol)
          ) {
            specialRenderBoard[crossRow][crossCol] = {
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
             style={{ gridTemplateColumns: `repeat(${CROSS_BOARD_HEIGHT}, minmax(0, 1fr))` }}>
          {Array.from({ length: CROSS_BOARD_HEIGHT }).map((_, rowIndex) =>
            Array.from({ length: CROSS_BOARD_HEIGHT }).map((_, cellIndex) => {
              const isPartOfShape = isInCustomShape(rowIndex, cellIndex);
              
              if (!isPartOfShape) {
                return <div key={`cross-${rowIndex}-${cellIndex}`} className="hidden"></div>;
              }
              
              const cellContent = specialRenderBoard[rowIndex][cellIndex] || { filled: false, color: '' };
              
              return (
                <div 
                  key={`cross-${rowIndex}-${cellIndex}`}
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

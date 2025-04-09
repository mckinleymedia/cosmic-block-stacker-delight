
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
  const renderBoard = JSON.parse(JSON.stringify(board));
  
  if (activeTetromino) {
    const { position, shape, type } = activeTetromino;
    const color = TETROMINOS[type].color;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
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

  // Updated cell size
  const cellSize = "w-[10px] h-[10px] sm:w-[12px] sm:h-[12px]";
  
  // Helper function to determine if a cell should be rendered as part of the plus shape
  const isInPlusShape = (row: number, col: number): boolean => {
    // Center vertical strip (width 10)
    if (col >= 17 && col < 27 && (row < 17 || row >= 27)) {
      return true;
    }
    
    // Center horizontal strip (height 10)
    if (row >= 17 && row < 27 && (col < 17 || col >= 27)) {
      return true;
    }
    
    // Center intersection
    if (row >= 17 && row < 27 && col >= 17 && col < 27) {
      return true;
    }
    
    return false;
  };
  
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
              // Determine if this cell is part of the plus shape
              const isPartOfPlus = isInPlusShape(rowIndex, cellIndex);
              
              // Skip rendering cells not in the plus shape
              if (!isPartOfPlus) {
                return <div key={`cross-${rowIndex}-${cellIndex}`} className="hidden"></div>;
              }
              
              let cellContent = { filled: false, color: '' };
              
              // For the central cross intersection
              if (rowIndex >= 17 && rowIndex < 27 && cellIndex >= 17 && cellIndex < 27) {
                const boardX = cellIndex - 17;
                const boardY = rowIndex - 17;
                if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                  cellContent = renderBoard[boardY][boardX];
                }
              } else if (cellIndex >= 17 && cellIndex < 27) {
                // Vertical section
                const boardX = cellIndex - 17;
                const boardY = rowIndex;
                if (rowIndex < 17) {
                  // Top section
                  const actualY = BOARD_HEIGHT - 17 + rowIndex;
                  if (actualY >= 0 && actualY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[actualY][boardX];
                  }
                } else if (rowIndex >= 27) {
                  // Bottom section
                  const actualY = rowIndex - 27;
                  if (actualY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[actualY][boardX];
                  }
                }
              } else if (rowIndex >= 17 && rowIndex < 27) {
                // Horizontal section
                const boardY = rowIndex - 17;
                if (cellIndex < 17) {
                  // Left section
                  const boardX = BOARD_WIDTH - 17 + cellIndex;
                  if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[boardY][boardX];
                  }
                } else if (cellIndex >= 27) {
                  // Right section
                  const boardX = cellIndex - 27;
                  if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[boardY][boardX];
                  }
                }
              }
              
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

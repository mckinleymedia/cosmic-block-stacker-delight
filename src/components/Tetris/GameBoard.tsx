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

  const cellSize = "w-[10px] h-[10px] sm:w-[12px] sm:h-[12px]";
  
  const isInCustomShape = (row: number, col: number): boolean => {
    const centerColStart = 17;
    const centerColEnd = 27;
    
    const centerRowStart = 17;
    const centerRowEnd = 27;
    
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
              
              let cellContent = { filled: false, color: '' };
              
              if (rowIndex >= 17 && rowIndex < 27 && cellIndex >= 17 && cellIndex < 27) {
                const boardX = cellIndex - 17;
                const boardY = rowIndex - 17;
                if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                  cellContent = renderBoard[boardY][boardX];
                }
              } else if (cellIndex >= 17 && cellIndex < 27) {
                const boardX = cellIndex - 17;
                const boardY = rowIndex;
                if (rowIndex < 17) {
                  const actualY = BOARD_HEIGHT - 17 + rowIndex;
                  if (actualY >= 0 && actualY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[actualY][boardX];
                  }
                } else if (rowIndex >= 27) {
                  const actualY = rowIndex - 27;
                  if (actualY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[actualY][boardX];
                  }
                }
              } else if (rowIndex >= 17 && rowIndex < 27) {
                const boardY = rowIndex - 17;
                if (cellIndex < 17) {
                  const boardX = BOARD_WIDTH - 17 + cellIndex;
                  if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[boardY][boardX];
                  }
                } else if (cellIndex >= 27) {
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

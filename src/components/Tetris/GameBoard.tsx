
import React from 'react';
import { Cell, ActiveTetromino } from './gameTypes';
import { cn } from '@/lib/utils';
import { TETROMINOS } from './tetrominos';
import { Button } from '@/components/ui/button';
import { CROSS_BOARD_WIDTH, CROSS_BOARD_HEIGHT } from './gameConstants';

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
  // Create a copy of the board to render the active tetromino
  const renderBoard = JSON.parse(JSON.stringify(board));
  
  // Add the active tetromino to the board for rendering
  if (activeTetromino) {
    const { position, shape, type } = activeTetromino;
    const color = TETROMINOS[type].color;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
          // Only render cells that are within the visible board area
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

  // Render standard board
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

  // Render cross board mode (two 10x44 rectangles that intersect in the center)
  const cellSize = "w-[5px] h-[5px] sm:w-[6px] sm:h-[6px]"; // Slightly larger cells
  const totalWidth = CROSS_BOARD_HEIGHT;
  const centerOffsetX = Math.floor((CROSS_BOARD_HEIGHT - CROSS_BOARD_WIDTH) / 2);
  const centerOffsetY = Math.floor((CROSS_BOARD_HEIGHT - CROSS_BOARD_WIDTH) / 2);
  
  return (
    <div className={cn(
      "relative overflow-hidden mx-auto",
      (gameOver || isPaused) && "opacity-60"
    )}>
      <div className="relative w-fit mx-auto border-2 border-tetris-border rounded" 
           style={{ maxWidth: '100%', maxHeight: '70vh' }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${CROSS_BOARD_HEIGHT}, minmax(0, 1fr))` }}>
          {Array.from({ length: CROSS_BOARD_HEIGHT }).map((_, rowIndex) =>
            Array.from({ length: CROSS_BOARD_HEIGHT }).map((_, cellIndex) => {
              // Determine if this cell is part of the cross shape
              const isVertical = cellIndex >= centerOffsetX && 
                               cellIndex < centerOffsetX + CROSS_BOARD_WIDTH;
              const isHorizontal = rowIndex >= centerOffsetY && 
                                 rowIndex < centerOffsetY + CROSS_BOARD_WIDTH;
              const isPartOfCross = isVertical || isHorizontal;
              
              if (!isPartOfCross) {
                // Cells not part of the cross are rendered as empty background
                return (
                  <div 
                    key={`cross-${rowIndex}-${cellIndex}`}
                    className={`${cellSize} bg-transparent`}
                  />
                );
              }
              
              // Map the cross board grid to the appropriate segments of our 10x20 board
              let cellContent = { filled: false, color: '' };
              
              if (isVertical && !isHorizontal) {
                // Vertical part of the cross (excluding intersection)
                const boardX = cellIndex - centerOffsetX;
                const boardY = rowIndex;
                
                // Bottom vertical section (normal orientation)
                if (rowIndex >= centerOffsetY + CROSS_BOARD_WIDTH) {
                  const actualY = rowIndex - (centerOffsetY + CROSS_BOARD_WIDTH);
                  if (actualY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[actualY][boardX];
                  }
                } 
                // Top vertical section (flipped)
                else if (rowIndex < centerOffsetY) {
                  const actualY = BOARD_HEIGHT - 1 - (centerOffsetY - rowIndex - 1);
                  if (actualY >= 0 && actualY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[actualY][boardX];
                  }
                }
              } else if (isHorizontal && !isVertical) {
                // Horizontal part of the cross (excluding intersection)
                const boardX = rowIndex - centerOffsetY;
                
                // Right horizontal section
                if (cellIndex >= centerOffsetX + CROSS_BOARD_WIDTH) {
                  const actualY = cellIndex - (centerOffsetX + CROSS_BOARD_WIDTH);
                  if (actualY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[actualY][boardX];
                  }
                } 
                // Left horizontal section (flipped)
                else if (cellIndex < centerOffsetX) {
                  const actualY = BOARD_HEIGHT - 1 - (centerOffsetX - cellIndex - 1);
                  if (actualY >= 0 && actualY < BOARD_HEIGHT && boardX < BOARD_WIDTH) {
                    cellContent = renderBoard[actualY][boardX];
                  }
                }
              } else if (isVertical && isHorizontal) {
                // Intersection area - center of the cross
                const boardX = cellIndex - centerOffsetX;
                const boardY = rowIndex - centerOffsetY;
                if (boardY >= 0 && boardY < CROSS_BOARD_WIDTH && boardX >= 0 && boardX < CROSS_BOARD_WIDTH) {
                  // Center area is just rendered as special highlight
                  return (
                    <div 
                      key={`cross-${rowIndex}-${cellIndex}`}
                      className={cn(
                        cellSize,
                        "border border-tetris-grid/50",
                        renderBoard[boardY][boardX].filled 
                          ? renderBoard[boardY][boardX].color 
                          : "bg-tetris-border/30" // Highlighted center area
                      )}
                    />
                  );
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

        {/* Game Over and Pause overlays */}
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

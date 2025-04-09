
import React from 'react';
import { Cell, ActiveTetromino } from './gameTypes';
import { cn } from '@/lib/utils';
import { TETROMINOS } from './tetrominos';
import { Button } from '@/components/ui/button';
import { QUAD_BOARD_SIZE } from './gameConstants';

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

  // Render quad mode board (132x132 plus sign shape) with larger cells
  const cellSize = "w-[4px] h-[4px] sm:w-[5px] sm:h-[5px]"; // Increased from 3px/4px to 4px/5px
  const centerSize = 8; // 8x8 center
  
  return (
    <div className={cn(
      "relative overflow-hidden mx-auto",
      (gameOver || isPaused) && "opacity-60"
    )}>
      <div className="relative w-fit mx-auto border-2 border-tetris-border rounded" 
           style={{ maxWidth: '100%', maxHeight: '70vh' }}>
        <div className="grid" style={{ gridTemplateColumns: `repeat(${QUAD_BOARD_SIZE}, minmax(0, 1fr))` }}>
          {Array.from({ length: QUAD_BOARD_SIZE }).map((_, rowIndex) =>
            Array.from({ length: QUAD_BOARD_SIZE }).map((_, cellIndex) => {
              // Determine the center position
              const centerStart = QUAD_BOARD_SIZE / 2 - centerSize / 2;
              const centerEnd = centerStart + centerSize;
              
              // Determine if this cell should be part of the plus shape
              const isCenter = rowIndex >= centerStart && rowIndex < centerEnd && 
                              cellIndex >= centerStart && cellIndex < centerEnd; // Center 8x8
              const isVertical = cellIndex >= centerStart && cellIndex < centerEnd && 
                                (rowIndex < centerStart || rowIndex >= centerEnd); // Vertical line of the plus
              const isHorizontal = rowIndex >= centerStart && rowIndex < centerEnd && 
                                  (cellIndex < centerStart || cellIndex >= centerEnd); // Horizontal line of the plus
              const isPartOfPlus = isCenter || isVertical || isHorizontal;
              
              if (!isPartOfPlus) {
                // Cells not part of the plus are rendered as empty background
                return (
                  <div 
                    key={`quad-${rowIndex}-${cellIndex}`}
                    className={`${cellSize} bg-transparent`}
                  />
                );
              }
              
              // Map the 132x132 grid to the appropriate segments of our 10x20 board
              // Center area (8x8 in the middle)
              if (isCenter) {
                return (
                  <div 
                    key={`quad-${rowIndex}-${cellIndex}`}
                    className={cn(
                      cellSize,
                      "border border-tetris-grid/50",
                      "bg-tetris-border/30" // Highlighted center area
                    )}
                  />
                );
              }
              
              // Map to regular board positions based on the plus segment
              let cellContent = { filled: false, color: '' };
              
              if (isVertical && rowIndex < centerStart) {
                // Top part of the plus (vertical board, flipped 180 degrees)
                const boardX = cellIndex - centerStart;
                const boardY = 19 - (centerStart - rowIndex - 1); // Flipped
                if (boardY >= 0 && boardY < renderBoard.length && boardX >= 0 && boardX < renderBoard[0].length) {
                  cellContent = renderBoard[boardY][boardX];
                }
              } else if (isVertical && rowIndex >= centerEnd) {
                // Bottom part of the plus (vertical board, normal orientation)
                const boardX = cellIndex - centerStart;
                const boardY = rowIndex - centerEnd;
                if (boardY >= 0 && boardY < renderBoard.length && boardX >= 0 && boardX < renderBoard[0].length) {
                  cellContent = renderBoard[boardY][boardX];
                }
              } else if (isHorizontal && cellIndex < centerStart) {
                // Left part of the plus (horizontal board, rotated 90 degrees clockwise)
                const boardX = rowIndex - centerStart;
                const boardY = 19 - (centerStart - cellIndex - 1); // Flipped
                if (boardY >= 0 && boardY < renderBoard.length && boardX >= 0 && boardX < renderBoard[0].length) {
                  cellContent = renderBoard[boardY][boardX];
                }
              } else if (isHorizontal && cellIndex >= centerEnd) {
                // Right part of the plus (horizontal board, rotated 270 degrees clockwise)
                const boardX = rowIndex - centerStart;
                const boardY = cellIndex - centerEnd;
                if (boardY >= 0 && boardY < renderBoard.length && boardX >= 0 && boardX < renderBoard[0].length) {
                  cellContent = renderBoard[boardY][boardX];
                }
              }
              
              return (
                <div 
                  key={`quad-${rowIndex}-${cellIndex}`}
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

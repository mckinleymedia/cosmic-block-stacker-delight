
import React from 'react';
import { Cell, ActiveTetromino } from './gameTypes';
import { cn } from '@/lib/utils';
import { TETROMINOS } from './tetrominos';
import { Button } from '@/components/ui/button';

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

  // Render quad mode board (44x44 plus sign shape)
  const cellSize = "w-2 h-2 sm:w-2 sm:h-2"; // Smaller cells for the 44x44 grid

  return (
    <div className={cn(
      "relative overflow-hidden mx-auto",
      (gameOver || isPaused) && "opacity-60"
    )}>
      {/* This is the container for the 44x44 quad-board */}
      <div className="relative w-fit mx-auto" style={{ height: '88vh', width: '88vw', maxWidth: '88vh', maxHeight: '88vw' }}>
        {/* Create a board that's 44x44 segments in size */}
        <div className="grid grid-cols-44 gap-0 border-2 border-tetris-border rounded">
          {Array.from({ length: 44 }).map((_, rowIndex) =>
            Array.from({ length: 44 }).map((_, cellIndex) => {
              // Determine if this cell is filled based on our board data
              // For simplicity, we're checking if the cell is within the bounds of our actual data
              const isCenterArea = rowIndex >= 20 && rowIndex < 24 && cellIndex >= 20 && cellIndex < 24;
              
              // Check if the cell is filled from the renderBoard
              let cellContent = { filled: false, color: '' };
              
              // Map the 44x44 grid to the appropriate segments of our 10x20 board
              // Center area (4x4 in the middle)
              if (isCenterArea) {
                cellContent = {
                  filled: false,
                  color: 'bg-tetris-border/30' // Highlighted center area
                };
              }
              // Top segment (vertical board, flipped 180 degrees)
              else if (cellIndex >= 17 && cellIndex < 27 && rowIndex < 20) {
                const boardX = cellIndex - 17;
                const boardY = 19 - rowIndex; // Flipped
                if (boardY >= 0 && boardY < renderBoard.length && boardX >= 0 && boardX < renderBoard[0].length) {
                  cellContent = renderBoard[boardY][boardX];
                }
              }
              // Bottom segment (vertical board, normal orientation)
              else if (cellIndex >= 17 && cellIndex < 27 && rowIndex >= 24) {
                const boardX = cellIndex - 17;
                const boardY = rowIndex - 24;
                if (boardY >= 0 && boardY < renderBoard.length && boardX >= 0 && boardX < renderBoard[0].length) {
                  cellContent = renderBoard[boardY][boardX];
                }
              }
              // Left segment (horizontal board, rotated 90 degrees clockwise)
              else if (rowIndex >= 17 && rowIndex < 27 && cellIndex < 20) {
                const boardX = rowIndex - 17;
                const boardY = 19 - (cellIndex); // Flipped
                if (boardY >= 0 && boardY < renderBoard.length && boardX >= 0 && boardX < renderBoard[0].length) {
                  cellContent = renderBoard[boardY][boardX];
                }
              }
              // Right segment (horizontal board, rotated 270 degrees clockwise)
              else if (rowIndex >= 17 && rowIndex < 27 && cellIndex >= 24) {
                const boardX = rowIndex - 17;
                const boardY = cellIndex - 24;
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
                    cellContent.filled ? cellContent.color : "bg-tetris-bg",
                    isCenterArea ? "bg-tetris-border/30" : ""
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


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

  // Render quad mode board (plus sign shape)
  const cellSize = "w-6 h-6 sm:w-8 sm:h-8";

  return (
    <div className={cn(
      "relative overflow-hidden",
      (gameOver || isPaused) && "opacity-60"
    )}>
      {/* This is the container for the quad-board */}
      <div className="relative w-fit mx-auto" style={{ height: '580px', width: '580px' }}>
        {/* Center 4x4 grid where all boards meet */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className="grid grid-cols-4">
            {Array(4).fill(null).map((_, rowIndex) =>
              Array(4).fill(null).map((_, cellIndex) => (
                <div 
                  key={`center-${rowIndex}-${cellIndex}`}
                  className={cn(
                    cellSize,
                    "border border-tetris-grid bg-tetris-bg"
                  )}
                />
              ))
            )}
          </div>
        </div>

        {/* Bottom board (standard orientation) */}
        <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 border-2 border-tetris-border rounded z-30">
          <div className="grid grid-cols-10">
            {renderBoard.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div 
                  key={`bottom-${rowIndex}-${cellIndex}`}
                  className={cn(
                    cellSize,
                    "border border-tetris-grid",
                    cell.filled ? cell.color : "bg-tetris-bg"
                  )}
                />
              ))
            )}
          </div>
        </div>

        {/* Left board (rotated 90 degrees clockwise) */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 rotate-90 border-2 border-tetris-border rounded z-20">
          <div className="grid grid-cols-10">
            {renderBoard.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div 
                  key={`left-${rowIndex}-${cellIndex}`}
                  className={cn(
                    cellSize,
                    "border border-tetris-grid",
                    cell.filled ? cell.color : "bg-tetris-bg"
                  )}
                />
              ))
            )}
          </div>
        </div>

        {/* Top board (rotated 180 degrees) */}
        <div className="absolute left-1/2 top-0 transform -translate-x-1/2 rotate-180 border-2 border-tetris-border rounded z-10">
          <div className="grid grid-cols-10">
            {renderBoard.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div 
                  key={`top-${rowIndex}-${cellIndex}`}
                  className={cn(
                    cellSize,
                    "border border-tetris-grid",
                    cell.filled ? cell.color : "bg-tetris-bg"
                  )}
                />
              ))
            )}
          </div>
        </div>

        {/* Right board (rotated 270 degrees clockwise) */}
        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -rotate-90 border-2 border-tetris-border rounded z-0">
          <div className="grid grid-cols-10">
            {renderBoard.map((row, rowIndex) =>
              row.map((cell, cellIndex) => (
                <div 
                  key={`right-${rowIndex}-${cellIndex}`}
                  className={cn(
                    cellSize,
                    "border border-tetris-grid",
                    cell.filled ? cell.color : "bg-tetris-bg"
                  )}
                />
              ))
            )}
          </div>
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

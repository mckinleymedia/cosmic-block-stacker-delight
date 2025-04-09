
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

  // Function to render a tetris board with specific orientation
  const renderTetrisBoard = (board: Cell[][], rotation: 0 | 90 | 180 | 270) => {
    // Create copies for different orientations
    const orientedBoard = [...board];
    
    return (
      <div className={`grid grid-cols-10 ${rotation === 90 ? 'rotate-90' : rotation === 180 ? 'rotate-180' : rotation === 270 ? '-rotate-90' : ''}`}>
        {orientedBoard.map((row, rowIndex) =>
          row.map((cell, cellIndex) => (
            <div 
              key={`${rotation}-${rowIndex}-${cellIndex}`}
              className={cn(
                "w-3 h-3 sm:w-4 sm:h-4 border border-tetris-grid",
                cell.filled ? cell.color : "bg-tetris-bg"
              )}
            />
          ))
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      "relative border-2 border-tetris-border rounded overflow-hidden",
      (gameOver || isPaused) && "opacity-60"
    )}>
      {quadMode ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1 p-2 bg-tetris-bg">
          {/* Empty cell in top-left */}
          <div className="hidden md:block"></div>
          
          {/* Top Tetris (180° rotation) */}
          <div className="flex justify-center items-center">
            {renderTetrisBoard(renderBoard, 180)}
          </div>
          
          {/* Empty cell in top-right */}
          <div className="hidden md:block"></div>
          
          {/* Left Tetris (90° rotation) */}
          <div className="hidden md:flex justify-center items-center">
            {renderTetrisBoard(renderBoard, 90)}
          </div>
          
          {/* Center/Main Tetris */}
          <div className="flex justify-center items-center">
            {renderTetrisBoard(renderBoard, 0)}
          </div>
          
          {/* Right Tetris (270° rotation) */}
          <div className="hidden md:flex justify-center items-center">
            {renderTetrisBoard(renderBoard, 270)}
          </div>
          
          {/* Mobile version - simplified with just two boards */}
          <div className="flex md:hidden justify-center items-center">
            {renderTetrisBoard(renderBoard, 90)}
          </div>
          
          <div className="flex md:hidden justify-center items-center">
            {renderTetrisBoard(renderBoard, 270)}
          </div>
        </div>
      ) : (
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
      )}
      
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
};

export default GameBoard;

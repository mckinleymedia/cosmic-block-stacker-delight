
import React from 'react';
import { Cell, ActiveTetromino } from './useGameLogic';
import { cn } from '@/lib/utils';
import { TETROMINOS } from './tetrominos';
import { Button } from '@/components/ui/button';

interface GameBoardProps {
  board: Cell[][];
  activeTetromino: ActiveTetromino | null;
  gameOver: boolean;
  isPaused: boolean;
  onQuit?: () => void;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  board, 
  activeTetromino, 
  gameOver,
  isPaused,
  onQuit
}) => {
  // Create a copy of the board to render the active tetromino
  const renderBoard = JSON.parse(JSON.stringify(board));
  
  // Place active tetromino on the board for rendering
  if (activeTetromino) {
    const { shape, position, type } = activeTetromino;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x]) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
          // Make sure it's on the board
          if (boardY >= 0 && boardY < renderBoard.length && 
              boardX >= 0 && boardX < renderBoard[0].length) {
            renderBoard[boardY][boardX] = { 
              filled: true, 
              color: TETROMINOS[type].color 
            };
          }
        }
      }
    }
  }
  
  return (
    <div className="relative w-full max-w-xs mx-auto bg-tetris-bg border-4 border-tetris-border rounded-md overflow-hidden">
      <div className="grid grid-cols-10 gap-[1px] p-1">
        {renderBoard.map((row: Cell[], rowIndex: number) => (
          <React.Fragment key={`row-${rowIndex}`}>
            {row.map((cell: Cell, cellIndex: number) => (
              <div 
                key={`cell-${rowIndex}-${cellIndex}`}
                className={cn(
                  "aspect-square w-full rounded-sm",
                  cell.filled 
                    ? `bg-tetris-${cell.color}` 
                    : "bg-tetris-grid"
                )}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
      
      {/* Game over or pause overlay */}
      {(gameOver || isPaused) && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center">
          <p className="text-xl font-bold text-white mb-2">
            {gameOver ? "GAME OVER" : "GAME PAUSED"}
          </p>
          
          {isPaused && !gameOver && onQuit && (
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

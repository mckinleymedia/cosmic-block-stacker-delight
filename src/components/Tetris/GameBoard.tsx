
import React from 'react';
import { Cell, ActiveTetromino } from './useGameLogic';
import { cn } from '@/lib/utils';
import { TETROMINOS } from './tetrominos';

interface GameBoardProps {
  board: Cell[][];
  activeTetromino: ActiveTetromino | null;
  gameOver: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, activeTetromino, gameOver }) => {
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

  return (
    <div className={cn(
      "relative border-2 border-tetris-border rounded overflow-hidden",
      gameOver && "opacity-60"
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
          <p className="text-xl font-bold text-white mb-2">GAME OVER</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;

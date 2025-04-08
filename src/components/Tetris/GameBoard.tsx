
import React from 'react';
import { Cell } from './useGameLogic';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: Cell[][];
  gameOver: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ board, gameOver }) => {
  return (
    <div className={cn(
      "relative border-2 border-tetris-border rounded overflow-hidden",
      gameOver && "opacity-60"
    )}>
      <div className="grid grid-cols-10">
        {board.map((row, rowIndex) =>
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
          <p className="text-sm text-white">Press R to restart</p>
        </div>
      )}
    </div>
  );
};

export default GameBoard;

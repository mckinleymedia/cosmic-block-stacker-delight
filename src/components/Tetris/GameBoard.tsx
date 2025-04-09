
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

  return (
    <div className={cn(
      "relative border-2 border-tetris-border rounded overflow-hidden",
      (gameOver || isPaused) && "opacity-60"
    )}>
      {quadMode ? (
        <div className="grid grid-cols-30 gap-1">
          {/* Simplified quad mode visualization - would need proper implementation */}
          <div className="col-span-10 col-start-11">
            <div className="grid grid-cols-10">
              {renderBoard.slice(0, 10).map((row, rowIndex) =>
                row.map((cell, cellIndex) => (
                  <div 
                    key={`top-${rowIndex}-${cellIndex}`}
                    className={cn(
                      "w-4 h-4 border border-tetris-grid",
                      cell.filled ? cell.color : "bg-tetris-bg"
                    )}
                  />
                ))
              )}
            </div>
          </div>
          
          <div className="col-span-30 grid grid-cols-30 gap-1">
            <div className="col-span-10">
              <div className="grid grid-cols-10">
                {renderBoard.slice(10, 20).map((row, rowIndex) =>
                  row.map((cell, cellIndex) => (
                    <div 
                      key={`left-${rowIndex}-${cellIndex}`}
                      className={cn(
                        "w-4 h-4 border border-tetris-grid",
                        cell.filled ? cell.color : "bg-tetris-bg"
                      )}
                    />
                  ))
                )}
              </div>
            </div>
            
            <div className="col-span-10">
              <div className="grid grid-cols-10">
                {renderBoard.map((row, rowIndex) =>
                  row.map((cell, cellIndex) => (
                    <div 
                      key={`main-${rowIndex}-${cellIndex}`}
                      className={cn(
                        "w-4 h-4 sm:w-6 sm:h-6 border border-tetris-grid",
                        cell.filled ? cell.color : "bg-tetris-bg"
                      )}
                    />
                  ))
                )}
              </div>
            </div>
            
            <div className="col-span-10">
              <div className="grid grid-cols-10">
                {renderBoard.slice(10, 20).map((row, rowIndex) =>
                  row.map((cell, cellIndex) => (
                    <div 
                      key={`right-${rowIndex}-${cellIndex}`}
                      className={cn(
                        "w-4 h-4 border border-tetris-grid",
                        cell.filled ? cell.color : "bg-tetris-bg"
                      )}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
          
          <div className="col-span-10 col-start-11">
            <div className="grid grid-cols-10">
              {renderBoard.slice(0, 10).map((row, rowIndex) =>
                row.map((cell, cellIndex) => (
                  <div 
                    key={`bottom-${rowIndex}-${cellIndex}`}
                    className={cn(
                      "w-4 h-4 border border-tetris-grid",
                      cell.filled ? cell.color : "bg-tetris-bg"
                    )}
                  />
                ))
              )}
            </div>
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

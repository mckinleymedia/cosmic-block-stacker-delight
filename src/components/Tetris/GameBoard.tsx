
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

  // Calculate the middle points of the board
  const midY = Math.floor(renderBoard.length / 2);
  const midX = Math.floor(renderBoard[0].length / 2);
  
  // Function to render a single cell with the correct styling
  const renderCell = (cell: Cell, rowIndex: number, cellIndex: number) => {
    return (
      <div 
        key={`cell-${rowIndex}-${cellIndex}`}
        className={cn(
          "w-6 h-6 sm:w-8 sm:h-8 border border-tetris-grid",
          cell.filled ? cell.color : "bg-tetris-bg"
        )}
      />
    );
  };

  // Standard single board rendering
  if (!quadMode) {
    return (
      <div className={cn(
        "relative border-2 border-tetris-border rounded overflow-hidden",
        (gameOver || isPaused) && "opacity-60"
      )}>
        <div className="grid grid-cols-10">
          {renderBoard.map((row, rowIndex) =>
            row.map((cell, cellIndex) => renderCell(cell, rowIndex, cellIndex))
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

  // Quad mode rendering with intersecting centers
  return (
    <div className={cn(
      "relative border-2 border-tetris-border rounded overflow-hidden",
      (gameOver || isPaused) && "opacity-60"
    )}>
      <div className="relative w-full h-full bg-tetris-bg">
        {/* Center board area */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 bg-tetris-bg">
          <div className="grid grid-cols-4 gap-0">
            {Array.from({ length: 4 }).map((_, rowIndex) =>
              Array.from({ length: 4 }).map((_, cellIndex) => {
                // Get cell from the main board's center
                const boardY = midY - 2 + rowIndex;
                const boardX = midX - 2 + cellIndex;
                const cell = (boardY >= 0 && boardY < renderBoard.length && 
                              boardX >= 0 && boardX < renderBoard[0].length) 
                            ? renderBoard[boardY][boardX] 
                            : { filled: false, color: '' };
                
                return (
                  <div 
                    key={`center-${rowIndex}-${cellIndex}`}
                    className={cn(
                      "w-6 h-6 sm:w-8 sm:h-8 border border-tetris-grid",
                      cell.filled ? cell.color : "bg-tetris-bg"
                    )}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* Down direction (normal) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 w-[240px] sm:w-[320px]">
          <div className="grid grid-cols-10">
            {renderBoard.slice(midY + 2).map((row, rowIndex) =>
              row.map((cell, cellIndex) => renderCell(cell, rowIndex + midY + 2, cellIndex))
            )}
          </div>
        </div>

        {/* Up direction (180° rotation) */}
        <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 rotate-180 w-[240px] sm:w-[320px]">
          <div className="grid grid-cols-10">
            {renderBoard.slice(0, midY - 2).reverse().map((row, rowIndex) =>
              row.map((cell, cellIndex) => renderCell(cell, midY - 3 - rowIndex, cellIndex))
            )}
          </div>
        </div>

        {/* Left direction (90° rotation) */}
        <div className="absolute top-1/2 right-1/2 transform translate-y-[-50%] rotate-90 origin-right w-[240px] sm:w-[320px]">
          <div className="grid grid-cols-10">
            {renderBoard.map((row, rowIndex) =>
              row.slice(0, midX - 2).reverse().map((cell, cellIndex) => 
                renderCell(cell, rowIndex, midX - 3 - cellIndex)
              )
            )}
          </div>
        </div>

        {/* Right direction (270° rotation) */}
        <div className="absolute top-1/2 left-1/2 transform translate-y-[-50%] -rotate-90 origin-left w-[240px] sm:w-[320px]">
          <div className="grid grid-cols-10">
            {renderBoard.map((row, rowIndex) =>
              row.slice(midX + 2).map((cell, cellIndex) => 
                renderCell(cell, rowIndex, cellIndex + midX + 2)
              )
            )}
          </div>
        </div>
        
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-20">
            <p className="text-3xl font-bold text-red-500 mb-2">GAME OVER</p>
          </div>
        )}
        
        {isPaused && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-20">
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

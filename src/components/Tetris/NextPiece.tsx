
import React from 'react';
import { TETROMINOS, TetrominoType } from './tetrominos';

interface NextPieceProps {
  nextPiece: TetrominoType;
  showPiece: boolean; // Added prop to control visibility of the piece
}

const NextPiece: React.FC<NextPieceProps> = ({ nextPiece, showPiece }) => {
  const tetromino = TETROMINOS[nextPiece];
  
  return (
    <div className="bg-tetris-bg p-4 border-2 border-tetris-border rounded w-full flex flex-col">
      <h3 className="text-white text-center mb-4 font-bold text-lg">Next</h3>
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-4 gap-1 mx-auto">
          {Array.from({ length: 4 }).map((_, rowIndex) =>
            Array.from({ length: 4 }).map((_, cellIndex) => {
              // Check if this cell should be filled based on the tetromino shape
              // Only show filled cells if showPiece is true
              const isFilled = 
                showPiece &&
                rowIndex < tetromino.shape.length && 
                cellIndex < tetromino.shape[0].length && 
                tetromino.shape[rowIndex][cellIndex] !== 0;
                
              return (
                <div 
                  key={`next-${rowIndex}-${cellIndex}`}
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${isFilled ? tetromino.color : 'bg-transparent'}`}
                />
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NextPiece;

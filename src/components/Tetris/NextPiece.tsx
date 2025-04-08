
import React from 'react';
import { TETROMINOS, TetrominoType } from './tetrominos';

interface NextPieceProps {
  nextPiece: TetrominoType;
  showPiece: boolean; // Added prop to control visibility of the piece
}

const NextPiece: React.FC<NextPieceProps> = ({ nextPiece, showPiece }) => {
  const tetromino = TETROMINOS[nextPiece];
  
  // Calculate the actual dimensions of the tetromino (excluding empty rows/columns)
  const getActualDimensions = () => {
    if (!showPiece) return { width: 0, height: 0 }; // Return zero dimensions if not showing
    
    let minRow = tetromino.shape.length;
    let maxRow = 0;
    let minCol = tetromino.shape[0].length;
    let maxCol = 0;
    
    // Find the actual boundaries of the tetromino shape
    for (let row = 0; row < tetromino.shape.length; row++) {
      for (let col = 0; col < tetromino.shape[row].length; col++) {
        if (tetromino.shape[row][col] !== 0) {
          minRow = Math.min(minRow, row);
          maxRow = Math.max(maxRow, row);
          minCol = Math.min(minCol, col);
          maxCol = Math.max(maxCol, col);
        }
      }
    }
    
    // Only return actual dimensions if tetromino has filled cells
    if (minRow <= maxRow && minCol <= maxCol) {
      return {
        width: maxCol - minCol + 1,
        height: maxRow - minRow + 1,
        minRow,
        minCol
      };
    }
    
    return { width: 0, height: 0, minRow: 0, minCol: 0 };
  };
  
  const dimensions = getActualDimensions();
  
  // Create a 4x4 display grid for all tetrominos
  const displayGrid = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // If showing the piece, center it in the 4x4 grid
  if (showPiece && dimensions.width > 0 && dimensions.height > 0) {
    // Calculate starting positions to center the tetromino in the 4x4 grid
    const startRow = Math.floor((4 - dimensions.height) / 2);
    const startCol = Math.floor((4 - dimensions.width) / 2);
    
    // Place the tetromino in the center of the display grid
    for (let row = 0; row < dimensions.height; row++) {
      for (let col = 0; col < dimensions.width; col++) {
        const tetrominoRow = row + dimensions.minRow;
        const tetrominoCol = col + dimensions.minCol;
        
        if (
          tetrominoRow < tetromino.shape.length && 
          tetrominoCol < tetromino.shape[tetrominoRow].length &&
          tetromino.shape[tetrominoRow][tetrominoCol] !== 0
        ) {
          const displayRow = startRow + row;
          const displayCol = startCol + col;
          
          if (displayRow >= 0 && displayRow < 4 && displayCol >= 0 && displayCol < 4) {
            displayGrid[displayRow][displayCol] = 1;
          }
        }
      }
    }
  }
  
  return (
    <div className="bg-tetris-bg p-4 border-2 border-tetris-border rounded w-full flex flex-col">
      <h3 className="text-white text-center mb-4 font-bold text-lg">Next</h3>
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-cols-4 gap-1 mx-auto">
          {displayGrid.map((row, rowIndex) =>
            row.map((cell, cellIndex) => (
              <div 
                key={`next-${rowIndex}-${cellIndex}`}
                className={`w-5 h-5 sm:w-6 sm:h-6 ${cell ? tetromino.color : 'bg-transparent'}`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NextPiece;

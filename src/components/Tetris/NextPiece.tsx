
import React from 'react';
import { TETROMINOS, TetrominoType } from './tetrominos';
import { Direction } from './gameTypes';
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from 'lucide-react';

interface NextPieceProps {
  nextPiece: TetrominoType;
  showPiece: boolean;
  nextShape: number[][] | null;
  quadMode?: boolean;
  nextDirection?: Direction;
}

const NextPiece: React.FC<NextPieceProps> = ({ 
  nextPiece, 
  showPiece, 
  nextShape,
  quadMode = false,
  nextDirection
}) => {
  const tetromino = TETROMINOS[nextPiece];
  
  // Create a 4x4 display grid for all tetrominos
  const displayGrid = Array(4).fill(0).map(() => Array(4).fill(0));
  
  // If showing the piece, center it in the 4x4 grid
  if (showPiece && nextShape) {
    // Use the preselected shape
    const shape = nextShape;
    
    // Find the actual dimensions of the tetromino (trim empty columns)
    const rows = shape;
    
    // Find the width of each row (excluding trailing zeros)
    const effectiveWidths = rows.map(row => {
      let lastFilledIndex = -1;
      for (let i = row.length - 1; i >= 0; i--) {
        if (row[i] !== 0) {
          lastFilledIndex = i;
          break;
        }
      }
      return lastFilledIndex + 1; // +1 because it's an index
    });
    
    // Use the maximum effective width
    const effectiveWidth = Math.max(...effectiveWidths.filter(w => w > 0));
    const shapeHeight = rows.length;
    
    // Calculate offsets to center the shape in the 4x4 display grid
    const rowOffset = Math.floor((4 - shapeHeight) / 2);
    const colOffset = Math.floor((4 - effectiveWidth) / 2);
    
    // Place the tetromino in the center of the display grid
    for (let row = 0; row < shapeHeight; row++) {
      for (let col = 0; col < (shape[row]?.length || 0); col++) {
        if (shape[row][col] !== 0) {
          const displayRow = row + rowOffset;
          const displayCol = col + colOffset;
          
          // Make sure we don't place cells outside the display grid
          if (displayRow >= 0 && displayRow < 4 && displayCol >= 0 && displayCol < 4) {
            displayGrid[displayRow][displayCol] = 1;
          }
        }
      }
    }
  }
  
  const getDirectionIcon = () => {
    if (!quadMode || !nextDirection) return null;
    
    switch (nextDirection) {
      case 'UP':
        return <ArrowUp className="w-5 h-5 text-white/80" />;
      case 'DOWN':
        return <ArrowDown className="w-5 h-5 text-white/80" />;
      case 'LEFT':
        return <ArrowLeft className="w-5 h-5 text-white/80" />;
      case 'RIGHT':
        return <ArrowRight className="w-5 h-5 text-white/80" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-tetris-bg p-4 border-2 border-tetris-border rounded w-full flex flex-col">
      <div className="flex items-center justify-center mb-2">
        <h3 className="text-white text-center font-bold text-lg">Next</h3>
        {quadMode && nextDirection && (
          <div className="ml-2">{getDirectionIcon()}</div>
        )}
      </div>
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

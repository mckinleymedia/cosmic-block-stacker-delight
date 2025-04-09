
import React from 'react';
import { QuadScores } from './gameTypes';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuadModeStatsProps {
  scores: QuadScores;
  linesCleared: QuadScores;
}

const QuadModeStats: React.FC<QuadModeStatsProps> = ({ scores, linesCleared }) => {
  return (
    <div className="bg-tetris-bg border-2 border-tetris-border rounded p-4 text-white flex-grow">
      <h3 className="font-bold text-lg opacity-75 text-center mb-3">Quad Scores</h3>
      
      <div className="grid grid-cols-3 gap-2 text-center">
        {/* Top - UP direction */}
        <div className="col-start-2">
          <div className="flex items-center justify-center">
            <ChevronUp className="h-4 w-4 mr-1" />
            <span className="text-xs opacity-60">UP</span>
          </div>
          <p className="text-lg font-mono">{scores.up}</p>
          <p className="text-xs opacity-60">{linesCleared.up} lines</p>
        </div>
        
        {/* Left side - LEFT direction */}
        <div className="col-start-1 row-start-2">
          <div className="flex items-center justify-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="text-xs opacity-60">LEFT</span>
          </div>
          <p className="text-lg font-mono">{scores.left}</p>
          <p className="text-xs opacity-60">{linesCleared.left} lines</p>
        </div>
        
        {/* Center - Total score */}
        <div className="col-start-2 row-start-2">
          <p className="text-xs opacity-60">TOTAL</p>
          <p className="text-xl font-mono font-bold">
            {scores.up + scores.down + scores.left + scores.right}
          </p>
        </div>
        
        {/* Right side - RIGHT direction */}
        <div className="col-start-3 row-start-2">
          <div className="flex items-center justify-center">
            <ChevronRight className="h-4 w-4 mr-1" />
            <span className="text-xs opacity-60">RIGHT</span>
          </div>
          <p className="text-lg font-mono">{scores.right}</p>
          <p className="text-xs opacity-60">{linesCleared.right} lines</p>
        </div>
        
        {/* Bottom - DOWN direction */}
        <div className="col-start-2 row-start-3">
          <div className="flex items-center justify-center">
            <ChevronDown className="h-4 w-4 mr-1" />
            <span className="text-xs opacity-60">DOWN</span>
          </div>
          <p className="text-lg font-mono">{scores.down}</p>
          <p className="text-xs opacity-60">{linesCleared.down} lines</p>
        </div>
      </div>
    </div>
  );
};

export default QuadModeStats;

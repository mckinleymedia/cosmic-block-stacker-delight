
import React from 'react';
import { QuadScores } from './gameTypes';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuadModeStatsProps {
  scores: QuadScores;
  linesCleared: QuadScores;
  level: number;
  totalLinesCleared: number;
}

const QuadModeStats: React.FC<QuadModeStatsProps> = ({ scores, linesCleared, level, totalLinesCleared }) => {
  // Calculate total score from all directions
  const totalScore = scores.up + scores.down + scores.left + scores.right;
  
  return (
    <div className="bg-tetris-bg border-2 border-tetris-border rounded p-4 text-white flex-grow">
      <div className="mb-4 text-center">
        <h3 className="font-bold text-lg opacity-75">Score</h3>
        <p className="text-6xl font-mono">{totalScore.toLocaleString()}</p>
      </div>
      
      <div className="flex justify-center items-center space-x-6">
        <div className="flex items-center">
          <h3 className="font-bold text-sm mr-2 opacity-60">Level:</h3>
          <p className="text-lg font-mono">{level}</p>
        </div>
        <div className="flex items-center">
          <h3 className="font-bold text-sm mr-2 opacity-60">Lines:</h3>
          <p className="text-lg font-mono">{totalLinesCleared}</p>
        </div>
      </div>
      
      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        {/* Top - UP direction */}
        <div className="col-start-2">
          <div className="flex items-center justify-center">
            <ChevronUp className="h-4 w-4 mr-1" />
            <span className="text-xs opacity-60">{linesCleared.up} lines</span>
          </div>
        </div>
        
        {/* Left side - LEFT direction */}
        <div className="col-start-1 row-start-2">
          <div className="flex items-center justify-center">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="text-xs opacity-60">{linesCleared.left} lines</span>
          </div>
        </div>
        
        {/* Right side - RIGHT direction */}
        <div className="col-start-3 row-start-2">
          <div className="flex items-center justify-center">
            <ChevronRight className="h-4 w-4 mr-1" />
            <span className="text-xs opacity-60">{linesCleared.right} lines</span>
          </div>
        </div>
        
        {/* Bottom - DOWN direction */}
        <div className="col-start-2 row-start-3">
          <div className="flex items-center justify-center">
            <ChevronDown className="h-4 w-4 mr-1" />
            <span className="text-xs opacity-60">{linesCleared.down} lines</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadModeStats;

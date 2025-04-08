
import React from 'react';

interface GameStatsProps {
  score: number;
  level: number;
  linesCleared: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, level, linesCleared }) => {
  return (
    <div className="bg-tetris-bg border-2 border-tetris-border rounded p-4 text-white w-full">
      <div className="mb-4 text-center">
        <h3 className="font-bold text-lg opacity-75">Score</h3>
        <p className="text-6xl font-mono">{score.toLocaleString()}</p>
      </div>
      <div className="flex justify-center items-center space-x-6">
        <div className="flex items-center">
          <h3 className="font-bold text-sm mr-2 opacity-60">Level:</h3>
          <p className="text-lg font-mono">{level}</p>
        </div>
        <div className="flex items-center">
          <h3 className="font-bold text-sm mr-2 opacity-60">Lines:</h3>
          <p className="text-lg font-mono">{linesCleared}</p>
        </div>
      </div>
    </div>
  );
};

export default GameStats;

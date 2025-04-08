
import React from 'react';

interface GameStatsProps {
  score: number;
  level: number;
  linesCleared: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, level, linesCleared }) => {
  return (
    <div className="bg-tetris-bg border-2 border-tetris-border rounded p-4 text-white">
      <div className="mb-3">
        <h3 className="font-bold text-lg">Score</h3>
        <p className="text-2xl font-mono">{score.toLocaleString()}</p>
      </div>
      <div className="mb-3">
        <h3 className="font-bold text-lg">Level</h3>
        <p className="text-2xl font-mono">{level}</p>
      </div>
      <div>
        <h3 className="font-bold text-lg">Lines</h3>
        <p className="text-2xl font-mono">{linesCleared}</p>
      </div>
    </div>
  );
};

export default GameStats;

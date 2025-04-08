
import React from 'react';

interface GameStatsProps {
  score: number;
  level: number;
  linesCleared: number;
}

const GameStats: React.FC<GameStatsProps> = ({ score, level, linesCleared }) => {
  return (
    <div className="bg-tetris-bg border-2 border-tetris-border rounded p-2 text-white">
      <div className="mb-2">
        <h3 className="font-bold">Score</h3>
        <p className="text-xl">{score}</p>
      </div>
      <div className="mb-2">
        <h3 className="font-bold">Level</h3>
        <p className="text-xl">{level}</p>
      </div>
      <div>
        <h3 className="font-bold">Lines</h3>
        <p className="text-xl">{linesCleared}</p>
      </div>
    </div>
  );
};

export default GameStats;

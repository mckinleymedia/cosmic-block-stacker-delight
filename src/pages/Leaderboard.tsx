
import React from 'react';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import Leaderboard from '@/components/Tetris/Leaderboard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const { leaderboard, clearLeaderboard } = useLeaderboard();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-tetris-bg p-4">
      <h1 className="text-5xl font-bold text-white mb-6 font-mono tracking-wider">
        <span className="text-tetris-i">T</span>
        <span className="text-tetris-j">E</span>
        <span className="text-tetris-l">T</span>
        <span className="text-tetris-o">R</span>
        <span className="text-tetris-i">I</span>
        <span className="text-tetris-s">S</span>
      </h1>
      
      <div className="w-full max-w-3xl mb-8">
        <Button 
          variant="outline" 
          onClick={() => navigate('/')}
          className="border-tetris-border text-white hover:bg-tetris-border/20 mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Game
        </Button>
      </div>
      
      <Leaderboard entries={leaderboard} onClear={clearLeaderboard} />
    </div>
  );
};

export default LeaderboardPage;

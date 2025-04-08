
import React from 'react';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import Leaderboard from '@/components/Tetris/Leaderboard';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw } from 'lucide-react';

const LeaderboardPage: React.FC = () => {
  const { leaderboard, isLoading, clearLeaderboard, refreshLeaderboard } = useLeaderboard();
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
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={() => navigate('/')}
            className="border-tetris-border text-white hover:bg-tetris-border/20"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Game
          </Button>
          
          <Button
            variant="outline"
            onClick={() => refreshLeaderboard()}
            className="border-tetris-border text-white hover:bg-tetris-border/20"
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="w-full max-w-3xl bg-black/40 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Global Leaderboard</h2>
        <Leaderboard 
          entries={leaderboard} 
          onClear={clearLeaderboard} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default LeaderboardPage;

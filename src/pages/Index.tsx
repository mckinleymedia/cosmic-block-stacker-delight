
import TetrisGame from "@/components/Tetris/TetrisGame";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import LeaderboardModal from "@/components/Tetris/LeaderboardModal";

const Index = () => {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-tetris-bg p-4">
      <div className="flex items-center mb-6 w-full max-w-5xl justify-center relative">
        <h1 className="text-5xl font-bold text-white font-mono tracking-wider">
          <span className="text-tetris-i">T</span>
          <span className="text-tetris-j">E</span>
          <span className="text-tetris-l">T</span>
          <span className="text-tetris-o">R</span>
          <span className="text-tetris-s">I</span>
          <span className="text-tetris-t">S</span>
        </h1>
        <Button 
          variant="ghost" 
          size="icon"
          className="ml-20 text-white/70 hover:text-white hover:bg-tetris-border/20 bg-transparent"
          onClick={() => setShowLeaderboard(true)}
        >
          <Trophy className="h-10 w-10 text-yellow-500" />
          <span className="sr-only">Leaderboard</span>
        </Button>
      </div>
      <TetrisGame />
      
      <LeaderboardModal
        isOpen={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />
    </div>
  );
};

export default Index;

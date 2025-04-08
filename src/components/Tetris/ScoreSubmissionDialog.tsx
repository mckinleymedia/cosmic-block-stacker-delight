
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Award } from 'lucide-react';

interface ScoreSubmissionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (playerName: string) => void;
  score: number;
}

const ScoreSubmissionDialog: React.FC<ScoreSubmissionDialogProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  score 
}) => {
  const [playerName, setPlayerName] = useState('Player');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(playerName.trim() || 'Player');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-tetris-bg border-tetris-border text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Award className="h-5 w-5 text-yellow-500" />
            New High Score: {score.toLocaleString()}
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Congratulations! Your score qualifies for the leaderboard.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-4 py-4">
            <label htmlFor="playerName" className="text-sm font-medium">
              Enter your name:
            </label>
            <Input
              id="playerName"
              className="bg-tetris-bg border-tetris-border text-white"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button 
              type="submit" 
              className="bg-tetris-t hover:bg-tetris-t/80 text-white"
            >
              Submit Score
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScoreSubmissionDialog;


import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogClose 
} from '@/components/ui/dialog';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import Leaderboard from './Leaderboard';
import { X } from 'lucide-react';

interface LeaderboardModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const { leaderboard, isLoading } = useLeaderboard();

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-tetris-bg border-tetris-border text-white sm:max-w-3xl">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-2xl font-bold">
              Leaderboard
            </DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          <Leaderboard 
            entries={leaderboard} 
            isLoading={isLoading} 
          />
        </div>
        
        <DialogClose className="absolute right-4 top-4 opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none">
          <X className="h-4 w-4 text-white" />
          <span className="sr-only">Close</span>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardModal;

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';
interface GameControlsProps {
  onAction: (action: string) => void;
  isPaused: boolean;
  gameOver: boolean;
}
const GameControls: React.FC<GameControlsProps> = ({
  onAction,
  isPaused,
  gameOver
}) => {
  return <div className="w-full mt-2">
      <div className="flex flex-col items-center gap-1">
        {/* Up/Rotate button */}
        <div className="flex justify-center mb-1">
          <Button variant="outline" className="p-1 h-14 w-14 aspect-square flex flex-col items-center" onClick={() => onAction('ROTATE')} disabled={gameOver || isPaused}>
            <ArrowUp className="h-6 w-6" />
            <span className="text-xs mt-0.25">Rotate</span>
          </Button>
        </div>
        
        {/* Left, Down, Right buttons */}
        <div className="flex justify-center gap-1 mb-4">
          <Button variant="outline" className="p-1 h-14 w-14 aspect-square" onClick={() => onAction('LEFT')} disabled={gameOver || isPaused}>
            <ArrowLeft className="h-7 w-7" />
          </Button>
          <Button variant="outline" className="p-1 h-14 w-14 aspect-square" onClick={() => onAction('DOWN')} disabled={gameOver || isPaused}>
            <ArrowDown className="h-7 w-7" />
          </Button>
          <Button variant="outline" className="p-1 h-14 w-14 aspect-square" onClick={() => onAction('RIGHT')} disabled={gameOver || isPaused}>
            <ArrowRight className="h-7 w-7" />
          </Button>
        </div>
        
        {/* Game control button - either Pause/Resume or New Game */}
        <Button variant="outline" onClick={() => onAction(gameOver ? 'RESTART' : 'PAUSE')} className="p-1 h-10 w-full bg-green-600 hover:bg-green-500 text-white">
          <span className="text-sm">
            {gameOver ? 'New Game' : isPaused ? 'Resume' : 'Pause'}
          </span>
        </Button>
      </div>
    </div>;
};
export default GameControls;
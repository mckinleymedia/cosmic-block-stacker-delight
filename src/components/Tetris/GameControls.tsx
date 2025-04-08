
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface GameControlsProps {
  onAction: (action: string) => void;
  isPaused: boolean;
  gameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onAction, isPaused, gameOver }) => {
  return (
    <div className="w-full mt-2">
      <div className="flex flex-col items-center gap-1">
        {/* Up/Rotate button */}
        <div className="flex justify-center mb-1">
          <Button 
            variant="outline" 
            className="p-1 h-12 w-12 aspect-square flex flex-col items-center" 
            onClick={() => onAction('ROTATE')}
            disabled={gameOver || isPaused}
          >
            <ArrowUp className="h-5 w-5" />
            <span className="text-xs mt-0.5">Rotate</span>
          </Button>
        </div>
        
        {/* Left, Down, Right buttons */}
        <div className="flex justify-center gap-1 mb-4">
          <Button 
            variant="outline" 
            className="p-1 h-12 w-12 aspect-square" 
            onClick={() => onAction('LEFT')}
            disabled={gameOver || isPaused}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            className="p-1 h-12 w-12 aspect-square" 
            onClick={() => onAction('DOWN')}
            disabled={gameOver || isPaused}
          >
            <ArrowDown className="h-6 w-6" />
          </Button>
          <Button 
            variant="outline" 
            className="p-1 h-12 w-12 aspect-square" 
            onClick={() => onAction('RIGHT')}
            disabled={gameOver || isPaused}
          >
            <ArrowRight className="h-6 w-6" />
          </Button>
        </div>
        
        {/* Pause button */}
        <Button 
          variant="outline" 
          className="p-1 h-8 w-full" 
          onClick={() => onAction('PAUSE')}
          disabled={gameOver}
        >
          <span className="text-sm">{isPaused ? 'Resume' : 'Pause'}</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;

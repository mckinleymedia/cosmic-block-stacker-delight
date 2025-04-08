
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
      <div className="grid grid-cols-3 gap-1 items-center justify-center mb-1">
        <div></div>
        <Button 
          variant="outline" 
          className="p-1 h-8 aspect-square" 
          onClick={() => onAction('ROTATE')}
          disabled={gameOver || isPaused}
        >
          <div className="flex flex-col items-center">
            <ArrowUp className="h-3 w-3" />
            <span className="text-xs">Rotate</span>
          </div>
        </Button>
        <div></div>
      </div>
      
      <div className="grid grid-cols-3 gap-1 items-center justify-center mb-1">
        <Button 
          variant="outline" 
          className="p-1 h-8 aspect-square" 
          onClick={() => onAction('LEFT')}
          disabled={gameOver || isPaused}
        >
          <ArrowLeft className="h-3 w-3" />
        </Button>
        <Button 
          variant="outline" 
          className="p-1 h-8 aspect-square" 
          onClick={() => onAction('DOWN')}
          disabled={gameOver || isPaused}
        >
          <ArrowDown className="h-3 w-3" />
        </Button>
        <Button 
          variant="outline" 
          className="p-1 h-8 aspect-square" 
          onClick={() => onAction('RIGHT')}
          disabled={gameOver || isPaused}
        >
          <ArrowRight className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-1 mt-1">
        <Button 
          variant="outline" 
          className="p-1 h-8 flex flex-col items-center justify-center" 
          onClick={() => onAction('PAUSE')}
          disabled={gameOver}
        >
          <span className="text-xs">Space Bar</span>
          <span className="text-xs">{isPaused ? 'Resume' : 'Pause'}</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;

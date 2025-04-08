
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Space } from 'lucide-react';

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
          className="p-1 h-auto aspect-square" 
          onClick={() => onAction('ROTATE')}
          disabled={gameOver || isPaused}
        >
          <div className="flex flex-col items-center">
            <ArrowUp className="h-4 w-4" />
            <span className="text-xs">Rotate</span>
          </div>
        </Button>
        <div></div>
      </div>
      
      <div className="grid grid-cols-3 gap-1 items-center justify-center mb-1">
        <Button 
          variant="outline" 
          className="p-1 h-auto aspect-square" 
          onClick={() => onAction('LEFT')}
          disabled={gameOver || isPaused}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          className="p-1 h-auto aspect-square" 
          onClick={() => onAction('DOWN')}
          disabled={gameOver || isPaused}
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
        <Button 
          variant="outline" 
          className="p-1 h-auto aspect-square" 
          onClick={() => onAction('RIGHT')}
          disabled={gameOver || isPaused}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-1 mt-2">
        <Button 
          variant="outline" 
          className="p-1 h-auto flex flex-col items-center justify-center" 
          onClick={() => onAction('PAUSE')}
          disabled={gameOver}
        >
          <Space className="h-4 w-4" />
          <span className="text-xs">Space Bar</span>
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </Button>
      </div>
    </div>
  );
};

export default GameControls;

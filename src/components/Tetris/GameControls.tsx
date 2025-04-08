
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
    <div className="w-full mt-4">
      <div className="grid grid-cols-3 gap-2 items-center justify-center mb-2">
        <div></div>
        <Button 
          variant="outline" 
          className="p-2 md:p-4 h-auto aspect-square" 
          onClick={() => onAction('ROTATE')}
          disabled={gameOver || isPaused}
        >
          <div className="flex flex-col items-center">
            <ArrowUp className="h-5 w-5" />
            <span className="text-xs mt-1">Rotate</span>
          </div>
        </Button>
        <div></div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 items-center justify-center mb-2">
        <Button 
          variant="outline" 
          className="p-2 md:p-4 h-auto aspect-square" 
          onClick={() => onAction('LEFT')}
          disabled={gameOver || isPaused}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          className="p-2 md:p-4 h-auto aspect-square" 
          onClick={() => onAction('DOWN')}
          disabled={gameOver || isPaused}
        >
          <ArrowDown className="h-5 w-5" />
        </Button>
        <Button 
          variant="outline" 
          className="p-2 md:p-4 h-auto aspect-square" 
          onClick={() => onAction('RIGHT')}
          disabled={gameOver || isPaused}
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2 mt-4">
        <Button 
          variant={isPaused ? "default" : "outline"} 
          className="p-2 md:p-4 h-auto flex items-center justify-center" 
          onClick={() => onAction('PAUSE')}
          disabled={gameOver}
        >
          <Space className="h-5 w-5 mr-2" />
          <span>{isPaused ? 'Resume' : 'Pause'}</span>
        </Button>
      </div>
      
      <div className="mt-4 text-white text-sm">
        <h4 className="font-bold mb-1">Keyboard Controls:</h4>
        <p>← →: Move (or A/D)</p>
        <p>↑: Rotate (or W)</p>
        <p>↓: Soft Drop (or S)</p>
        <p>Space: Pause</p>
        <p>R: Restart</p>
      </div>
    </div>
  );
};

export default GameControls;

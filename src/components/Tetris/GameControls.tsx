
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, RotateCw, Play } from 'lucide-react';

interface GameControlsProps {
  onAction: (action: string) => void;
  isPaused: boolean;
  gameOver: boolean;
}

const GameControls: React.FC<GameControlsProps> = ({ onAction, isPaused, gameOver }) => {
  return (
    <div className="w-full mt-4">
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
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="p-2 md:p-4 h-auto" 
          onClick={() => onAction('ROTATE')}
          disabled={gameOver || isPaused}
        >
          <RotateCw className="h-5 w-5 mr-1" />
          <span>Rotate</span>
        </Button>
        <Button 
          variant="outline" 
          className="p-2 md:p-4 h-auto" 
          onClick={() => onAction('DROP')}
          disabled={gameOver || isPaused}
        >
          <ArrowDown className="h-5 w-5 mr-1" />
          <span>Drop</span>
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-2">
        {isPaused && !gameOver ? (
          <Button 
            variant="default" 
            className="p-2 md:p-4 h-auto bg-green-600 hover:bg-green-700" 
            onClick={() => onAction('START')}
          >
            <Play className="h-5 w-5 mr-1" />
            Start
          </Button>
        ) : (
          <Button 
            variant={isPaused ? "default" : "outline"} 
            className="p-2 md:p-4 h-auto" 
            onClick={() => onAction('PAUSE')}
            disabled={gameOver}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </Button>
        )}
        <Button 
          variant="outline" 
          className="p-2 md:p-4 h-auto" 
          onClick={() => onAction('RESTART')}
        >
          Restart
        </Button>
      </div>
      
      <div className="mt-4 text-white text-sm">
        <h4 className="font-bold mb-1">Keyboard Controls:</h4>
        <p>← → ↓: Move</p>
        <p>↑: Rotate</p>
        <p>Space: Hard Drop</p>
        <p>P: Pause</p>
        <p>R: Restart</p>
      </div>
    </div>
  );
};

export default GameControls;

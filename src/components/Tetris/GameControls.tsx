
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
  const isGameActive = !gameOver && isPaused !== null;

  const showNewGameButton = isPaused && !isGameActive;
  return <div className="w-full">
      <div className="flex flex-col items-center gap-1">
        <div className="flex justify-center">
          <Button variant="outline" className="p-1 h-16 w-16 aspect-square flex flex-col items-center" onClick={() => onAction('ROTATE')} disabled={gameOver || isPaused}>
            <ArrowUp className="h-6 w-6" />
            <span className="text-xs mt-0.25">Rotate</span>
          </Button>
        </div>
        
        <div className="flex justify-center gap-1">
          <Button variant="outline" className="p-1 h-16 w-16 aspect-square" onClick={() => onAction('LEFT')} disabled={gameOver || isPaused}>
            <ArrowLeft className="h-7 w-7" />
          </Button>
          <Button variant="outline" className="p-1 h-16 w-16 aspect-square" onClick={() => onAction('DOWN')} disabled={gameOver || isPaused}>
            <ArrowDown className="h-7 w-7" />
          </Button>
          <Button variant="outline" className="p-1 h-16 w-16 aspect-square" onClick={() => onAction('RIGHT')} disabled={gameOver || isPaused}>
            <ArrowRight className="h-7 w-7" />
          </Button>
        </div>
        
        {gameOver ?
      <Button variant="outline" onClick={() => onAction('RESTART')} className="mt-4 p-1 h-10 w-full bg-green-600 hover:bg-green-500 text-white border-0">
            <span className="text-sm">New Game</span>
          </Button> : isPaused ? showNewGameButton ?
      <Button variant="outline" onClick={() => onAction('RESTART')} className="mt-4 p-1 h-10 w-full bg-green-600 hover:bg-green-500 text-white border-0">
              <span className="text-sm">New Game</span>
            </Button> :
      <Button variant="outline" onClick={() => onAction('PAUSE')} className="mt-4 p-1 h-10 w-full bg-blue-600 hover:bg-blue-500 text-white border-0">
              <span className="text-sm">Resume</span>
            </Button> :
      <Button variant="outline" onClick={() => onAction('PAUSE')} className="mt-4 p-1 h-10 w-full bg-gray-700 hover:bg-gray-100 text-white border-0">
            <span className="text-sm">Pause</span>
          </Button>}
      </div>
    </div>;
};

export default GameControls;

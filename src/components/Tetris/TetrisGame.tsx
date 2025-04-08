
import React, { useCallback } from 'react';
import { useGameLogic } from './useGameLogic';
import GameBoard from './GameBoard';
import NextPiece from './NextPiece';
import GameStats from './GameStats';
import GameControls from './GameControls';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

const TetrisGame: React.FC = () => {
  const { gameState, handleGameAction } = useGameLogic();
  const isMobile = useIsMobile();
  
  // Game has started when it's not paused or when there is an active tetromino
  const gameHasStarted = !gameState.isPaused || gameState.activeTetromino !== null;
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start justify-center max-w-5xl mx-auto">
      <GameBoard 
        board={gameState.board} 
        activeTetromino={gameState.activeTetromino}
        gameOver={gameState.gameOver} 
      />
      
      <div className="flex flex-col gap-4 w-full md:w-64">
        {gameHasStarted ? (
          <>
            <NextPiece nextPiece={gameState.nextTetromino} />
            <GameStats 
              score={gameState.score} 
              level={gameState.level} 
              linesCleared={gameState.linesCleared} 
            />
            <GameControls 
              onAction={handleGameAction} 
              isPaused={gameState.isPaused}
              gameOver={gameState.gameOver}
            />
          </>
        ) : (
          <div className="text-white text-center bg-tetris-bg p-4 border-2 border-tetris-border rounded">
            <Button 
              onClick={() => handleGameAction('START')} 
              className="bg-green-600 hover:bg-green-700 mb-2 w-full p-6 flex flex-col items-center justify-center min-h-48"
            >
              <Play className="mb-6 w-40 h-40" strokeWidth={1.5} />
              Start Game
            </Button>
            <p className="text-sm mt-2 text-gray-400 opacity-75">or press any key to start</p>
          </div>
        )}
        
        {gameState.isPaused && gameHasStarted && !gameState.gameOver && (
          <div className="text-white text-center bg-tetris-bg p-2 border-2 border-tetris-border rounded">
            Game Paused
          </div>
        )}
      </div>
    </div>
  );
};

export default TetrisGame;

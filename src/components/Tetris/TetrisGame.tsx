
import React from 'react';
import { useGameLogic } from './useGameLogic';
import GameBoard from './GameBoard';
import NextPiece from './NextPiece';
import GameStats from './GameStats';
import GameControls from './GameControls';
import { useIsMobile } from '@/hooks/use-mobile';

const TetrisGame: React.FC = () => {
  const { gameState, handleGameAction } = useGameLogic();
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start justify-center max-w-5xl mx-auto">
      <GameBoard 
        board={gameState.board} 
        gameOver={gameState.gameOver} 
      />
      
      <div className="flex flex-col gap-4 w-full md:w-auto">
        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
          <NextPiece nextPiece={gameState.nextTetromino} />
          <GameStats 
            score={gameState.score} 
            level={gameState.level} 
            linesCleared={gameState.linesCleared} 
          />
        </div>
        
        {isMobile && (
          <GameControls 
            onAction={handleGameAction} 
            isPaused={gameState.isPaused}
            gameOver={gameState.gameOver}
          />
        )}
        
        {!gameState.activeTetromino && !gameState.gameOver && !gameState.isPaused && (
          <div className="text-white text-center bg-tetris-bg p-2 border-2 border-tetris-border rounded">
            Press any key to start
          </div>
        )}
        
        {gameState.isPaused && !gameState.gameOver && (
          <div className="text-white text-center bg-tetris-bg p-2 border-2 border-tetris-border rounded">
            Game Paused
          </div>
        )}
      </div>

      {!isMobile && (
        <div className="fixed bottom-4 left-4 md:static md:mt-4">
          <GameControls 
            onAction={handleGameAction} 
            isPaused={gameState.isPaused}
            gameOver={gameState.gameOver}
          />
        </div>
      )}
    </div>
  );
};

export default TetrisGame;


import React, { useCallback } from 'react';
import { useGameLogic } from './useGameLogic';
import GameBoard from './GameBoard';
import NextPiece from './NextPiece';
import GameStats from './GameStats';
import GameControls from './GameControls';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';

const TetrisGame: React.FC = () => {
  const { gameState, handleGameAction } = useGameLogic();
  const isMobile = useIsMobile();
  
  // Game has started when it's not paused or when there is an active tetromino
  const gameHasStarted = !gameState.isPaused || gameState.activeTetromino !== null;
  const notInGame = !gameState.activeTetromino || gameState.gameOver;
  
  // Only show game over text if a game has been played (score > 0 or lines cleared > 0)
  const showGameOver = gameState.gameOver && (gameState.score > 0 || gameState.linesCleared > 0);
  
  // Check if a game has been played (score > 0 or lines > 0)
  const gameHasBeenPlayed = gameState.score > 0 || gameState.linesCleared > 0 || gameState.activeTetromino !== null;
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start justify-center max-w-5xl mx-auto">
      <GameBoard 
        board={gameState.board} 
        activeTetromino={gameHasBeenPlayed ? gameState.activeTetromino : null}
        gameOver={showGameOver} 
      />
      
      <div className="flex flex-col gap-4 w-full md:w-64">
        <div className={`${gameState.gameOver ? "opacity-50" : ""}`}>
          <NextPiece 
            nextPiece={gameState.nextTetromino} 
            showPiece={gameHasBeenPlayed}
          />
        </div>
        
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

        {notInGame && (
          <div className="text-center mt-2">
            <Button 
              onClick={() => handleGameAction('RESTART')} 
              className="bg-green-600 hover:bg-green-700 w-full p-3"
            >
              New Game
            </Button>
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

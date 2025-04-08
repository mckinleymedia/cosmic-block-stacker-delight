
import React, { useCallback } from 'react';
import { useGameLogic } from './useGameLogic';
import GameBoard from './GameBoard';
import NextPiece from './NextPiece';
import GameStats from './GameStats';
import GameControls from './GameControls';
import { useIsMobile } from '@/hooks/use-mobile';

const TetrisGame: React.FC = () => {
  const { gameState, handleGameAction } = useGameLogic();
  const isMobile = useIsMobile();
  
  // Game has started when there's an active tetromino (not null)
  const gameHasStarted = gameState.activeTetromino !== null;
  
  // Show game over text if game is over (including quit state)
  const showGameOver = gameState.gameOver;
  
  // Check if a game has been played (score > 0 or lines > 0 or active tetromino exists or board has filled cells)
  const gameHasBeenPlayed = gameState.score > 0 || gameState.linesCleared > 0 || 
                            gameState.activeTetromino !== null || 
                            gameState.board.some(row => row.some(cell => cell.filled));
  
  const handleQuit = useCallback(() => {
    handleGameAction('QUIT');
  }, [handleGameAction]);
  
  return (
    <div className="flex flex-col md:flex-row gap-4 items-center md:items-start justify-center max-w-5xl mx-auto">
      <GameBoard 
        board={gameState.board} 
        activeTetromino={gameHasStarted ? gameState.activeTetromino : null}
        gameOver={showGameOver} 
        isPaused={gameState.isPaused && gameHasStarted && !gameState.gameOver}
        onQuit={handleQuit}
      />
      
      <div className="flex flex-col gap-4 w-full max-w-[200px] mx-auto">
        <div className={`${gameState.gameOver ? "opacity-50" : ""}`}>
          <NextPiece 
            nextPiece={gameState.nextTetromino} 
            showPiece={gameHasBeenPlayed}
            nextShape={gameState.nextTetrominoShape}
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
          hasActiveTetromino={gameState.activeTetromino !== null}
        />
      </div>
    </div>
  );
};

export default TetrisGame;

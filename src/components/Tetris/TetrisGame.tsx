
import React, { useCallback, useState } from 'react';
import { useGameLogic } from './useGameLogic';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import GameBoard from './GameBoard';
import NextPiece from './NextPiece';
import GameStats from './GameStats';
import GameControls from './GameControls';
import ScoreSubmissionDialog from './ScoreSubmissionDialog';
import { useIsMobile } from '@/hooks/use-mobile';

const TetrisGame: React.FC = () => {
  const { gameState, handleGameAction } = useGameLogic();
  const { qualifiesForLeaderboard, addScore } = useLeaderboard();
  const isMobile = useIsMobile();
  
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  
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
  
  // Check for high score when game ends
  React.useEffect(() => {
    if (gameState.gameOver && gameState.score > 0 && !scoreSubmitted) {
      const isHighScore = qualifiesForLeaderboard(gameState.score);
      if (isHighScore) {
        setShowScoreDialog(true);
      }
    }
  }, [gameState.gameOver, gameState.score, qualifiesForLeaderboard, scoreSubmitted]);
  
  // Submit score handler
  const handleSubmitScore = (playerName: string) => {
    addScore(gameState.score, gameState.level, gameState.linesCleared, playerName);
    setShowScoreDialog(false);
    setScoreSubmitted(true);
  };
  
  // Reset score submitted state when game restarts
  React.useEffect(() => {
    if (!gameState.gameOver) {
      setScoreSubmitted(false);
    }
  }, [gameState.gameOver]);
  
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
      
      <ScoreSubmissionDialog
        isOpen={showScoreDialog}
        onClose={() => setShowScoreDialog(false)}
        onSubmit={handleSubmitScore}
        score={gameState.score}
      />
    </div>
  );
};

export default TetrisGame;

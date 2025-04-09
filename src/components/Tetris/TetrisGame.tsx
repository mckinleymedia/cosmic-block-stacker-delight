
import React, { useCallback, useState } from 'react';
import { useGameLogic } from './useGameLogic';
import { useLeaderboard } from '@/hooks/use-leaderboard';
import GameBoard from './GameBoard';
import NextPiece from './NextPiece';
import GameStats from './GameStats';
import QuadModeStats from './QuadModeStats';
import GameControls from './GameControls';
import ScoreSubmissionDialog from './ScoreSubmissionDialog';
import LeaderboardModal from './LeaderboardModal';
import QuadModeToggle from './QuadModeToggle';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';

const TetrisGame: React.FC = () => {
  const { gameState, handleGameAction } = useGameLogic();
  const { qualifiesForLeaderboard, addScore } = useLeaderboard();
  const isMobile = useIsMobile();
  
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  // Game has started when there's an active tetromino (not null)
  const gameHasStarted = gameState.activeTetromino !== null;
  
  // Show game over text if game is over (including quit state)
  const showGameOver = gameState.gameOver;
  
  // Check if a game has been played (score > 0 or lines > 0 or active tetromino exists or board has filled cells)
  const gameHasBeenPlayed = gameState.score > 0 || gameState.linesCleared > 0 || 
                            gameState.activeTetromino !== null || 
                            gameState.board.some(row => row.some(cell => cell.filled));
  
  // Calculate total quad score
  const totalQuadScore = gameState.quadScores.up + gameState.quadScores.down + 
                         gameState.quadScores.left + gameState.quadScores.right;
                         
  // Calculate total quad lines cleared
  const totalQuadLinesCleared = gameState.quadLinesCleared.up + gameState.quadLinesCleared.down + 
                               gameState.quadLinesCleared.left + gameState.quadLinesCleared.right;
  
  const handleQuit = useCallback(() => {
    handleGameAction('QUIT');
  }, [handleGameAction]);
  
  const handleQuadModeToggle = useCallback(() => {
    handleGameAction('TOGGLE_QUAD_MODE');
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
    // If in quad mode, use the total quad score
    const finalScore = gameState.quadMode ? totalQuadScore : gameState.score;
    
    addScore(finalScore, gameState.level, gameState.linesCleared, playerName);
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
    <div className="flex flex-col gap-4 items-center justify-center max-w-5xl mx-auto">
      <GameBoard 
        board={gameState.board} 
        activeTetromino={gameHasStarted ? gameState.activeTetromino : null}
        gameOver={showGameOver} 
        isPaused={gameState.isPaused && gameHasStarted && !gameState.gameOver}
        quadMode={gameState.quadMode}
        onQuit={handleQuit}
      />
      
      {/* Horizontal panel for quad mode, vertical panel for normal mode */}
      <div className={`flex ${gameState.quadMode ? 'flex-row flex-wrap' : 'flex-col md:flex-row'} gap-4 w-full justify-center`}>
        <div className={`${gameState.gameOver ? "opacity-50" : ""} ${gameState.quadMode ? "min-w-[150px]" : "max-w-[200px] mx-auto"}`}>
          <NextPiece 
            nextPiece={gameState.nextTetromino} 
            showPiece={gameHasBeenPlayed}
            nextShape={gameState.nextTetrominoShape}
            quadMode={gameState.quadMode}
            nextDirection={gameState.quadDirection}
          />
        </div>
        
        {gameState.quadMode ? (
          <QuadModeStats 
            scores={gameState.quadScores}
            linesCleared={gameState.quadLinesCleared}
            level={gameState.level}
            totalLinesCleared={totalQuadLinesCleared}
          />
        ) : (
          <GameStats 
            score={gameState.score} 
            level={gameState.level} 
            linesCleared={gameState.linesCleared} 
          />
        )}
        
        <div className={`${gameState.quadMode ? "min-w-[150px]" : ""}`}>
          <QuadModeToggle
            enabled={gameState.quadMode}
            onToggle={handleQuadModeToggle}
          />
        </div>
        
        <div className={`${gameState.quadMode ? "min-w-[150px]" : ""}`}>
          <GameControls 
            onAction={handleGameAction} 
            isPaused={gameState.isPaused}
            gameOver={gameState.gameOver}
            hasActiveTetromino={gameState.activeTetromino !== null}
          />
        </div>
        
        <div className={`${gameState.quadMode ? "min-w-[150px]" : ""}`}>
          <Button 
            variant="outline" 
            className="border-tetris-border text-white/70 hover:text-white hover:bg-tetris-border/20 bg-[#333333] w-full"
            onClick={() => setShowLeaderboard(true)}
          >
            <Trophy className="mr-2 h-4 w-4 text-yellow-500" />
            Leaderboard
          </Button>
        </div>
      </div>
      
      <ScoreSubmissionDialog
        isOpen={showScoreDialog}
        onClose={() => setShowScoreDialog(false)}
        onSubmit={handleSubmitScore}
        score={gameState.quadMode ? totalQuadScore : gameState.score}
      />
      
      <LeaderboardModal
        isOpen={showLeaderboard}
        onOpenChange={setShowLeaderboard}
      />
    </div>
  );
};

export default TetrisGame;

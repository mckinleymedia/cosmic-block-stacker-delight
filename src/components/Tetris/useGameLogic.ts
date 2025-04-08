
import { useState, useEffect, useCallback } from 'react';
import { GameState, GameAction, ActiveTetromino } from './gameTypes';
import { BOARD_HEIGHT, BOARD_WIDTH, calculateDropInterval } from './gameConstants';
import { createEmptyBoard, checkCollision, updateBoardWithTetromino } from './boardUtils';
import { moveTetromino, rotateTetromino, getInitialPosition } from './tetrominoUtils';
import { randomTetromino, TETROMINOS, TetrominoType } from './tetrominos';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    activeTetromino: null,
    nextTetromino: randomTetromino(),
    score: 0,
    level: 1,
    linesCleared: 0,
    gameOver: false,
    isPaused: true
  });

  // Initialize game
  const initializeGame = useCallback(() => {
    const initialBoard = createEmptyBoard();
    const tetrominoType = randomTetromino();
    const nextType = randomTetromino();
    
    setGameState({
      board: initialBoard,
      activeTetromino: {
        type: tetrominoType,
        position: getInitialPosition(),
        shape: TETROMINOS[tetrominoType].shape
      },
      nextTetromino: nextType,
      score: 0,
      level: 1,
      linesCleared: 0,
      gameOver: false,
      isPaused: false
    });
  }, []);

  // Start the game
  const startGame = useCallback(() => {
    if (gameState.isPaused) {
      if (!gameState.activeTetromino) {
        // First start - initialize with a tetromino
        const tetrominoType = randomTetromino();
        setGameState(prev => ({
          ...prev,
          activeTetromino: {
            type: tetrominoType,
            position: getInitialPosition(),
            shape: TETROMINOS[tetrominoType].shape
          },
          isPaused: false
        }));
      } else {
        // Just unpause
        setGameState(prev => ({
          ...prev,
          isPaused: false
        }));
      }
    }
  }, [gameState.isPaused, gameState.activeTetromino]);

  // Update board when tetromino locks
  const updateBoard = useCallback(() => {
    if (!gameState.activeTetromino) return;

    // Update board and calculate score
    const { newBoard, linesCleared, pointsScored } = updateBoardWithTetromino(gameState);
    
    const newLinesCleared = gameState.linesCleared + linesCleared;
    const newLevel = Math.floor(newLinesCleared / 10) + 1;
    
    // Create next tetromino
    const nextType = randomTetromino();
    const nextPosition = getInitialPosition();
    const nextShape = TETROMINOS[gameState.nextTetromino].shape;
    
    // Check if new tetromino can be placed (game over check)
    if (checkCollision(nextPosition, nextShape, newBoard)) {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        activeTetromino: null,
        gameOver: true,
        isPaused: true,
        score: prev.score + pointsScored,
        linesCleared: newLinesCleared,
        level: newLevel
      }));
      return;
    }
    
    // Continue game with next tetromino
    setGameState(prev => ({
      ...prev,
      board: newBoard,
      activeTetromino: {
        type: gameState.nextTetromino,
        position: nextPosition,
        shape: nextShape
      },
      nextTetromino: nextType,
      score: prev.score + pointsScored,
      linesCleared: newLinesCleared,
      level: newLevel
    }));
  }, [gameState]);

  // Move active tetromino
  const moveTetrominoAction = useCallback((direction: 'LEFT' | 'RIGHT' | 'DOWN') => {
    if (!gameState.activeTetromino || gameState.isPaused || gameState.gameOver) return false;

    const { newTetromino, collided } = moveTetromino(gameState, direction);
    
    if (collided) {
      updateBoard();
      return false;
    } else if (newTetromino) {
      setGameState(prev => ({
        ...prev,
        activeTetromino: newTetromino
      }));
      return true;
    }
    
    return false;
  }, [gameState, updateBoard]);

  // Rotate active tetromino
  const rotatePieceAction = useCallback(() => {
    if (!gameState.activeTetromino || gameState.isPaused || gameState.gameOver) return;

    const rotated = rotateTetromino(gameState);
    
    if (rotated && rotated !== gameState.activeTetromino) {
      setGameState(prev => ({
        ...prev,
        activeTetromino: rotated
      }));
    }
  }, [gameState]);

  // Toggle game pause
  const togglePause = useCallback(() => {
    if (gameState.gameOver) return;

    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, [gameState.gameOver]);

  // Restart game
  const restartGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  // Quit game - reset to initial state with isPaused = true
  const quitGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      activeTetromino: null,
      nextTetromino: randomTetromino(),
      score: 0,
      level: 1,
      linesCleared: 0,
      gameOver: false,
      isPaused: true
    });
  }, []);

  // Handle game actions
  const handleGameAction = useCallback((action: GameAction) => {
    switch (action) {
      case 'LEFT':
        moveTetrominoAction('LEFT');
        break;
      case 'RIGHT':
        moveTetrominoAction('RIGHT');
        break;
      case 'DOWN':
        moveTetrominoAction('DOWN');
        break;
      case 'ROTATE':
        rotatePieceAction();
        break;
      case 'PAUSE':
        togglePause();
        break;
      case 'RESTART':
        restartGame();
        break;
      case 'QUIT':
        quitGame();
        break;
      default:
        break;
    }
  }, [moveTetrominoAction, rotatePieceAction, togglePause, restartGame, quitGame]);

  // Game loop
  useEffect(() => {
    if (gameState.isPaused || gameState.gameOver) return;
    
    if (!gameState.activeTetromino && !gameState.isPaused && !gameState.gameOver) {
      const tetrominoType = gameState.nextTetromino;
      const nextType = randomTetromino();
      
      setGameState(prev => ({
        ...prev,
        activeTetromino: {
          type: tetrominoType,
          position: getInitialPosition(),
          shape: TETROMINOS[tetrominoType].shape
        },
        nextTetromino: nextType
      }));
      return;
    }
    
    const interval = setInterval(() => {
      console.log("Drop interval executed", gameState.activeTetromino?.position);
      
      if (gameState.activeTetromino) {
        const moveResult = moveTetrominoAction('DOWN');
        if (!moveResult) {
          console.log("Piece locked, generating new piece");
        }
      }
    }, calculateDropInterval(gameState.level));

    return () => {
      clearInterval(interval);
    };
  }, [
    gameState.isPaused,
    gameState.gameOver,
    gameState.activeTetromino,
    moveTetrominoAction,
    gameState.level,
    gameState.nextTetromino
  ]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.gameOver) {
        if (event.key === 'r' || event.key === 'R') {
          restartGame();
        }
        return;
      }

      if (gameState.isPaused && !gameState.gameOver) {
        // Don't resume for spacebar - only for other keys
        if (event.key !== ' ') {
          startGame();
        } else {
          // If it's spacebar and game is paused, toggle pause (to resume)
          togglePause();
        }
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          handleGameAction('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          handleGameAction('RIGHT');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          handleGameAction('DOWN');
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          handleGameAction('ROTATE');
          break;
        case ' ':  // Spacebar for pause
          handleGameAction('PAUSE');
          break;
        case 'p':
        case 'P':
          handleGameAction('PAUSE');
          break;
        case 'r':
        case 'R':
          handleGameAction('RESTART');
          break;
        case 'q':
        case 'Q':
          handleGameAction('QUIT');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, handleGameAction, restartGame, startGame, togglePause]);

  // Initialize game on first load
  useEffect(() => {
    const initialBoard = createEmptyBoard();
    const nextType = randomTetromino();
    
    setGameState(prev => ({
      ...prev,
      board: initialBoard,
      nextTetromino: nextType,
      isPaused: true
    }));
  }, []);

  return {
    gameState,
    handleGameAction
  };
};

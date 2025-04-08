import { useState, useEffect, useCallback } from 'react';
import { TETROMINOS, TetrominoType, randomTetromino, rotateTetromino } from './tetrominos';

// Game board dimensions
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

// Score per lines cleared
const POINTS = {
  1: 100,
  2: 300,
  3: 500,
  4: 800
};

export type Cell = {
  filled: boolean;
  color: string;
};

export type Position = {
  x: number;
  y: number;
};

export type ActiveTetromino = {
  type: TetrominoType;
  position: Position;
  shape: number[][];
};

export type GameState = {
  board: Cell[][];
  activeTetromino: ActiveTetromino | null;
  nextTetromino: TetrominoType;
  score: number;
  level: number;
  linesCleared: number;
  gameOver: boolean;
  isPaused: boolean;
};

type GameAction = 
  | 'LEFT' 
  | 'RIGHT' 
  | 'DOWN' 
  | 'ROTATE' 
  | 'PAUSE' 
  | 'RESTART';

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' }))
    ),
    activeTetromino: null,
    nextTetromino: randomTetromino(),
    score: 0,
    level: 1,
    linesCleared: 0,
    gameOver: false,
    isPaused: true
  });

  // Get drop interval based on level
  const dropInterval = useCallback(() => {
    return Math.max(800 - (gameState.level - 1) * 100, 100);
  }, [gameState.level]);

  // Initialize board and tetromino
  const initializeGame = useCallback(() => {
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' }))
    );
    
    const tetrominoType = randomTetromino();
    const nextType = randomTetromino();
    
    setGameState({
      board: initialBoard,
      activeTetromino: {
        type: tetrominoType,
        position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
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
            position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
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

  // Check for collision
  const checkCollision = useCallback((position: Position, shape: number[][]) => {
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardX = position.x + x;
          const boardY = position.y + y;

          if (
            boardX < 0 || 
            boardX >= BOARD_WIDTH || 
            boardY >= BOARD_HEIGHT
          ) {
            return true;
          }

          if (boardY >= 0 && gameState.board[boardY][boardX].filled) {
            return true;
          }
        }
      }
    }
    return false;
  }, [gameState.board]);

  // Update the board with the current tetromino
  const updateBoard = useCallback(() => {
    if (!gameState.activeTetromino) return;

    const { position, shape, type } = gameState.activeTetromino;
    const newBoard = JSON.parse(JSON.stringify(gameState.board));
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] !== 0) {
          const boardY = position.y + y;
          const boardX = position.x + x;
          
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = {
              filled: true,
              color: TETROMINOS[type].color
            };
          }
        }
      }
    }

    const completedLines: number[] = [];
    
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell.filled)) {
        completedLines.push(y);
      }
    }

    if (completedLines.length > 0) {
      for (const line of completedLines) {
        newBoard.splice(line, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' })));
      }
      
      const pointsScored = POINTS[completedLines.length as keyof typeof POINTS] * gameState.level;
      const newLinesCleared = gameState.linesCleared + completedLines.length;
      const newLevel = Math.floor(newLinesCleared / 10) + 1;
      
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        activeTetromino: null,
        score: prev.score + pointsScored,
        linesCleared: newLinesCleared,
        level: newLevel
      }));
    } else {
      setGameState(prev => ({
        ...prev,
        board: newBoard,
        activeTetromino: null
      }));
    }
    
    const nextType = randomTetromino();
    const nextPosition = { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 };
    const nextShape = TETROMINOS[gameState.nextTetromino].shape;
    
    if (checkCollision(nextPosition, nextShape)) {
      setGameState(prev => ({
        ...prev,
        gameOver: true,
        isPaused: true
      }));
      return;
    }
    
    setGameState(prev => ({
      ...prev,
      activeTetromino: {
        type: gameState.nextTetromino,
        position: nextPosition,
        shape: nextShape
      },
      nextTetromino: nextType
    }));
    
  }, [gameState, checkCollision]);

  // Move tetromino
  const moveTetromino = useCallback((direction: 'LEFT' | 'RIGHT' | 'DOWN') => {
    if (!gameState.activeTetromino || gameState.isPaused || gameState.gameOver) return false;

    const { position, shape } = gameState.activeTetromino;
    let newPosition = { ...position };

    if (direction === 'LEFT') {
      newPosition.x -= 1;
    } else if (direction === 'RIGHT') {
      newPosition.x += 1;
    } else if (direction === 'DOWN') {
      newPosition.y += 1;
    }

    if (!checkCollision(newPosition, shape)) {
      setGameState(prev => ({
        ...prev,
        activeTetromino: {
          ...prev.activeTetromino!,
          position: newPosition
        }
      }));
      return true; // Move was successful
    } else if (direction === 'DOWN') {
      updateBoard();
      return false; // Move was unsuccessful (collision)
    }
    
    return false; // Move was unsuccessful (collision)
  }, [gameState, checkCollision, updateBoard]);

  // Rotate tetromino
  const rotatePiece = useCallback(() => {
    if (!gameState.activeTetromino || gameState.isPaused || gameState.gameOver) return;

    const rotated = rotateTetromino(gameState.activeTetromino.shape);
    
    if (!checkCollision(gameState.activeTetromino.position, rotated)) {
      setGameState(prev => ({
        ...prev,
        activeTetromino: {
          ...prev.activeTetromino!,
          shape: rotated
        }
      }));
    }
  }, [gameState, checkCollision]);

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

  // Handle game actions
  const handleGameAction = useCallback((action: GameAction) => {
    switch (action) {
      case 'LEFT':
        moveTetromino('LEFT');
        break;
      case 'RIGHT':
        moveTetromino('RIGHT');
        break;
      case 'DOWN':
        moveTetromino('DOWN');
        break;
      case 'ROTATE':
        rotatePiece();
        break;
      case 'PAUSE':
        togglePause();
        break;
      case 'RESTART':
        restartGame();
        break;
      default:
        break;
    }
  }, [moveTetromino, rotatePiece, togglePause, restartGame]);

  // Game loop - CRITICAL FIX
  useEffect(() => {
    if (gameState.isPaused || gameState.gameOver) return;
    
    if (!gameState.activeTetromino && !gameState.isPaused && !gameState.gameOver) {
      const tetrominoType = gameState.nextTetromino;
      const nextType = randomTetromino();
      
      setGameState(prev => ({
        ...prev,
        activeTetromino: {
          type: tetrominoType,
          position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 },
          shape: TETROMINOS[tetrominoType].shape
        },
        nextTetromino: nextType
      }));
      return;
    }
    
    const interval = setInterval(() => {
      console.log("Drop interval executed", gameState.activeTetromino?.position);
      
      if (gameState.activeTetromino) {
        const moveResult = moveTetromino('DOWN');
        if (!moveResult) {
          console.log("Piece locked, generating new piece");
        }
      }
    }, dropInterval());

    return () => {
      clearInterval(interval);
    };
  }, [
    gameState.isPaused,
    gameState.gameOver,
    gameState.activeTetromino,
    moveTetromino,
    dropInterval,
    gameState.nextTetromino
  ]);

  // Keyboard controls - Updated to handle game start with any key and remove START action
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
    const initialBoard = Array(BOARD_HEIGHT).fill(null).map(() => 
      Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false, color: '' }))
    );
    
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

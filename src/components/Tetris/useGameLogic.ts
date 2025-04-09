import { useState, useEffect, useCallback } from 'react';
import { GameState, GameAction, ActiveTetromino, Direction, QuadScores } from './gameTypes';
import { 
  BOARD_HEIGHT, 
  BOARD_WIDTH, 
  calculateDropInterval, 
  getRandomDirection,
  QUAD_CENTER_POSITION,
  QUAD_CENTER_SIZE
} from './gameConstants';
import { createEmptyBoard, checkCollision, updateBoardWithTetromino } from './boardUtils';
import { moveTetromino, rotateTetromino, getInitialPosition, createTetromino } from './tetrominoUtils';
import { randomTetromino, TETROMINOS, TetrominoType, getRandomlyRotatedShape } from './tetrominos';

const createEmptyQuadScores = (): QuadScores => ({
  up: 0,
  down: 0,
  left: 0,
  right: 0
});

export const useGameLogic = () => {
  const [gameState, setGameState] = useState<GameState>({
    board: createEmptyBoard(),
    activeTetromino: null,
    nextTetromino: randomTetromino(),
    nextTetrominoShape: [], // Initialize empty, will be set properly
    score: 0,
    level: 1,
    linesCleared: 0,
    gameOver: false,
    isPaused: true,
    quadMode: false, // Initialize quad mode as false
    quadDirection: 'DOWN', // Default direction
    quadScores: createEmptyQuadScores(), // Initialize quad scores
    quadLinesCleared: createEmptyQuadScores() // Initialize quad lines cleared
  });

  useEffect(() => {
    setGameState(prev => ({
      ...prev,
      nextTetrominoShape: getRandomlyRotatedShape(prev.nextTetromino)
    }));
  }, []);

  const getQuadModeInitialPosition = (direction: Direction): { x: number, y: number } => {
    const centerX = QUAD_CENTER_POSITION.x + Math.floor(QUAD_CENTER_SIZE / 2) - 1;
    const centerY = QUAD_CENTER_POSITION.y + Math.floor(QUAD_CENTER_SIZE / 2) - 1;
    
    return { x: centerX, y: centerY };
  };

  const initializeGame = useCallback(() => {
    const initialBoard = createEmptyBoard();
    const tetrominoType = randomTetromino();
    const nextType = randomTetromino();
    const nextShape = getRandomlyRotatedShape(nextType);
    const newDirection = getRandomDirection();
    
    setGameState((prev) => ({
      ...prev,
      board: initialBoard,
      activeTetromino: prev.quadMode ? 
        { ...createTetromino(tetrominoType), position: getQuadModeInitialPosition(newDirection), direction: newDirection } : 
        createTetromino(tetrominoType),
      nextTetromino: nextType,
      nextTetrominoShape: nextShape,
      score: 0,
      level: 1,
      linesCleared: 0,
      gameOver: false,
      isPaused: false,
      quadMode: prev.quadMode,
      quadDirection: newDirection,
      quadScores: createEmptyQuadScores(),
      quadLinesCleared: createEmptyQuadScores()
    }));
  }, []);

  const startGame = useCallback(() => {
    if (gameState.isPaused) {
      if (!gameState.activeTetromino) {
        const tetrominoType = randomTetromino();
        const nextType = randomTetromino();
        const nextShape = getRandomlyRotatedShape(nextType);
        const newDirection = getRandomDirection();
        
        setGameState(prev => ({
          ...prev,
          activeTetromino: prev.quadMode ? 
            { ...createTetromino(tetrominoType), position: getQuadModeInitialPosition(newDirection), direction: newDirection } : 
            createTetromino(tetrominoType),
          nextTetromino: nextType,
          nextTetrominoShape: nextShape,
          isPaused: false,
          quadDirection: newDirection
        }));
      } else {
        setGameState(prev => ({
          ...prev,
          isPaused: false
        }));
      }
    }
  }, [gameState.isPaused, gameState.activeTetromino]);

  const updateBoard = useCallback(() => {
    if (!gameState.activeTetromino) return;

    const { 
      newBoard, 
      linesCleared, 
      pointsScored, 
      quadDirection, 
      quadLinesCleared, 
      quadPointsScored 
    } = updateBoardWithTetromino(gameState);
    
    const newLinesCleared = gameState.linesCleared + linesCleared;
    const newLevel = Math.floor(newLinesCleared / 10) + 1;
    
    const newTetrominoType = gameState.nextTetromino;
    const newDirection = getRandomDirection();
    
    const newActiveTetromino = createTetromino(newTetrominoType);
    newActiveTetromino.shape = [...gameState.nextTetrominoShape];
    
    if (gameState.quadMode) {
      newActiveTetromino.position = getQuadModeInitialPosition(newDirection);
      newActiveTetromino.direction = newDirection;
    }
    
    const nextType = randomTetromino();
    const nextShape = getRandomlyRotatedShape(nextType);
    
    if (checkCollision(newActiveTetromino.position, newActiveTetromino.shape, newBoard)) {
      setGameState(prev => {
        let newQuadScores = {...prev.quadScores};
        let newQuadLinesCleared = {...prev.quadLinesCleared};
        
        if (prev.quadMode && quadDirection && quadPointsScored) {
          const dirKey = quadDirection.toLowerCase() as keyof QuadScores;
          if (quadPointsScored[dirKey]) {
            newQuadScores[dirKey] = (prev.quadScores[dirKey] || 0) + (quadPointsScored[dirKey] || 0);
          }
          
          if (quadLinesCleared && quadLinesCleared[dirKey]) {
            newQuadLinesCleared[dirKey] = (prev.quadLinesCleared[dirKey] || 0) + (quadLinesCleared[dirKey] || 0);
          }
        }
        
        return {
          ...prev,
          board: newBoard,
          activeTetromino: null,
          gameOver: true,
          isPaused: true,
          score: prev.score + (prev.quadMode ? 0 : pointsScored),
          linesCleared: newLinesCleared,
          level: newLevel,
          quadScores: newQuadScores,
          quadLinesCleared: newQuadLinesCleared
        };
      });
      return;
    }
    
    setGameState(prev => {
      let newQuadScores = {...prev.quadScores};
      let newQuadLinesCleared = {...prev.quadLinesCleared};
      
      if (prev.quadMode && quadDirection && quadPointsScored) {
        const dirKey = quadDirection.toLowerCase() as keyof QuadScores;
        if (quadPointsScored[dirKey]) {
          newQuadScores[dirKey] = (prev.quadScores[dirKey] || 0) + (quadPointsScored[dirKey] || 0);
        }
        
        if (quadLinesCleared && quadLinesCleared[dirKey]) {
          newQuadLinesCleared[dirKey] = (prev.quadLinesCleared[dirKey] || 0) + (quadLinesCleared[dirKey] || 0);
        }
      }
      
      return {
        ...prev,
        board: newBoard,
        activeTetromino: newActiveTetromino,
        nextTetromino: nextType,
        nextTetrominoShape: nextShape,
        score: prev.score + (prev.quadMode ? 0 : pointsScored),
        linesCleared: newLinesCleared,
        level: newLevel,
        quadDirection: newDirection,
        quadScores: newQuadScores,
        quadLinesCleared: newQuadLinesCleared
      };
    });
  }, [gameState]);

  const moveTetrominoAction = useCallback((direction: 'LEFT' | 'RIGHT' | 'DOWN') => {
    if (!gameState.activeTetromino || gameState.isPaused || gameState.gameOver) return false;

    if (gameState.quadMode && gameState.activeTetromino.direction) {
      const quadDirection = gameState.activeTetromino.direction;
      
      if (quadDirection === 'UP' && direction === 'DOWN') {
        const { newTetromino, collided } = moveTetromino(gameState, 'UP');
        
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
      }
      
      if ((quadDirection === 'LEFT' && direction !== 'LEFT') ||
          (quadDirection === 'RIGHT' && direction !== 'RIGHT') ||
          (quadDirection === 'DOWN' && direction !== 'DOWN')) {
        return false;
      }
    }

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

  const togglePause = useCallback(() => {
    if (gameState.gameOver) return;

    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused
    }));
  }, [gameState.gameOver]);

  const toggleQuadMode = useCallback(() => {
    setGameState(prev => {
      const newQuadMode = !prev.quadMode;
      const newDirection = getRandomDirection();
      
      let updatedActiveTetromino = prev.activeTetromino;
      
      if (updatedActiveTetromino && newQuadMode) {
        updatedActiveTetromino = {
          ...updatedActiveTetromino,
          position: getQuadModeInitialPosition(newDirection),
          direction: newDirection
        };
      } else if (updatedActiveTetromino && !newQuadMode) {
        updatedActiveTetromino = {
          ...updatedActiveTetromino,
          position: getInitialPosition(),
          direction: undefined
        };
      }
      
      return {
        ...prev,
        quadMode: newQuadMode,
        quadDirection: newDirection,
        activeTetromino: updatedActiveTetromino,
        quadScores: createEmptyQuadScores(),
        quadLinesCleared: createEmptyQuadScores()
      };
    });
  }, []);

  const restartGame = useCallback(() => {
    initializeGame();
  }, [initializeGame]);

  const quitGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      activeTetromino: null,
      gameOver: true,
      isPaused: true
    }));
  }, []);

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
      case 'TOGGLE_QUAD_MODE':
        toggleQuadMode();
        break;
      default:
        break;
    }
  }, [moveTetrominoAction, rotatePieceAction, togglePause, restartGame, quitGame, toggleQuadMode]);

  useEffect(() => {
    if (gameState.isPaused || gameState.gameOver) return;
    
    if (!gameState.activeTetromino && !gameState.isPaused && !gameState.gameOver) {
      const newDirection = getRandomDirection();
      const activeTetromino = createTetromino(gameState.nextTetromino);
      
      activeTetromino.shape = [...gameState.nextTetrominoShape];
      
      if (gameState.quadMode) {
        activeTetromino.direction = newDirection;
        activeTetromino.position = getQuadModeInitialPosition(newDirection);
      }
      
      const nextType = randomTetromino();
      const nextShape = getRandomlyRotatedShape(nextType);
      
      setGameState(prev => ({
        ...prev,
        activeTetromino,
        nextTetromino: nextType,
        nextTetrominoShape: nextShape,
        quadDirection: newDirection
      }));
      return;
    }
    
    const interval = setInterval(() => {
      console.log("Drop interval executed", gameState.activeTetromino?.position);
      
      if (gameState.activeTetromino) {
        if (gameState.quadMode && gameState.activeTetromino.direction === 'UP') {
          const { newTetromino, collided } = moveTetromino(gameState, 'UP');
          
          if (collided) {
            updateBoard();
          } else if (newTetromino) {
            setGameState(prev => ({
              ...prev,
              activeTetromino: newTetromino
            }));
          }
        } else {
          const moveResult = moveTetrominoAction('DOWN');
          if (!moveResult) {
            console.log("Piece locked, generating new piece");
          }
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
    gameState.nextTetromino,
    gameState.nextTetrominoShape,
    gameState.quadMode,
    updateBoard
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (gameState.gameOver) {
        if (event.key === 'r' || event.key === 'R') {
          restartGame();
        }
        return;
      }

      if (gameState.isPaused && !gameState.gameOver) {
        if (event.key !== ' ') {
          startGame();
        } else {
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
        case 't':
        case 'T':
          handleGameAction('TOGGLE_QUAD_MODE');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState, handleGameAction, restartGame, startGame, togglePause, toggleQuadMode]);

  useEffect(() => {
    const initialBoard = createEmptyBoard();
    const nextType = randomTetromino();
    const nextShape = getRandomlyRotatedShape(nextType);
    
    setGameState(prev => ({
      ...prev,
      board: initialBoard,
      nextTetromino: nextType,
      nextTetrominoShape: nextShape,
      isPaused: true
    }));
  }, []);

  return {
    gameState,
    handleGameAction
  };
};

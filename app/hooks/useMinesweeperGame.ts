import { useState, useEffect, useCallback } from 'react';
import { MinesweeperGame, Difficulty, GameState, Cell } from '@/app/lib/minesweeper';

export function useMinesweeperGame(initialDifficulty: Difficulty = 'beginner') {
  const [game] = useState(() => new MinesweeperGame(initialDifficulty));
  const [board, setBoard] = useState<Cell[][]>([]);
  const [gameState, setGameState] = useState<GameState>('idle');
  const [remainingMines, setRemainingMines] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const updateState = useCallback(() => {
    setBoard(game.getBoard().map(row => [...row])); // Deep copy for React re-render
    setGameState(game.getGameState());
    setRemainingMines(game.getRemainingMines());
    setElapsedTime(game.getElapsedTime());
  }, [game]);

  useEffect(() => {
    updateState();
  }, [updateState]);

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setElapsedTime(game.getElapsedTime());
    }, 1000);

    return () => clearInterval(interval);
  }, [gameState, game]);

  const handleCellClick = useCallback((row: number, col: number) => {
    game.revealCell(row, col);
    updateState();
  }, [game, updateState]);

  const handleCellRightClick = useCallback((row: number, col: number) => {
    game.toggleFlag(row, col);
    updateState();
  }, [game, updateState]);

  const handleCellChord = useCallback((row: number, col: number) => {
    game.chord(row, col);
    updateState();
  }, [game, updateState]);

  const handleReset = useCallback((difficulty?: Difficulty) => {
    game.reset(difficulty);
    updateState();
  }, [game, updateState]);

  return {
    board,
    gameState,
    remainingMines,
    elapsedTime,
    handleCellClick,
    handleCellRightClick,
    handleCellChord,
    handleReset,
  };
}

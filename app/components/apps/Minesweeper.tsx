'use client';

import { useState, useEffect, useRef } from 'react';
import { useMinesweeperGame } from '@/app/hooks/useMinesweeperGame';
import { useSoundEffects } from '@/app/hooks/useSoundEffects';
import { Difficulty, Cell, GameState } from '@/app/lib/minesweeper';

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState<Difficulty>('beginner');
  const { playSound } = useSoundEffects();
  const prevGameStateRef = useRef<GameState>('idle');
  const {
    board,
    gameState,
    remainingMines,
    elapsedTime,
    handleCellClick,
    handleCellRightClick,
    handleCellChord,
    handleReset,
  } = useMinesweeperGame(difficulty);

  // Play explosion sound when mine is revealed
  useEffect(() => {
    if (gameState === 'lost' && prevGameStateRef.current !== 'lost') {
      playSound('mineExplode');
    }
    prevGameStateRef.current = gameState;
  }, [gameState, playSound]);

  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    handleReset(newDifficulty);
  };

  const getFaceEmoji = () => {
    if (gameState === 'lost') return '😵';
    if (gameState === 'won') return '😎';
    return '🙂';
  };

  const formatNumber = (num: number): string => {
    return Math.abs(num).toString().padStart(3, '0');
  };

  const getCellContent = (cell: Cell) => {
    if (cell.state === 'flagged') return '🚩';
    if (cell.state === 'hidden') return '';
    if (cell.value === 'mine') return '💣';
    if (cell.value === 0) return '';
    return cell.value.toString();
  };

  const getCellColor = (cell: Cell): string => {
    if (cell.state !== 'revealed') return '';
    switch (cell.value) {
      case 1: return 'text-blue-600';
      case 2: return 'text-green-600';
      case 3: return 'text-red-600';
      case 4: return 'text-blue-800';
      case 5: return 'text-red-800';
      case 6: return 'text-cyan-600';
      case 7: return 'text-black';
      case 8: return 'text-gray-600';
      default: return '';
    }
  };

  const getCellBackground = (cell: Cell): string => {
    if (cell.state === 'revealed') {
      if (cell.value === 'mine' && gameState === 'lost') {
        return 'bg-red-500';
      }
      return 'bg-[#c0c0c0]';
    }
    return 'bg-[#c0c0c0]';
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] p-1">
      {/* Menu Bar */}
      <div className="border-b-2 border-[#808080] border-t-[#dfdfdf] border-l-[#dfdfdf] border-r-[#808080] mb-1">
        <div className="flex gap-4 px-2 py-1 text-sm">
          <div className="relative group">
            <button className="hover:bg-[#000080] hover:text-white px-2">
              Game
            </button>
            <div className="hidden group-hover:block absolute top-full left-0 bg-[#c0c0c0] border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#000] border-r-[#000] shadow-lg z-10 min-w-[150px]">
              <button
                onClick={() => handleReset(difficulty)}
                className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white"
              >
                New Game
              </button>
              <div className="border-t border-gray-400 my-1"></div>
              <button
                onClick={() => handleDifficultyChange('beginner')}
                className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white"
              >
                Beginner
              </button>
              <button
                onClick={() => handleDifficultyChange('intermediate')}
                className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white"
              >
                Intermediate
              </button>
              <button
                onClick={() => handleDifficultyChange('expert')}
                className="w-full text-left px-4 py-1 hover:bg-[#000080] hover:text-white"
              >
                Expert
              </button>
            </div>
          </div>
          <button className="hover:bg-[#000080] hover:text-white px-2">
            Help
          </button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="border-4 border-[#808080] border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf] p-2 mb-2">
        <div className="flex items-center justify-between">
          {/* Mine Counter */}
          <div 
            className="digital-display border-2 border-[#808080] text-center flex items-center justify-center" 
            style={{ width: '55px', height: '28px' }}
          >
            {formatNumber(remainingMines)}
          </div>

          {/* Face Button */}
          <button
            onClick={() => handleReset(difficulty)}
            className="text-2xl w-10 h-10 flex items-center justify-center border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#000] border-r-[#000] bg-[#c0c0c0] active:border-t-[#000] active:border-l-[#000] active:border-b-[#dfdfdf] active:border-r-[#dfdfdf]"
          >
            {getFaceEmoji()}
          </button>

          {/* Timer */}
          <div 
            className="digital-display border-2 border-[#808080] text-center flex items-center justify-center" 
            style={{ width: '55px', height: '28px' }}
          >
            {formatNumber(Math.min(elapsedTime, 999))}
          </div>
        </div>
      </div>

      {/* Game Board */}
      <div className="flex-1 overflow-auto flex items-center justify-center">
        <div className="border-4 border-[#808080] border-t-[#808080] border-l-[#808080] border-b-[#dfdfdf] border-r-[#dfdfdf] p-1 inline-block">
          {board.length > 0 && (
            <div 
              className="grid gap-0" 
              style={{ gridTemplateColumns: `repeat(${board[0]?.length || 9}, 20px)` }}
            >
              {board.map((row, rowIndex) =>
                row.map((cell, colIndex) => (
                  <button
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      handleCellRightClick(rowIndex, colIndex);
                    }}
                    onMouseDown={(e) => {
                      // Middle click or both buttons for chord
                      if (e.button === 1 || e.buttons === 3) {
                        e.preventDefault();
                        handleCellChord(rowIndex, colIndex);
                      }
                    }}
                    className={`
                      w-5 h-5 text-xs font-bold flex items-center justify-center
                      ${getCellBackground(cell)}
                      ${
                        cell.state === 'revealed'
                          ? 'border border-gray-400'
                          : 'border-2 border-t-[#dfdfdf] border-l-[#dfdfdf] border-b-[#808080] border-r-[#808080] active:border-2 active:border-gray-400'
                      }
                      ${getCellColor(cell)}
                    `}
                    disabled={gameState === 'won' || gameState === 'lost'}
                  >
                    {getCellContent(cell)}
                  </button>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

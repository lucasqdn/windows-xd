// Minesweeper game logic

export type CellState = 'hidden' | 'revealed' | 'flagged';
export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 'mine';

export interface Cell {
  value: CellValue;
  state: CellState;
  row: number;
  col: number;
}

export type GameState = 'idle' | 'playing' | 'won' | 'lost';

export interface GameConfig {
  rows: number;
  cols: number;
  mines: number;
}

export const DIFFICULTIES = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  expert: { rows: 16, cols: 30, mines: 99 },
} as const;

export type Difficulty = keyof typeof DIFFICULTIES;

export class MinesweeperGame {
  private board: Cell[][] = [];
  private config: GameConfig;
  private gameState: GameState = 'idle';
  private flagCount: number = 0;
  private revealedCount: number = 0;
  private firstClick: boolean = true;
  private startTime: number = 0;

  constructor(difficulty: Difficulty = 'beginner') {
    this.config = DIFFICULTIES[difficulty];
    this.initializeBoard();
  }

  private initializeBoard(): void {
    this.board = [];
    for (let row = 0; row < this.config.rows; row++) {
      const rowCells: Cell[] = [];
      for (let col = 0; col < this.config.cols; col++) {
        rowCells.push({
          value: 0,
          state: 'hidden',
          row,
          col,
        });
      }
      this.board.push(rowCells);
    }
  }

  private placeMines(excludeRow: number, excludeCol: number): void {
    let minesPlaced = 0;
    while (minesPlaced < this.config.mines) {
      const row = Math.floor(Math.random() * this.config.rows);
      const col = Math.floor(Math.random() * this.config.cols);

      // Don't place mine on first click or if already has mine
      if (
        (row === excludeRow && col === excludeCol) ||
        this.board[row][col].value === 'mine'
      ) {
        continue;
      }

      this.board[row][col].value = 'mine';
      minesPlaced++;
    }

    // Calculate numbers for all cells
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        if (this.board[row][col].value !== 'mine') {
          this.board[row][col].value = this.countAdjacentMines(row, col);
        }
      }
    }
  }

  private countAdjacentMines(row: number, col: number): CellValue {
    let count = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < this.config.rows &&
          newCol >= 0 &&
          newCol < this.config.cols &&
          this.board[newRow][newCol].value === 'mine'
        ) {
          count++;
        }
      }
    }
    return count as CellValue;
  }

  public revealCell(row: number, col: number): boolean {
    if (this.gameState === 'won' || this.gameState === 'lost') {
      return false;
    }

    const cell = this.board[row][col];
    if (cell.state !== 'hidden') {
      return false;
    }

    // First click - initialize game
    if (this.firstClick) {
      this.placeMines(row, col);
      this.firstClick = false;
      this.gameState = 'playing';
      this.startTime = Date.now();
    }

    // Hit a mine - game over
    if (cell.value === 'mine') {
      cell.state = 'revealed';
      this.gameState = 'lost';
      this.revealAllMines();
      return true;
    }

    // Reveal cell
    this.revealCellRecursive(row, col);
    
    // Check win condition
    this.checkWinCondition();
    
    return true;
  }

  private revealCellRecursive(row: number, col: number): void {
    if (
      row < 0 ||
      row >= this.config.rows ||
      col < 0 ||
      col >= this.config.cols
    ) {
      return;
    }

    const cell = this.board[row][col];
    if (cell.state !== 'hidden' || cell.value === 'mine') {
      return;
    }

    cell.state = 'revealed';
    this.revealedCount++;

    // If empty cell, reveal neighbors
    if (cell.value === 0) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          this.revealCellRecursive(row + dr, col + dc);
        }
      }
    }
  }

  public toggleFlag(row: number, col: number): void {
    if (this.gameState === 'won' || this.gameState === 'lost') {
      return;
    }

    const cell = this.board[row][col];
    if (cell.state === 'revealed') {
      return;
    }

    if (cell.state === 'hidden') {
      cell.state = 'flagged';
      this.flagCount++;
    } else if (cell.state === 'flagged') {
      cell.state = 'hidden';
      this.flagCount--;
    }
  }

  public chord(row: number, col: number): void {
    if (this.gameState !== 'playing') {
      return;
    }

    const cell = this.board[row][col];
    if (cell.state !== 'revealed' || cell.value === 0 || cell.value === 'mine') {
      return;
    }

    // Count adjacent flags
    let flagCount = 0;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        const newRow = row + dr;
        const newCol = col + dc;
        if (
          newRow >= 0 &&
          newRow < this.config.rows &&
          newCol >= 0 &&
          newCol < this.config.cols &&
          this.board[newRow][newCol].state === 'flagged'
        ) {
          flagCount++;
        }
      }
    }

    // If flags match number, reveal unflagged neighbors
    if (flagCount === cell.value) {
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if (dr === 0 && dc === 0) continue;
          const newRow = row + dr;
          const newCol = col + dc;
          if (
            newRow >= 0 &&
            newRow < this.config.rows &&
            newCol >= 0 &&
            newCol < this.config.cols
          ) {
            this.revealCell(newRow, newCol);
          }
        }
      }
    }
  }

  private revealAllMines(): void {
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        const cell = this.board[row][col];
        if (cell.value === 'mine') {
          cell.state = 'revealed';
        }
      }
    }
  }

  private checkWinCondition(): void {
    const totalCells = this.config.rows * this.config.cols;
    const requiredRevealed = totalCells - this.config.mines;
    
    if (this.revealedCount === requiredRevealed) {
      this.gameState = 'won';
      // Auto-flag remaining mines
      for (let row = 0; row < this.config.rows; row++) {
        for (let col = 0; col < this.config.cols; col++) {
          const cell = this.board[row][col];
          if (cell.value === 'mine' && cell.state !== 'flagged') {
            cell.state = 'flagged';
            this.flagCount++;
          }
        }
      }
    }
  }

  public getBoard(): Cell[][] {
    return this.board;
  }

  public getGameState(): GameState {
    return this.gameState;
  }

  public getRemainingMines(): number {
    return this.config.mines - this.flagCount;
  }

  public getElapsedTime(): number {
    if (this.gameState === 'idle') return 0;
    if (this.gameState === 'won' || this.gameState === 'lost') {
      // Return the time when game ended (frozen)
      return Math.floor((Date.now() - this.startTime) / 1000);
    }
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  public reset(difficulty?: Difficulty): void {
    if (difficulty) {
      this.config = DIFFICULTIES[difficulty];
    }
    this.initializeBoard();
    this.gameState = 'idle';
    this.flagCount = 0;
    this.revealedCount = 0;
    this.firstClick = true;
    this.startTime = 0;
  }
}

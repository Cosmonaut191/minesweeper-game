import React, { useState, useEffect } from 'react';
import { Flag, Bomb } from 'lucide-react';

const Minesweeper = () => {
  // Game configuration constants
  const BOARD_SIZE = 9;
  const MINES_COUNT = 10;

  // State management using React hooks
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [flagMode, setFlagMode] = useState(false);
  const [mineCount, setMineCount] = useState(MINES_COUNT);
  const [firstClick, setFirstClick] = useState(true);

  // Initialize the game board when component mounts
  useEffect(() => {
    initializeBoard();
  }, []);

  // Creates a fresh game board
  const initializeBoard = () => {
    const newBoard = Array(BOARD_SIZE).fill().map(() =>
      Array(BOARD_SIZE).fill().map(() => ({
        isMine: false,
        neighbor: 0,
        isRevealed: false,
        isFlagged: false
      }))
    );
    setBoard(newBoard);
    setGameOver(false);
    setWin(false);
    setMineCount(MINES_COUNT);
    setFirstClick(true);
  };

  // Places mines randomly, ensuring first clicked cell is safe
  const placeMines = (firstRow, firstCol) => {
    const newBoard = [...board];
    let minesPlaced = 0;

    while (minesPlaced < MINES_COUNT) {
      const row = Math.floor(Math.random() * BOARD_SIZE);
      const col = Math.floor(Math.random() * BOARD_SIZE);

      if (!newBoard[row][col].isMine && !(row === firstRow && col === firstCol)) {
        newBoard[row][col].isMine = true;
        minesPlaced++;

        // Update neighbor counts
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (row + i >= 0 && row + i < BOARD_SIZE && col + j >= 0 && col + j < BOARD_SIZE) {
              newBoard[row + i][col + j].neighbor++;
            }
          }
        }
      }
    }

    setBoard(newBoard);
  };

  // Checks if the player has won
  const checkWin = () => {
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (!board[row][col].isMine && !board[row][col].isRevealed) {
          return false;
        }
      }
    }
    return true;
  };

  // Reveals all cells when game is over
  const revealAll = () => {
    const newBoard = board.map(row =>
      row.map(cell => ({
        ...cell,
        isRevealed: true
      }))
    );
    setBoard(newBoard);
  };

  // Recursively reveals empty cells and their neighbors
  const revealEmpty = (row, col, newBoard) => {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return;
    if (newBoard[row][col].isRevealed || newBoard[row][col].isFlagged) return;

    newBoard[row][col].isRevealed = true;

    if (newBoard[row][col].neighbor === 0) {
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          revealEmpty(row + i, col + j, newBoard);
        }
      }
    }
  };

  // Handles cell click events
  const handleCellClick = (row, col) => {
    if (gameOver || win || board[row][col].isRevealed) return;

    const newBoard = [...board];

    if (firstClick) {
      placeMines(row, col);
      setFirstClick(false);
    }

    if (flagMode) {
      if (!newBoard[row][col].isRevealed) {
        newBoard[row][col].isFlagged = !newBoard[row][col].isFlagged;
        setMineCount(mineCount + (newBoard[row][col].isFlagged ? -1 : 1));
      }
      setBoard(newBoard);
      return;
    }

    if (newBoard[row][col].isFlagged) return;

    if (newBoard[row][col].isMine) {
      setGameOver(true);
      revealAll();
      return;
    }

    revealEmpty(row, col, newBoard);
    setBoard(newBoard);

    if (checkWin()) {
      setWin(true);
    }
  };

  // Renders the content of a cell
  const getCellContent = (cell) => {
    if (cell.isFlagged) {
      return <Flag className="w-4 h-4" />;
    }
    if (cell.isRevealed) {
      if (cell.isMine) {
        return <Bomb className="w-4 h-4" />;
      }
      return cell.neighbor === 0 ? '' : cell.neighbor;
    }
    return '';
  };

  // Gets the appropriate CSS classes for a cell
  const getCellClasses = (cell) => {
    let classes = 'cell';
    
    if (!cell.isRevealed) {
      classes += ' cell-unrevealed';
    } else {
      classes += cell.isMine ? ' cell-mine' : ' cell-revealed';
      if (cell.neighbor > 0) {
        classes += ` number-${cell.neighbor}`;
      }
    }
    
    return classes;
  };

  return (
    <div className="minesweeper-container">
      <div className="control-panel">
        <button
          onClick={initializeBoard}
          className="new-game-button"
        >
          New Game
        </button>
        <button
          onClick={() => setFlagMode(!flagMode)}
          className={`flag-mode-button ${flagMode ? 'active' : 'inactive'}`}
        >
          Flag Mode
        </button>
        <div className="mine-counter">
          <Flag className="w-4 h-4" />
          <span>{mineCount}</span>
        </div>
      </div>

      <div className={`game-board ${gameOver ? 'game-over' : ''}`}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <button
                key={`${rowIndex}-${colIndex}`}
                className={getCellClasses(cell)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
              >
                {getCellContent(cell)}
              </button>
            ))}
          </div>
        ))}
      </div>

      {(gameOver || win) && (
        <div className={`game-status ${win ? 'status-win' : 'status-lose'}`}>
          {win ? 'You Win!' : 'Game Over!'}
        </div>
      )}
    </div>
  );
};

export default Minesweeper;

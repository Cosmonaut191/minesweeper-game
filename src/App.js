import React, { useState } from 'react';
import Minesweeper from './Minesweeper';
import TicTacToe from './TicTacToe';
import Snake from './Snake';
import './index.css';

const App = () => {
  const [showSnake, setShowSnake] = useState(false);

  const toggleSnake = () => {
    setShowSnake(!showSnake);
  };

  return (
    <div className="app-container">
      <h1>Game Center</h1>
      <button 
        className="toggle-snake-btn"
        onClick={toggleSnake}
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 1001,
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        {showSnake ? 'Exit Snake' : 'Play Snake'}
      </button>
      <div className="games-container">
        <div className="game-section">
          <h2>Minesweeper</h2>
          <Minesweeper />
        </div>
        <div className="game-section">
          <h2>Tic Tac Toe</h2>
          <TicTacToe />
        </div>
      </div>
      {showSnake && <Snake onClose={() => setShowSnake(false)} />}
    </div>
  );
};

export default App;

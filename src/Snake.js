import React, { useState, useEffect, useCallback } from 'react';
import './Snake.css';

const Snake = ({ onClose }) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('right');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const moveSnake = useCallback(() => {
    const head = { ...snake[0] };
    switch (direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
      default:
        break;
    }

    if (head.x < 0 || head.x * 20 >= window.innerWidth || head.y < 0 || head.y * 20 >= window.innerHeight || checkCollision(head)) {
      setGameOver(true);
      return;
    }

    setSnake([head, ...snake.slice(0, -1)]);

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      setFood({ x: Math.floor(Math.random() * Math.floor(window.innerWidth / 20)), y: Math.floor(Math.random() * Math.floor(window.innerHeight / 20)) });
      setSnake([head, ...snake]);
    }
  }, [direction, snake, food, score]);

  const checkCollision = (head) => {
    return snake.some((part) => part.x === head.x && part.y === head.y);
  };

  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(moveSnake, 100);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver, moveSnake]);

  const handleKeyDown = useCallback((e) => {
    if (!gameStarted || gameOver) return;

    // Handle Escape key to close the game
    if (e.key === 'Escape') {
      onClose();
      return;
    }

    let newDirection = direction;
    
    if (e.key === 'ArrowUp' && direction !== 'down') {
      newDirection = 'up';
    } else if (e.key === 'ArrowDown' && direction !== 'up') {
      newDirection = 'down';
    } else if (e.key === 'ArrowLeft' && direction !== 'right') {
      newDirection = 'left';
    } else if (e.key === 'ArrowRight' && direction !== 'left') {
      newDirection = 'right';
    }

    if (newDirection !== direction) {
      setDirection(newDirection);
    }
  }, [direction, gameStarted, gameOver, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const startGame = () => {
    setGameOver(false);
    setGameStarted(true);
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('right');
    setScore(0);
  };

  return (
    <div className="snake-game" onClick={(e) => e.stopPropagation()}>
      <div className="snake-overlay">
        <div className="snake-header">
          <h2>Snake Game</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        {gameOver ? (
          <div className="game-controls">
            <button onClick={startGame}>Start Game</button>
            <p>Score: {score}</p>
            <p>Press ESC to exit</p>
          </div>
        ) : (
          <div className="board">
            {snake.map((part, index) => (
              <div key={index} className="snake-part" style={{ left: part.x * 20, top: part.y * 20 }}></div>
            ))}
            <div className="food" style={{ left: food.x * 20, top: food.y * 20 }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Snake;

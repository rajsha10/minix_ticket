"use client";

import React, { useState, useEffect, useCallback } from 'react';
import './MemoryMatchDuel.css';

interface Score {
  name: string;
  time: number;
}

interface CardProps {
  icon: string;
  index: number;
  isFlipped: boolean;
  isMatched: boolean;
  onClick: (index: number) => void;
}

const Card: React.FC<CardProps> = ({ icon, index, isFlipped, isMatched, onClick }) => (
  <div 
    className={`card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
    onClick={() => onClick(index)}
  >
    <div className="card-inner">
      <div className="card-back">?</div>
      <div className="card-front">{icon}</div>
    </div>
  </div>
);

const MemoryMatchDuel: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const [cards, setCards] = useState<Array<{ icon: string; isFlipped: boolean; isMatched: boolean }>>([]);
  const [firstCard, setFirstCard] = useState<number | null>(null);
  const [secondCard, setSecondCard] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [canFlip, setCanFlip] = useState(true);
  const [scores, setScores] = useState<Score[]>([]);
  const [gameStarted, setGameStarted] = useState(false);

  const icons = ["🍎", "🍌", "🍇", "🍓", "🍒", "🍑", "🍉", "🥝"];

  const initializeGame = useCallback(() => {
    if (!playerName) {
      alert("Please enter your name to start the game!");
      return;
    }

    const shuffledIcons = [...icons, ...icons].sort(() => Math.random() - 0.5);
    setCards(shuffledIcons.map(icon => ({
      icon,
      isFlipped: false,
      isMatched: false
    })));
    
    setMatchedPairs(0);
    setTimer(0);
    setCanFlip(true);
    setFirstCard(null);
    setSecondCard(null);
    setGameStarted(true);

    if (timerInterval) clearInterval(timerInterval);
    const newInterval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);
    setTimerInterval(newInterval);
  }, [playerName, timerInterval]);

  const handleCardClick = (index: number) => {
    if (!canFlip || cards[index].isMatched || cards[index].isFlipped) return;

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    if (firstCard === null) {
      setFirstCard(index);
    } else {
      setSecondCard(index);
      setCanFlip(false);
    }
  };

  const checkForMatch = useCallback(() => {
    if (firstCard === null || secondCard === null) return;

    const newCards = [...cards];
    if (cards[firstCard].icon === cards[secondCard].icon) {
      newCards[firstCard].isMatched = true;
      newCards[secondCard].isMatched = true;
      setMatchedPairs(prev => prev + 1);
    } else {
      setTimeout(() => {
        newCards[firstCard].isFlipped = false;
        newCards[secondCard].isFlipped = false;
        setCards(newCards);
      }, 1000);
    }

    setFirstCard(null);
    setSecondCard(null);
    setCanFlip(true);
  }, [cards, firstCard, secondCard]);

  const endGame = useCallback(() => {
    if (timerInterval) clearInterval(timerInterval);
    alert(`Congratulations, ${playerName}! You completed the game in ${timer} seconds.`);

    if (!bestTime || timer < bestTime) {
      setBestTime(timer);
      localStorage.setItem("bestTime", timer.toString());
      alert("New Best Time! 🎉");
    }

    const newScores = [...scores, { name: playerName, time: timer }]
      .sort((a, b) => a.time - b.time)
      .slice(0, 5);
    
    setScores(newScores);
    localStorage.setItem("scores", JSON.stringify(newScores));
    setGameStarted(false);
  }, [playerName, timer, bestTime, scores, timerInterval]);

  const resetScores = () => {
    if (confirm("Are you sure you want to reset the scoreboard? This action cannot be undone.")) {
      localStorage.removeItem("scores");
      setScores([]);
      alert("Scoreboard has been reset!");
    }
  };

  useEffect(() => {
    if (matchedPairs === icons.length) {
      endGame();
    }
  }, [matchedPairs, endGame, icons.length]);

  useEffect(() => {
    if (firstCard !== null && secondCard !== null) {
      checkForMatch();
    }
  }, [firstCard, secondCard, checkForMatch]);

  useEffect(() => {
    const savedBestTime = localStorage.getItem("bestTime");
    const savedScores = localStorage.getItem("scores");
    
    if (savedBestTime) setBestTime(parseInt(savedBestTime));
    if (savedScores) setScores(JSON.parse(savedScores));

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, []);

  return (
    <div className="game-container">
      <h1>Memory Match Duel</h1>
      <div className="name-input">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          disabled={gameStarted}
        />
        <button onClick={initializeGame} disabled={gameStarted}>
          Start Game
        </button>
      </div>
      
      <div className="stats">
        <div>Timer: {timer} seconds</div>
        <div>Best Time: {bestTime ? `${bestTime} seconds` : '--'}</div>
      </div>

      <div className="board">
        {cards.map((card, index) => (
          <Card
            key={index}
            icon={card.icon}
            index={index}
            isFlipped={card.isFlipped}
            isMatched={card.isMatched}
            onClick={handleCardClick}
          />
        ))}
      </div>

      <button onClick={initializeGame}>Restart Game</button>

      <div className="scoreboard">
        <h2>Scoreboard</h2>
        <div id="scoreboard-list">
          {scores.length > 0 ? (
            scores.map((score, index) => (
              <div key={index}>{score.name}: {score.time} seconds</div>
            ))
          ) : (
            "No scores yet."
          )}
        </div>
        <button onClick={resetScores}>Reset Scoreboard</button>
      </div>
    </div>
  );
};

export default MemoryMatchDuel;
import React, { useState } from 'react';
import './components/TicTacToe.css';
import TicTacToe from './components/TicTacToe';
import CatFact from './components/CatFact';

function App() {
  const [showCatFact, setShowCatFact] = useState(false);

  const handleMove = () => {
    setShowCatFact(true);
  };

  return (
    <div className="game">
      <div className="game-info">
        <h1>Ultimate Tic Tac Toe with Cat Facts</h1>
      </div>
      <TicTacToe onMove={handleMove} />
      {showCatFact && (
        <div className="cat-fact-container">
          <CatFact />
        </div>
      )}
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import './App.css';
import './components/TicTacToe.css';
import TicTacToe from './components/TicTacToe';
import RulesModal from './components/RulesModal';
import CatFact from './components/CatFact';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [showRules, setShowRules] = useState(false);
  const [catFact, setCatFact] = useState('');

  useEffect(() => {
    // Fetch initial cat fact
    setCatFact(''); // Trigger initial fetch
  }, []);

  // Add setCatFact to window for child component access
  useEffect(() => {
    window.setCatFact = setCatFact;
    return () => {
      delete window.setCatFact;
    };
  }, []);

  const handlePlayerChange = (player) => {
    setCurrentPlayer(player);
    // Fetch a new cat fact
    setCatFact(''); // Reset to trigger new fetch
  };

  const handleRulesClick = () => {
    setShowRules(true);
  };

  const handleCloseRules = () => {
    setShowRules(false);
  };

  return (
    <div className="app-container">
      <div className="game-container">

        <button
          onClick={handleRulesClick}
          className="rules-button"
        >
          📚 Rules
        </button>
        <div className="game-board-container">
          <TicTacToe onPlayerChange={handlePlayerChange} />
          <div className="cat-fact-container" style={{
            marginTop: '1.5rem',
            width: '100%',
            maxWidth: '600px',
            margin: '1.5rem auto 0'
          }}>
            <CatFact fact={catFact} />
          </div>
        </div>
        <RulesModal isOpen={showRules} onClose={handleCloseRules} />
      </div>
    </div>
  );
}

export default App;

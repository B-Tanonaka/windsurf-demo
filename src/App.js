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

  // No need for initial effect as CatFact handles its own data fetching

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
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          flex: 1
        }}>
          <button onClick={handleRulesClick} className="rules-button">
            📚 Rules
          </button>
          <div className="game-board-container">
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0'
            }}>
              <h1 style={{ 
                color: 'white', 
                fontSize: '2rem', 
                fontWeight: 'bold',
                textAlign: 'center'
              }}>
                Ultimate Tic Tac Toe
              </h1>
              <h2 style={{ 
                color: 'white', 
                fontSize: '1rem', 
                fontWeight: '300',
                opacity: '0.8',
                textAlign: 'center',
                marginTop: '-0.5rem'
              }}>
                and cat fact generator
              </h2>
              <TicTacToe onPlayerChange={handlePlayerChange} />
            </div>
          </div>
        </div>
      </div>
      <CatFact fact={catFact} />
      <RulesModal isOpen={showRules} onClose={handleCloseRules} />
    </div>
  );
}

export default App;

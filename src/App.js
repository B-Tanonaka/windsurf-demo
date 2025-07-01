import React, { useState } from 'react';
import './App.css';
import './components/TicTacToe.css';
import TicTacToe from './components/TicTacToe';
import RulesModal from './components/RulesModal';

function App() {
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [showRules, setShowRules] = useState(false);

  const handlePlayerChange = (player) => {
    setCurrentPlayer(player);
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
        <TicTacToe onPlayerChange={handlePlayerChange} />
        <RulesModal isOpen={showRules} onClose={handleCloseRules} />
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      boxSizing: 'border-box',
      background: 'linear-gradient(135deg, #001a33 0%, #00264d 100%)',
      backgroundSize: 'cover',
      overflow: 'auto',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        left: currentPlayer === 'X' ? '0' : 'unset',
        right: currentPlayer === 'O' ? '0' : 'unset',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        backgroundColor: currentPlayer === 'X' ? 'rgba(233, 119, 159, 0.3)' : 'rgba(0, 166, 255, 0.3)',
        color: 'white',
        fontSize: '1.1rem',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        zIndex: 1000
      }}>
        Player {currentPlayer}'s turn
      </div>
      <button
        style={{
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          background: 'rgba(0, 166, 255, 0.8)',
          color: 'white',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '1rem',
          fontWeight: '500',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          transition: 'background-color 0.2s ease',
          zIndex: 1000
        }}
        onClick={handleRulesClick}
      >
        📚 Rules
      </button>
      <div style={{
        width: '100%',
        maxWidth: '60%',
        margin: '0 auto',
        padding: '1rem'
      }}>
        <TicTacToe onPlayerChange={handlePlayerChange} />
      </div>
    </div>
  );
}

export default App;

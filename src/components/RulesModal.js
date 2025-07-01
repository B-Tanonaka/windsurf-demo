import React from 'react';
import './RulesModal.css';

const RulesModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="rules-modal-overlay">
      <div className="rules-modal">
        <div className="rules-modal-header">
          <h2>Ultimate Tic Tac Toe Rules</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="rules-modal-content">
          <h3>Basic Rules</h3>
          <ul>
            <li>Ultimate Tic Tac Toe is played on a 3x3 grid of 3x3 boards.</li>
            <li>Each board is a standard Tic Tac Toe game.</li>
            <li>Players take turns placing their symbol (X or O) on one of the boards.</li>
            <li>The first player to win three boards in a row wins the game.</li>
          </ul>

          <h3>Special Rules</h3>
          <ul>
            <li>After each move, the next player must play in the board corresponding to the square they just played.</li>
            <li>If that board is already won, the player can play in any available board.</li>
            <li>If a player wins a board, they can no longer play in that board.</li>
          </ul>

          <h3>Winning</h3>
          <ul>
            <li>To win the game, a player must win three boards in a row, column, or diagonal.</li>
            <li>The winning boards must be in a straight line just like in regular Tic Tac Toe.</li>
          </ul>

          <h3>Tips</h3>
          <ul>
            <li>Try to control the center board as it gives you the most options for your next move.</li>
            <li>Look for opportunities to create multiple threats at once.</li>
            <li>Pay attention to which boards are still available to play in.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RulesModal;

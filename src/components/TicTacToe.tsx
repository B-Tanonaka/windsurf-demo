import React, { useState } from 'react';

interface Cell {
  value: 'X' | 'O' | null;
  won: boolean;
}

interface Board {
  cells: Cell[][];
  winner: 'X' | 'O' | null;
}

interface GameState {
  boards: Board[][];
  currentPlayer: 'X' | 'O';
  selectedBoard: number | null;
  gameWinner: 'X' | 'O' | null;
}

interface TicTacToeProps {
  onPlayerChange: (player: 'X' | 'O') => void;
}

const TicTacToe: React.FC<TicTacToeProps> = ({ onPlayerChange }) => {
  // Initialize game state
  const [history, setHistory] = useState<GameState[]>([{
    boards: Array(3).fill(null).map(() => 
      Array(3).fill(null).map(() => ({
        cells: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({
          value: null,
          won: false
        }))) as Cell[][],
        winner: null
      }))
    ),
    currentPlayer: 'X',
    selectedBoard: null,
    gameWinner: null
  }]);

  // Derived state from history
  const currentStep = history.length - 1;
  const currentGameState = history[currentStep];
  const boards = currentGameState.boards;
  const currentPlayer = currentGameState.currentPlayer;
  const selectedBoard = currentGameState.selectedBoard;
  const gameWinner = currentGameState.gameWinner;

  const checkWinner = (cells: Cell[][]) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (let [a, b, c] of lines) {
      const rowA = Math.floor(a / 3);
      const colA = a % 3;
      const rowB = Math.floor(b / 3);
      const colB = b % 3;
      const rowC = Math.floor(c / 3);
      const colC = c % 3;

      if (cells[rowA][colA].value && 
          cells[rowA][colA].value === cells[rowB][colB].value && 
          cells[rowB][colB].value === cells[rowC][colC].value) {
        return cells[rowA][colA].value;
      }
    }
    return null;
  };

  const handleCellClick = (boardRow: number, boardCol: number, cellRow: number, cellCol: number) => {
    if (gameWinner) {
      // Reset game when there's a winner
      setHistory([{
        boards: Array(3).fill(null).map(() => 
          Array(3).fill(null).map(() => ({
            cells: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({
              value: null,
              won: false
            }))) as Cell[][],
            winner: null
          }))
        ),
        currentPlayer: 'X',
        selectedBoard: null,
        gameWinner: null
      }]);
      return;
    }

    // Check if this move would force the other player into a won board
    const nextBoardIndex = cellRow * 3 + cellCol;
    const nextBoard = boards[Math.floor(nextBoardIndex / 3)][nextBoardIndex % 3];
    const isForcedToWonBoard = selectedBoard !== null && nextBoard.winner;

    // Check if player is trying to play in the correct board
    if (selectedBoard !== null && selectedBoard !== boardRow * 3 + boardCol) {
      // Only allow playing in other boards if the target board is won
      if (!boards[boardRow][boardCol].winner) return;
    }

    // If the board is won but the player is forced to play here, allow the move
    const isForcedMove = selectedBoard !== null && selectedBoard === boardRow * 3 + boardCol;
    if (boards[boardRow][boardCol].winner && !isForcedMove) return;
    
    if (boards[boardRow][boardCol].cells[cellRow][cellCol].value) return;

    const newBoards = JSON.parse(JSON.stringify(boards));
    newBoards[boardRow][boardCol].cells[cellRow][cellCol].value = currentPlayer;

    const boardWinner = checkWinner(newBoards[boardRow][boardCol].cells);
    if (boardWinner) {
      newBoards[boardRow][boardCol].winner = boardWinner;
      const gameWinner = checkWinner(newBoards.map((row: Board[]) => row.map((board: Board) => ({
        value: board.winner,
        won: board.winner !== null
      }))));
      if (gameWinner) {
        setHistory([{
          boards: Array(3).fill(null).map(() => 
            Array(3).fill(null).map(() => ({
              cells: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({
                value: null,
                won: false
              }))) as Cell[][],
              winner: null
            }))
          ),
          currentPlayer: 'X',
          selectedBoard: null,
          gameWinner: null
        }]);
        return;
      }
    }

    // Update game state
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setHistory(prev => [...prev, {
      boards: newBoards,
      currentPlayer: nextPlayer,
      // If the next player would be forced into a won board, allow them to play anywhere
      selectedBoard: nextBoard.winner ? null : cellRow * 3 + cellCol,
      gameWinner: null
    }]);
    onPlayerChange(nextPlayer);
  };

  const renderBoard = (board: Board, boardRow: number, boardCol: number): React.ReactElement => {
    const boardClass = `board ${board.winner ? 'won' : ''} ${
      selectedBoard === boardRow * 3 + boardCol ? 'active' : ''
    } ${board.winner === 'X' ? 'won-by-x' : board.winner === 'O' ? 'won-by-o' : ''}`;
    return (
      <div className={boardClass}>
        {board.cells.map((row, i) => (
          <div key={i} className="board-row">
            {row.map((cell, j) => (
              <button
                key={j}
                className={`cell ${cell.won ? 'won' : ''}`}
                onClick={() => handleCellClick(boardRow, boardCol, i, j)}
                disabled={cell.value !== null || board.winner !== null || gameWinner !== null}
              >
                {cell.value}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  };

  const handleUndo = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="game">
      <h1 style={{ color: 'white' }}>Ultimate Tic Tac Toe</h1>
      {selectedBoard !== null && (
        <div className="selected-info">
          Next player must play in the highlighted board
        </div>
      )}
      <div className="game-info">
        <button
          className={`undo-button ${history.length > 1 ? 'enabled' : ''}`}
          onClick={handleUndo}
          disabled={history.length <= 1}
        >
          Undo Last Move
        </button>
      </div>
      <div className="game-board">
        {boards.map((row, i) => (
          <div key={i} className="board-row">
            {row.map((board, j) => (
              <div key={j} className="board-container">
                {renderBoard(board, i, j)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicTacToe;

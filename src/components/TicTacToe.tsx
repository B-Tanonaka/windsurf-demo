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

  const checkWinner = (cells: Array<{ value: 'X' | 'O' | null; won?: boolean }[]>) => {
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

    for (const [a, b, c] of lines) {
      const rowA = Math.floor(a / 3);
      const colA = a % 3;
      const rowB = Math.floor(b / 3);
      const colB = b % 3;
      const rowC = Math.floor(c / 3);
      const colC = c % 3;

      const cellA = cells[rowA]?.[colA]?.value;
      const cellB = cells[rowB]?.[colB]?.value;
      const cellC = cells[rowC]?.[colC]?.value;

      if (cellA && cellA === cellB && cellB === cellC) {
        return cellA;
      }
    }
    return null;
  };

  const handleCellClick = async (boardRow: number, boardCol: number, cellRow: number, cellCol: number) => {
    // If there's already a winner and user clicks, reset the game
    if (currentGameState.gameWinner) {
      const newGameState: GameState = {
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
      };
      
      // Use a single state update to reset the game
      setHistory([newGameState]);
      onPlayerChange('X');
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

    // Check for board winner
    const boardWinner = checkWinner(newBoards[boardRow][boardCol].cells);
    if (boardWinner) {
      newBoards[boardRow][boardCol].winner = boardWinner;
    }
    
    // Check for game winner by examining all board winners
    const boardWinners = newBoards.flat().map((board: Board) => ({
      value: board.winner,
      won: board.winner !== null
    }));
    
    // Convert to 3x3 grid for checkWinner
    const winnerGrid: Array<Array<{ value: 'X' | 'O' | null; won: boolean }>> = [];
    for (let i = 0; i < 3; i++) {
      const row = boardWinners.slice(i * 3, (i + 1) * 3);
      winnerGrid.push(row);
    }
    
    const gameWinner = checkWinner(winnerGrid);

    // Update game state
    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    
    // Create the new game state
    const newState: GameState = {
      boards: newBoards,
      currentPlayer: nextPlayer as 'X' | 'O',
      // If the next player would be forced into a won board, allow them to play anywhere
      selectedBoard: nextBoard.winner ? null : cellRow * 3 + cellCol,
      gameWinner: gameWinner || null
    };
    
    // Use functional update to ensure we have the latest state
    setHistory(prev => {
      const newHistory = [...prev, newState];
      return newHistory;
    });
    
    // Update the player after state is set
    setTimeout(() => {
      onPlayerChange(nextPlayer);
    }, 0);
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
    if (gameWinner) {
      // Reset the game if there's a winner
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
    } else if (history.length > 1) {
      // Regular undo
      setHistory(prev => prev.slice(0, -1));
    }
  };

  return (
    <div className="game">
      <div className="game-info">
        <div>Player {currentPlayer}'s turn</div>
        {gameWinner && <div>Player {gameWinner} wins!</div>}
        <button 
          className={`action-button ${gameWinner ? 'restart' : 'undo'} ${(history.length > 1 || gameWinner) ? 'enabled' : ''}`}
          onClick={handleUndo}
          disabled={!gameWinner && history.length <= 1}
        >
          {gameWinner ? 'Restart Game' : 'Undo Last Move'}
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

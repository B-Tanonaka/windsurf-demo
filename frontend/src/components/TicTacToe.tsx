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

const TicTacToe: React.FC = () => {
  const [history, setHistory] = useState<GameState[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [boards, setBoards] = useState<Board[][]>(() => {
    const initialBoards: Board[][] = Array(3).fill(null).map(() => 
      Array(3).fill(null).map(() => ({
        cells: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({
          value: null,
          won: false
        }))) as Cell[][],
        winner: null
      }))
    );
    return initialBoards;
  });
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [selectedBoard, setSelectedBoard] = useState<number | null>(null);
  const [gameWinner, setGameWinner] = useState<'X' | 'O' | null>(null);

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
      // Clear history when starting a new game
      setHistory([]);
      setCurrentStep(0);
      return;
    }

    // Check if this move would force the other player into a won board
    const nextBoardIndex = cellRow * 3 + cellCol;
    const nextBoard = boards[Math.floor(nextBoardIndex / 3)][nextBoardIndex % 3];
    const isForcedToWonBoard = selectedBoard !== null && nextBoard.winner;

    // If player is forced to play in a won board, allow any board
    if (selectedBoard !== null && boards[boardRow][boardCol].winner) {
      // Allow any board since the player is forced into a won board
      if (boards[boardRow][boardCol].cells[cellRow][cellCol].value) return;
      setSelectedBoard(null);
      return;
    }

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
        setGameWinner(gameWinner);
      }
    }

    setBoards(newBoards);
    setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
    
    // Update board selection based on move
    if (isForcedToWonBoard) {
      setSelectedBoard(null);
    } else if (boards[boardRow][boardCol].winner) {
      setSelectedBoard(null);
    } else {
      setSelectedBoard(cellRow * 3 + cellCol);
    }

    // Update game state
    setHistory(prev => [...prev.slice(0, currentStep + 1), {
      boards: newBoards,
      currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      selectedBoard: boards[boardRow][boardCol].winner ? null : cellRow * 3 + cellCol,
      gameWinner: gameWinner || null
    }]);
    setCurrentStep(currentStep + 1);
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
    if (currentStep > 0) {
      const previousState = history[currentStep - 1];
      setBoards(previousState.boards);
      setCurrentPlayer(previousState.currentPlayer);
      setSelectedBoard(previousState.selectedBoard);
      setGameWinner(previousState.gameWinner);
      setCurrentStep(currentStep - 1);

      // Force re-render to update board restrictions
      setBoards(prev => {
        const newBoards = JSON.parse(JSON.stringify(prev));
        return newBoards;
      });
    }
  };

  return (
    <div className="game">
      <h1 style={{ color: 'white' }}>Ultimate Tic Tac Toe</h1>
      <div className="game-info">
        <div>Player {currentPlayer}'s turn</div>
        {gameWinner && <div>Player {gameWinner} wins!</div>}
        <button
          className="undo-button"
          onClick={handleUndo}
          disabled={currentStep === 0}
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
      {selectedBoard !== null && (
        <div className="selected-info">
          Next player must play in the highlighted board
        </div>
      )}
    </div>
  );
};

export default TicTacToe;

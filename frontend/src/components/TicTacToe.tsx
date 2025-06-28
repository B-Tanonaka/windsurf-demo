import React, { useState, useEffect } from 'react';

interface Cell {
  value: 'X' | 'O' | null;
  won: boolean;
}

interface Board {
  cells: Cell[][];
  winner: 'X' | 'O' | null;
}

const TicTacToe: React.FC = () => {
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
    if (gameWinner || boards[boardRow][boardCol].winner) return;
    if (selectedBoard !== null && selectedBoard !== boardRow * 3 + boardCol) return;
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
    setSelectedBoard(cellRow * 3 + cellCol);
  };

  const renderBoard = (board: Board, boardRow: number, boardCol: number): React.ReactElement => {
    const boardClass = `board ${board.winner ? 'won' : ''}`;
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

  return (
    <div className="game">
      <h1>Ultimate Tic Tac Toe</h1>
      <div className="game-info">
        <div>Player {currentPlayer}'s turn</div>
        {gameWinner && <div>Player {gameWinner} wins!</div>}
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

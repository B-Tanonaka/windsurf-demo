import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Grid,
  Alert,
  AlertTitle
} from '@mui/material';

const Game = ({ onMove }) => {
  const [history, setHistory] = useState([{
    boards: Array(3).fill(null).map(() => 
      Array(3).fill(null).map(() => ({
        cells: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({
          value: null,
          won: false
        })))))
    ),
    currentPlayer: 'X',
    selectedBoard: null,
    gameWinner: null
  }]);

  const checkWinner = (cells) => {
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
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
        return cells[a];
      }
    }
    return null;
  };

  const handleCellClick = (boardRow, boardCol, cellRow, cellCol) => {
    const currentGameState = history[history.length - 1];
    const boards = currentGameState.boards;
    const currentPlayer = currentGameState.currentPlayer;
    const selectedBoard = currentGameState.selectedBoard;
    const gameWinner = currentGameState.gameWinner;

    if (gameWinner) {
      setHistory([{
        boards: Array(3).fill(null).map(() => 
          Array(3).fill(null).map(() => ({
            cells: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({
              value: null,
              won: false
            }))) as any[][],
            winner: null
          }))
        ),
        currentPlayer: 'X',
        selectedBoard: null,
        gameWinner: null
      }]);
      return;
    }

    const board = boards[boardRow][boardCol];
    const cell = board.cells[cellRow][cellCol];
    const nextBoardIndex = cellRow * 3 + cellCol;
    const nextBoard = boards[Math.floor(nextBoardIndex / 3)][nextBoardIndex % 3];
    const isForcedToWonBoard = selectedBoard !== null && nextBoard.winner;

    if (cell.value) return;

    const newBoards = JSON.parse(JSON.stringify(boards));
    newBoards[boardRow][boardCol].cells[cellRow][cellCol].value = currentPlayer;
    newBoards[boardRow][boardCol].winner = checkWinner(
      newBoards[boardRow][boardCol].cells.map(row => row.map(cell => cell.value))
    );

    let newGameWinner = null;
    const boardWinners = newBoards.map(row => row.map(board => board.winner));
    newGameWinner = checkWinner(boardWinners.flat());

    if (newGameWinner) {
      setHistory([{
        boards: Array(3).fill(null).map(() => 
          Array(3).fill(null).map(() => ({
            cells: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({
              value: null,
              won: false
            }))) as any[][],
            winner: null
          }))
        ),
        currentPlayer: 'X',
        selectedBoard: null,
        gameWinner: null
      }]);
      return;
    }

    setHistory(prev => [...prev, {
      boards: newBoards,
      currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      selectedBoard: nextBoard.winner ? null : cellRow * 3 + cellCol,
      gameWinner: null
    }]);

    // Trigger cat fact generation
    onMove();
  };

  const renderCell = (board, boardRow, boardCol, cellRow, cellCol) => {
    const cell = board.cells[cellRow][cellCol];
    const selectedBoard = history[history.length - 1].selectedBoard;
    const isCurrentBoard = selectedBoard === null || selectedBoard === boardRow * 3 + boardCol;
    const isWonBoard = board.winner;
    const isWonCell = cell.won;

    return (
      <Button
        variant="contained"
        color={isCurrentBoard ? 'primary' : 'default'}
        onClick={() => handleCellClick(boardRow, boardCol, cellRow, cellCol)}
        disabled={cell.value || (!isCurrentBoard && !isWonBoard)}
        style={{
          height: '100%',
          width: '100%',
          fontSize: '2rem',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: 0,
          opacity: isWonCell ? 0.5 : 1,
          backgroundColor: isWonCell ? '#ccc' : undefined
        }}
      >
        {cell.value}
      </Button>
    );
  };

  const renderBoard = (board, boardRow, boardCol) => {
    const selectedBoard = history[history.length - 1].selectedBoard;
    const isCurrentBoard = selectedBoard === null || selectedBoard === boardRow * 3 + boardCol;
    const isWonBoard = board.winner;

    return (
      <Paper
        elevation={isCurrentBoard ? 8 : 3}
        sx={{
          p: 1,
          mb: 2,
          background: isWonBoard ? '#ccc' : 'linear-gradient(135deg, #2d1a4a 0%, #3d215a 100%)',
          color: '#fff',
          opacity: isWonBoard ? 0.5 : 1
        }}
      >
        <Grid container spacing={1}>
          {board.cells.map((row, i) => (
            <Grid item xs={12} key={i}>
              <Grid container spacing={1}>
                {row.map((cell, j) => (
                  <Grid item xs={4} key={j}>
                    {renderCell(board, boardRow, boardCol, i, j)}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Paper>
    );
  };

  const handleUndo = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const currentGameState = history[history.length - 1];
  const currentPlayer = currentGameState.currentPlayer;
  const selectedBoard = currentGameState.selectedBoard;
  const gameWinner = currentGameState.gameWinner;

  return (
    <Box sx={{ width: '100%', maxWidth: '80%', mx: 'auto', aspectRatio: 1, boxSizing: 'border-box' }}>
      <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ color: '#fff' }}>
        Ultimate Tic Tac Toe
      </Typography>

      {gameWinner ? (
        <Alert severity="success" sx={{ mb: 2 }}>
          <AlertTitle>Winner</AlertTitle>
          Player {gameWinner} wins the game!
        </Alert>
      ) : null}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%', height: '100%' }}>
        <Typography variant="h5" component="h2" align="center" sx={{ color: '#fff' }}>
          Player {currentPlayer}'s turn
        </Typography>

        {selectedBoard !== null && (
          <Typography variant="body1" align="center" sx={{ color: '#fff', mb: 2 }}>
            Next player must play in the highlighted board
          </Typography>
        )}

        <Grid container spacing={2} sx={{ flex: 1 }}>
          {history[history.length - 1].boards.map((boardRow, i) => (
            <Grid item xs={4} key={i}>
              <Grid container spacing={1}>
                {boardRow.map((board, j) => (
                  <Grid item xs={12} key={j}>
                    {renderBoard(board, i, j)}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleUndo}
            disabled={history.length <= 1}
            sx={{
              '&.enabled': {
                opacity: 1
              },
              '&.disabled': {
                opacity: 0.5
              }
            }}
          >
            Undo Last Move
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => {
              setHistory([{
                boards: Array(3).fill(null).map(() => 
                  Array(3).fill(null).map(() => ({
                    cells: Array(3).fill(null).map(() => Array(3).fill(null).map(() => ({
                      value: null,
                      won: false
                    }))) as any[][],
                    winner: null
                  }))
                ),
                currentPlayer: 'X',
                selectedBoard: null,
                gameWinner: null
              }]);
            }}
          >
            New Game
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Game;

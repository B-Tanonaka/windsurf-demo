import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle
} from '@mui/material';

const CatFact = () => {
  const [fact, setFact] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchCatFact = async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch('http://localhost:3001/api/cat-fact');
      if (!response.ok) {
        throw new Error('Failed to fetch cat fact');
      }
      const data = await response.json();
      setFact(data.fact);
    } catch (err) {
      console.error('Error fetching cat fact:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCatFact();
  }, []);

  return (
    <Box sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, background: 'rgba(255, 255, 255, 0.95)' }}>
        <Typography variant="h5" gutterBottom align="center">
          Cat Fact
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mt: 2 }}>
            <AlertTitle>Error</AlertTitle>
            Failed to fetch cat fact. Try again later.
          </Alert>
        ) : (
          <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
            {fact}
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default CatFact;

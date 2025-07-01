import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  AlertTitle,
  Button,
  IconButton,
  Card,
  CardContent,
  CardMedia,
  CardActions
} from '@mui/material';
import { Refresh, Share, Favorite } from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const CatFactCard = styled(Card)(({ theme }) => ({
  maxWidth: 400,
  margin: '1rem auto',
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(10px)',
  transition: 'transform 0.2s ease',
  '&:hover': {
    transform: 'translateY(-5px)',
  }
}));

const CatFact = ({ fact }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (fact === '') {
      setLoading(true);
      fetch('https://catfact.ninja/fact')
        .then(response => response.json())
        .then(data => {
          setLoading(false);
          setError(false);
          // Update the parent component with the new fact
          if (typeof window !== 'undefined' && window.parent && window.parent.setCatFact) {
            window.parent.setCatFact(data.fact);
          }
        })
        .catch(error => {
          console.error('Error fetching cat fact:', error);
          setLoading(false);
          setError(true);
          // Update the parent component with error message
          if (typeof window !== 'undefined' && window.parent && window.parent.setCatFact) {
            window.parent.setCatFact('Failed to load cat fact');
          }
        });
    }
  }, [fact]);

  return (
    <div style={{
      maxWidth: '400px',
      width: '100%',
      margin: '0 auto',
      background: 'white',
      borderRadius: '8px',
      padding: '1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      marginTop: '2rem'
    }}>
      {loading ? (
        <div style={{
          textAlign: 'center',
          padding: '1rem'
        }}>
          Loading...
        </div>
      ) : error ? (
        <div style={{
          color: 'red',
          textAlign: 'center',
          padding: '1rem'
        }}>
          Failed to load cat fact
        </div>
      ) : (
        <div style={{
          fontSize: '1rem',
          lineHeight: '1.6',
          padding: '1rem'
        }}>
          {fact || 'No cat fact available'}
        </div>
      )}
    </div>
  );
};

export default CatFact;

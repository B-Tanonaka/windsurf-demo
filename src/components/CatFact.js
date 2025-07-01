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
      // Call the Cat Facts API directly
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
      maxWidth: '600px',
      margin: '0 auto',
      marginTop: 'rem'
    }}>
      {loading ? (
        <div style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '1.1rem'
        }}>
          Loading...
        </div>
      ) : error ? (
        <div style={{
          textAlign: 'center',
          color: '#ff4081',
          fontSize: '1.1rem'
        }}>
          Failed to load cat fact
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          color: 'white',
          fontSize: '1.1rem',
          lineHeight: '1.6'
        }}>
          {fact || 'No cat fact available'}
        </div>
      )}
    </div>
  );
};

export default CatFact;

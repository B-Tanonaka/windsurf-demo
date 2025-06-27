import React, { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  CircularProgress,
  Typography,
  styled,
  createTheme,
  ThemeProvider
} from '@mui/material';

const theme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontWeight: 500,
      fontSize: '2.5rem',
      letterSpacing: '-0.015625em'
    },
    body1: {
      fontWeight: 400,
      fontSize: '1rem',
      lineHeight: 1.5
    },
    caption: {
      fontWeight: 400,
      fontSize: '0.75rem',
      lineHeight: 1.5
    }
  },
  palette: {
    mode: 'dark',
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0'
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e'
    },
    text: {
      primary: '#ffffff',
      secondary: '#e0e0e0'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '25px',
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          color: '#ffffff',
          fontWeight: 500,
          textTransform: 'none',
          '&:hover': {
            background: 'linear-gradient(135deg, #1565c0 0%, #1976d2 100%)',
          },
          '&:disabled': {
            opacity: 0.7,
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#2d2d2d',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.16)',
          '&:hover': {
            boxShadow: '0 8px 12px rgba(0, 0, 0, 0.24)'
          }
        }
      }
    }
  }
});

const CatContainer = styled(Card)({
  width: '25vw',
  height: '25vw',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: '1rem',
  textAlign: 'center',
  backgroundColor: '#4A235A',
  color: '#ffffff',
  overflow: 'hidden'
});

const CatMedia = styled(CardMedia)({
  width: '100%',
  height: '70%',
  objectFit: 'cover',
  borderRadius: '4px',
  marginBottom: '0.5rem',
});

const CatFact = () => {
  const [fact, setFact] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState('');

  const fetchCatFact = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/cat-fact');
      setFact(response.data.fact);
      setImageUrl(response.data.imageUrl);
      setSource(response.data.source);
    } catch (error) {
      console.error('Error fetching cat fact:', error);
      setFact('Failed to fetch cat fact. Please try again.');
      setImageUrl('');
      setSource('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 0,
        m: 0,
        p: 0
      }}>
        <CatContainer>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              {imageUrl && (
                <Box sx={{
                  width: '100%',
                  height: '75%',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  p: 0
                }}>
                  <img 
                    src={imageUrl} 
                    alt="Cat image" 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
              )}
              <Box sx={{ 
                width: '95%',
                height: '20%',
                mx: 'auto',
                backgroundColor: '#7B2CBF',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Typography 
                  variant="body1" 
                  sx={{
                    fontSize: '1rem',
                    lineHeight: 1.5,
                    textAlign: 'center'
                  }}
                >
                  {fact || 'Click the button to get a random cat fact!'}
                </Typography>
              </Box>
              {source && (
                <Typography 
                  variant="caption" 
                  sx={{
                    color: '#fff',
                    textAlign: 'center'
                  }}
                >
                  Source: {source || 'Unknown'}
                </Typography>
              )}
            </>
          )}
        </CatContainer>
      </Box>
      <Button
        variant="contained"
        onClick={fetchCatFact}
        sx={{
          width: '200px',
          height: '50px',
          fontSize: '1rem',
          textTransform: 'none',
          backgroundColor: '#7B2CBF',
          color: '#fff',
          fontWeight: 'bold',
          borderRadius: '20px',
          '&:hover': {
            backgroundColor: '#6A2DAA'
          }
        }}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Tell me about cats'}
      </Button>
    </ThemeProvider>
  );
};

export default CatFact;

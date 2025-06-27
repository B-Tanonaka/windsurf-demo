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
  transition: 'transform 0.2s',
  backgroundColor: '#7B2CBF',
  color: '#ffffff',
  '&:hover': {
    transform: 'scale(1.02)',
  }
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
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
        <CatContainer>
          <CardContent>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column',
              position: 'relative',
              height: '100%',
              padding: '0.5rem'
            }}>
              {loading ? (
                <CircularProgress />
              ) : (
                <>
                  {imageUrl && (
                    <CardMedia 
                      component="img" 
                      height="80%" 
                      image={imageUrl} 
                      alt="Cat image" 
                      sx={{ 
                        borderRadius: '8px',
                        mt: 1,
                        mb: 1
                      }}
                    />
                  )}
                  <Box sx={{ 
                    width: '100%', 
                    px: 1,
                    mb: 1
                  }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        fontSize: '1.1rem',
                        lineHeight: 1.6,
                        fontWeight: 300,
                        textAlign: 'center'
                      }}
                    >
                      {fact || 'Click the button to get a random cat fact!'}
                    </Typography>
                  </Box>
                  <Box 
                    sx={{ 
                      width: '100%',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '1rem'
                    }}
                  >
                    {source && (
                      <Typography 
                        variant="caption" 
                        sx={{
                          fontSize: '0.75rem',
                          textAlign: 'center'
                        }}
                      >
                        Source: {source || 'Unknown'}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
            </Box>
          </CardContent>
        </CatContainer>
        <Button
          variant="contained"
          onClick={fetchCatFact}
          sx={{
            width: '200px',
            height: '50px',
            fontSize: '1rem',
            textTransform: 'none'
          }}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Tell me about cats'}
        </Button>
      </Box>
    </ThemeProvider>
  );
};

export default CatFact;

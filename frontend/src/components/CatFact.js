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
} from '@mui/material';

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
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Random Cat Fact
            </Typography>
            
            {loading ? (
              <CircularProgress />
            ) : (
              <>
                {imageUrl && (
                  <CardMedia
                    component="img"
                    height="300"
                    image={imageUrl}
                    alt="Random cat"
                    sx={{ mb: 2 }}
                  />
                )}
                <Typography variant="body1" component="p" align="center">
                  {fact || 'Click the button to get a random cat fact!'}
                </Typography>
                {source && (
                  <Typography variant="caption" color="textSecondary" align="center" sx={{ mt: 1 }}>
                    Source: {source || 'Unknown'}
                  </Typography>
                )}
              </>
            )}

            <Button
              variant="contained"
              onClick={fetchCatFact}
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Get New Fact'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CatFact;

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));
app.use(express.json());

// Get random cat fact with image
app.get('/api/cat-fact', async (req, res) => {
  try {
    console.log('Fetching cat fact from TheCatAPI...');
    
    // Get cat fact
    const catFactsResponse = await axios.get('https://catfact.ninja/fact');
    const catFact = catFactsResponse.data.fact;
    
    // Get cat image
    const catImageResponse = await axios.get('https://api.thecatapi.com/v1/images/search');
    const imageUrl = catImageResponse.data[0].url;
    
    res.json({
      fact: catFact,
      imageUrl: imageUrl,
      source: 'TheCatAPI'
    });
  } catch (error) {
    console.error('Error fetching cat fact:', error);
    res.status(500).json({
      error: 'Failed to fetch cat fact'
    });
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

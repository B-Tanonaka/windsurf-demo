const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Cat fact endpoint
app.get('/api/cat-fact', async (req, res) => {
  try {
    const catFactsResponse = await axios.get('https://catfact.ninja/fact');
    const catFact = catFactsResponse.data.fact;
    
    res.json({
      fact: catFact,
      source: 'TheCatAPI'
    });
  } catch (error) {
    console.error('Error fetching cat fact:', error);
    res.status(500).json({ error: 'Failed to fetch cat fact' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

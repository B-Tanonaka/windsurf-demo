const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const OpenAI = require('openai');

// Load environment variables
dotenv.config();

const app = express();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    console.log('Attempting to fetch cat fact...');
    
    // First try OpenAI
    let catFact = '';
    let factSource = 'OpenAI';
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{
          role: "system",
          content: "Generate a fun and interesting fact about cats. Keep it short and engaging."
        }]
      });
      catFact = completion.choices[0].message.content.trim();
      console.log('Successfully got completion from OpenAI');
    } catch (openAIError) {
      console.log('OpenAI failed, trying alternative...');
      // If OpenAI fails, try TheCatAPI for facts
      const catFactsResponse = await axios.get('https://catfact.ninja/fact');
      catFact = catFactsResponse.data.fact;
      factSource = 'TheCatAPI';
      console.log('Successfully got fact from alternative source');
    }

    // Get random cat image from Cat API
    const catImageResponse = await axios.get('https://api.thecatapi.com/v1/images/search');
    const catImageUrl = catImageResponse.data[0].url;

    console.log('Successfully got cat image');
    res.json({
      fact: catFact,
      imageUrl: catImageUrl,
      source: factSource
    });
  } catch (error) {
    console.error('Error details:', {
      message: error.message,
      type: error.type,
      code: error.code
    });

    // If OpenAI fails, try to get a fact from alternative source
    if (error.code === 'insufficient_quota') {
      try {
        console.log('Attempting to get fact from alternative source...');
        const catFactsResponse = await axios.get('https://catfact.ninja/fact');
        const catImageUrl = 'https://placekitten.com/400/300'; // Fallback image if API fails
        
        res.json({
          fact: catFactsResponse.data.fact,
          imageUrl: catImageUrl,
          source: 'TheCatAPI'
        });
      } catch (alternativeError) {
        console.error('Failed to get fact from alternative source:', alternativeError);
        res.status(500).json({ 
          error: 'Failed to fetch cat fact from all available sources. Please check the server logs for details.' 
        });
      }
    } else {
      res.status(500).json({ 
        error: 'Failed to generate cat fact. Please check the server logs for details.' 
      });
    }
  }
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const axios = require('axios');

module.exports = async (req, res) => {
  try {
    const catFactsResponse = await axios.get('https://catfact.ninja/fact');
    const catFact = catFactsResponse.data.fact;
    
    res.status(200).json({
      fact: catFact,
      source: 'TheCatAPI'
    });
  } catch (error) {
    console.error('Error fetching cat fact:', error);
    res.status(500).json({ error: 'Failed to fetch cat fact' });
  }
};

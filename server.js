const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fetch = require('node-fetch'); // Import node-fetch for proxy requests
const gamesRoutes = require('./routes/games');
const authRoutes = require('./routes/auth'); 
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB', error));

app.get('/ping', (req, res) => {
  res.status(200).json({ message: 'Pong' });
});

app.use('/auth', authRoutes); // Use auth routes

app.use('/games', (req, res, next) => {
  const apiKey = req.headers['authorization'];
  if (apiKey === `Bearer ${process.env.API_KEY}`) {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden: Invalid API key' });
  }
}, gamesRoutes);

// Proxy route to fetch external games API
app.get('/proxy/games', async (req, res) => {
  try {
    const response = await fetch('https://www.htmlgames.com/rss/games.php?json');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch games data' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

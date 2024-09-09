const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import CORS
const gamesRoutes = require('./routes/games');
require('dotenv').config(); // Load environment variables from .env

const app = express();
app.use(bodyParser.json());

// Enable CORS
app.use(cors()); // Use CORS to allow requests from different origins

// Connect to MongoDB using the connection string from the environment variable
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(error => console.error('Could not connect to MongoDB', error));

// Backend middleware to check API key
app.use('/games', (req, res, next) => {
    console.log('Received headers:', req.headers);
    const apiKey = req.headers['authorization'];
    if (apiKey === `Bearer ${process.env.API_KEY}`) {
      next(); // API key is valid, proceed to the routes
    } else {
      res.status(403).json({ message: 'Forbidden: Invalid API key' });
    }
  }, gamesRoutes);


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

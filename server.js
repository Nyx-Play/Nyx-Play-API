const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

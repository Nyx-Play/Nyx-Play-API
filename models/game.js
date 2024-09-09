const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  title: { type: String, required: true },
  description: String,
  thumbnail: String,
  url: String,
  category: String,
});

const Game = mongoose.model('Game', gameSchema);

module.exports = Game;

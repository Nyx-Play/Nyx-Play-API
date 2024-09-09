const express = require('express');
const router = express.Router();
const Game = require('../models/ggame');

// Create a new game
router.post('/', async (req, res) => {
  const { id, title, description, thumbnail, url, category } = req.body;
  try {
    const newGame = new Game({ id, title, description, thumbnail, url, category });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all games
router.get('/', async (req, res) => {
  try {
    const games = await Game.find();
    res.status(200).json(games);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get a game by ID
router.get('/:id', async (req, res) => {
  try {
    const game = await Game.findOne({ id: req.params.id });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a game by ID
router.put('/:id', async (req, res) => {
  const { title, description, thumbnail, url, category } = req.body;
  try {
    const game = await Game.findOneAndUpdate(
      { id: req.params.id },
      { title, description, thumbnail, url, category },
      { new: true }
    );
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json(game);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a game by ID
router.delete('/:id', async (req, res) => {
  try {
    const game = await Game.findOneAndDelete({ id: req.params.id });
    if (!game) return res.status(404).json({ error: 'Game not found' });
    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

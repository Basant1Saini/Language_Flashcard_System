const express = require('express');
const router = express.Router();
const { getDecks, getDeck, createDeck, updateDeck, deleteDeck } = require('../controllers/deckController');
const auth = require('../middleware/auth');
const { deckValidation, handleValidationErrors } = require('../middleware/validation');

// @route   GET /api/decks
router.get('/', auth, getDecks);

// @route   GET /api/decks/:id
router.get('/:id', auth, getDeck);

// @route   POST /api/decks
router.post('/', auth, deckValidation, handleValidationErrors, createDeck);

// @route   PUT /api/decks/:id
router.put('/:id', auth, deckValidation, handleValidationErrors, updateDeck);

// @route   DELETE /api/decks/:id
router.delete('/:id', auth, deleteDeck);

module.exports = router;
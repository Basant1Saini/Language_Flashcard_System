const express = require('express');
const router = express.Router();
const { getFlashcards, createFlashcard, updateFlashcard, deleteFlashcard, reviewFlashcard } = require('../controllers/flashcardController');
const auth = require('../middleware/auth');
const { flashcardValidation, handleValidationErrors } = require('../middleware/validation');

// @route   GET /api/flashcards/:deckId
router.get('/:deckId', auth, getFlashcards);

// @route   POST /api/flashcards
router.post('/', auth, flashcardValidation, handleValidationErrors, createFlashcard);

// @route   PUT /api/flashcards/:id
router.put('/:id', auth, flashcardValidation, handleValidationErrors, updateFlashcard);

// @route   DELETE /api/flashcards/:id
router.delete('/:id', auth, deleteFlashcard);

// @route   POST /api/flashcards/:id/review
router.post('/:id/review', auth, reviewFlashcard);

module.exports = router;
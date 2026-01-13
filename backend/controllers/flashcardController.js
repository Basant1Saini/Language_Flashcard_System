const Flashcard = require('../models/Flashcard');
const Deck = require('../models/Deck');
const Progress = require('../models/Progress');

// @desc    Get flashcards by deck
// @route   GET /api/flashcards/:deckId
// @access  Private
const getFlashcards = async (req, res) => {
  try {
    const { deckId } = req.params;
    const { page = 1, limit = 20, dueOnly = false } = req.query;

    // Verify deck access
    const deck = await Deck.findById(deckId);
    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
    }

    if (deck.creator.toString() !== req.user.id && !deck.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    let query = { deck: deckId };
    
    if (dueOnly === 'true') {
      query['spacedRepetition.nextReview'] = { $lte: new Date() };
    }

    const flashcards = await Flashcard.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Flashcard.countDocuments(query);

    res.json({
      success: true,
      data: flashcards,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new flashcard
// @route   POST /api/flashcards
// @access  Private
const createFlashcard = async (req, res) => {
  try {
    const { deck: deckId } = req.body;

    // Verify deck ownership
    const deck = await Deck.findById(deckId);
    if (!deck || deck.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const flashcard = await Flashcard.create(req.body);
    
    // Update deck card count
    await deck.updateCardCount();

    res.status(201).json({
      success: true,
      data: flashcard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update flashcard
// @route   PUT /api/flashcards/:id
// @access  Private
const updateFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id).populate('deck');
    
    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }

    // Check ownership through deck
    if (flashcard.deck.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: updatedFlashcard
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete flashcard
// @route   DELETE /api/flashcards/:id
// @access  Private
const deleteFlashcard = async (req, res) => {
  try {
    const flashcard = await Flashcard.findById(req.params.id).populate('deck');
    
    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }

    // Check ownership through deck
    if (flashcard.deck.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await flashcard.deleteOne();
    
    // Update deck card count
    await flashcard.deck.updateCardCount();

    res.json({
      success: true,
      message: 'Flashcard deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Submit flashcard review
// @route   POST /api/flashcards/:id/review
// @access  Private
const reviewFlashcard = async (req, res) => {
  try {
    const { quality, responseTime, wasCorrect } = req.body;
    const flashcard = await Flashcard.findById(req.params.id);
    
    if (!flashcard) {
      return res.status(404).json({
        success: false,
        message: 'Flashcard not found'
      });
    }

    // Update flashcard stats
    flashcard.stats.timesReviewed++;
    flashcard.stats.lastReviewed = new Date();
    
    if (wasCorrect) {
      flashcard.stats.correctCount++;
    } else {
      flashcard.stats.incorrectCount++;
    }

    if (responseTime) {
      const totalTime = flashcard.stats.averageResponseTime * (flashcard.stats.timesReviewed - 1) + responseTime;
      flashcard.stats.averageResponseTime = totalTime / flashcard.stats.timesReviewed;
    }

    // Update spaced repetition
    await flashcard.updateSpacedRepetition(quality);

    // Update or create progress record
    let progress = await Progress.findOne({
      user: req.user.id,
      flashcard: flashcard._id
    });

    if (!progress) {
      progress = new Progress({
        user: req.user.id,
        deck: flashcard.deck,
        flashcard: flashcard._id
      });
    }

    progress.reviewHistory.push({
      quality,
      responseTime,
      wasCorrect
    });

    progress.totalReviews++;
    if (wasCorrect) progress.correctReviews++;
    progress.lastReviewed = new Date();
    progress.nextReview = flashcard.spacedRepetition.nextReview;

    await progress.calculateMasteryScore();

    res.json({
      success: true,
      data: {
        flashcard,
        progress
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getFlashcards,
  createFlashcard,
  updateFlashcard,
  deleteFlashcard,
  reviewFlashcard
};
const Deck = require('../models/Deck');
const Flashcard = require('../models/Flashcard');

// @desc    Get all user decks
// @route   GET /api/decks
// @access  Private
const getDecks = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, category, difficulty } = req.query;
    
    const query = { creator: req.user.id };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;

    const decks = await Deck.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('creator', 'username');

    const total = await Deck.countDocuments(query);

    res.json({
      success: true,
      data: decks,
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

// @desc    Get single deck
// @route   GET /api/decks/:id
// @access  Private
const getDeck = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id).populate('creator', 'username');
    
    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
    }

    // Check if user owns the deck or if it's public
    if (deck.creator._id.toString() !== req.user.id && !deck.isPublic) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: deck
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new deck
// @route   POST /api/decks
// @access  Private
const createDeck = async (req, res) => {
  try {
    const deckData = {
      ...req.body,
      creator: req.user.id
    };

    const deck = await Deck.create(deckData);
    
    res.status(201).json({
      success: true,
      data: deck
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update deck
// @route   PUT /api/decks/:id
// @access  Private
const updateDeck = async (req, res) => {
  try {
    let deck = await Deck.findById(req.params.id);
    
    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
    }

    // Check ownership
    if (deck.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    deck = await Deck.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      data: deck
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete deck
// @route   DELETE /api/decks/:id
// @access  Private
const deleteDeck = async (req, res) => {
  try {
    const deck = await Deck.findById(req.params.id);
    
    if (!deck) {
      return res.status(404).json({
        success: false,
        message: 'Deck not found'
      });
    }

    // Check ownership
    if (deck.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Delete all flashcards in the deck
    await Flashcard.deleteMany({ deck: req.params.id });
    
    // Delete the deck
    await deck.deleteOne();

    res.json({
      success: true,
      message: 'Deck deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getDecks,
  getDeck,
  createDeck,
  updateDeck,
  deleteDeck
};
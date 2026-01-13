const mongoose = require('mongoose');

const deckSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Deck title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  language: {
    from: { type: String, required: true },
    to: { type: String, required: true }
  },
  category: {
    type: String,
    enum: ['vocabulary', 'phrases', 'grammar', 'pronunciation', 'culture', 'other'],
    default: 'vocabulary'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  stats: {
    totalCards: { type: Number, default: 0 },
    studyCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    lastStudied: Date
  },
  settings: {
    shuffleCards: { type: Boolean, default: true },
    showHints: { type: Boolean, default: true },
    autoPlay: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

// Update totalCards when flashcards are added/removed
deckSchema.methods.updateCardCount = async function() {
  const Flashcard = mongoose.model('Flashcard');
  this.stats.totalCards = await Flashcard.countDocuments({ deck: this._id });
  return this.save();
};

module.exports = mongoose.model('Deck', deckSchema);
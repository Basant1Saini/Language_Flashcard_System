const mongoose = require('mongoose');

const flashcardSchema = new mongoose.Schema({
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  front: {
    text: { type: String, required: true },
    audio: String,
    image: String,
    pronunciation: String
  },
  back: {
    text: { type: String, required: true },
    audio: String,
    image: String,
    explanation: String,
    examples: [String]
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  hints: [String],
  stats: {
    timesReviewed: { type: Number, default: 0 },
    correctCount: { type: Number, default: 0 },
    incorrectCount: { type: Number, default: 0 },
    lastReviewed: Date,
    averageResponseTime: { type: Number, default: 0 }
  },
  spacedRepetition: {
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 1 },
    repetitions: { type: Number, default: 0 },
    nextReview: { type: Date, default: Date.now }
  }
}, {
  timestamps: true
});

// Calculate next review date based on SM-2 algorithm
flashcardSchema.methods.updateSpacedRepetition = function(quality) {
  const sr = this.spacedRepetition;
  
  if (quality >= 3) {
    if (sr.repetitions === 0) {
      sr.interval = 1;
    } else if (sr.repetitions === 1) {
      sr.interval = 6;
    } else {
      sr.interval = Math.round(sr.interval * sr.easeFactor);
    }
    sr.repetitions++;
  } else {
    sr.repetitions = 0;
    sr.interval = 1;
  }
  
  sr.easeFactor = Math.max(1.3, sr.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  sr.nextReview = new Date(Date.now() + sr.interval * 24 * 60 * 60 * 1000);
  
  return this.save();
};

module.exports = mongoose.model('Flashcard', flashcardSchema);
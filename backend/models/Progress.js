const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  deck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  flashcard: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flashcard',
    required: true
  },
  reviewHistory: [{
    date: { type: Date, default: Date.now },
    quality: { type: Number, min: 0, max: 5 },
    responseTime: Number,
    wasCorrect: Boolean
  }],
  currentLevel: {
    type: String,
    enum: ['new', 'learning', 'review', 'mastered'],
    default: 'new'
  },
  masteryScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  lastReviewed: Date,
  nextReview: Date,
  totalReviews: { type: Number, default: 0 },
  correctReviews: { type: Number, default: 0 }
}, {
  timestamps: true
});

// Calculate mastery score based on recent performance
progressSchema.methods.calculateMasteryScore = function() {
  const recentReviews = this.reviewHistory.slice(-10);
  if (recentReviews.length === 0) return 0;
  
  const correctCount = recentReviews.filter(review => review.wasCorrect).length;
  const score = (correctCount / recentReviews.length) * 100;
  
  this.masteryScore = Math.round(score);
  
  // Update level based on mastery score
  if (this.masteryScore >= 90) this.currentLevel = 'mastered';
  else if (this.masteryScore >= 70) this.currentLevel = 'review';
  else if (this.totalReviews > 0) this.currentLevel = 'learning';
  else this.currentLevel = 'new';
  
  return this.save();
};

module.exports = mongoose.model('Progress', progressSchema);
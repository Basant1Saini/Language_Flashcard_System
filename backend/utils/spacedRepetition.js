// SM-2 Spaced Repetition Algorithm Implementation

class SpacedRepetition {
  constructor() {
    this.minEaseFactor = 1.3;
    this.defaultEaseFactor = 2.5;
  }

  // Calculate next review interval based on SM-2 algorithm
  calculateInterval(quality, easeFactor, interval, repetitions) {
    let newEaseFactor = easeFactor;
    let newInterval = interval;
    let newRepetitions = repetitions;

    // Update ease factor based on quality (0-5 scale)
    newEaseFactor = Math.max(
      this.minEaseFactor,
      easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    );

    if (quality >= 3) {
      // Correct response
      if (repetitions === 0) {
        newInterval = 1;
      } else if (repetitions === 1) {
        newInterval = 6;
      } else {
        newInterval = Math.round(interval * newEaseFactor);
      }
      newRepetitions = repetitions + 1;
    } else {
      // Incorrect response - reset
      newRepetitions = 0;
      newInterval = 1;
    }

    return {
      easeFactor: newEaseFactor,
      interval: newInterval,
      repetitions: newRepetitions,
      nextReview: this.calculateNextReviewDate(newInterval)
    };
  }

  // Calculate the next review date
  calculateNextReviewDate(interval) {
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + interval);
    return nextReview;
  }

  // Get cards due for review
  getDueCards(cards) {
    const now = new Date();
    return cards.filter(card => 
      !card.spacedRepetition.nextReview || 
      card.spacedRepetition.nextReview <= now
    );
  }

  // Quality mapping for user responses
  getQualityScore(response) {
    const qualityMap = {
      'again': 0,
      'hard': 2,
      'good': 3,
      'easy': 5
    };
    return qualityMap[response] || 3;
  }

  // Get recommended study session size
  getStudySessionSize(totalCards, userLevel = 'beginner') {
    const sessionSizes = {
      beginner: Math.min(10, totalCards),
      intermediate: Math.min(20, totalCards),
      advanced: Math.min(30, totalCards)
    };
    return sessionSizes[userLevel] || sessionSizes.beginner;
  }

  // Calculate retention rate
  calculateRetentionRate(reviewHistory) {
    if (!reviewHistory || reviewHistory.length === 0) return 0;
    
    const correctReviews = reviewHistory.filter(review => review.wasCorrect).length;
    return Math.round((correctReviews / reviewHistory.length) * 100);
  }
}

module.exports = new SpacedRepetition();
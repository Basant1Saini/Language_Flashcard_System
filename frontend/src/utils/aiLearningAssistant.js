// AI-powered learning suggestions utility
class AILearningAssistant {
  constructor() {
    this.difficultyWeights = {
      easy: 0.2,
      medium: 0.5,
      hard: 0.8
    }
  }

  // Analyze user performance and suggest optimal study patterns
  generateStudySuggestions(userStats, recentPerformance) {
    const suggestions = []

    // Analyze accuracy rate
    const accuracyRate = userStats.correctReviews / userStats.totalReviews
    
    if (accuracyRate < 0.6) {
      suggestions.push({
        type: 'difficulty',
        message: 'Consider focusing on easier cards to build confidence',
        action: 'filter_easy'
      })
    } else if (accuracyRate > 0.85) {
      suggestions.push({
        type: 'challenge',
        message: 'You\'re doing great! Try adding more challenging cards',
        action: 'add_difficult'
      })
    }

    // Analyze study frequency
    const daysSinceLastStudy = this.getDaysSinceLastStudy(userStats.lastStudyDate)
    if (daysSinceLastStudy > 2) {
      suggestions.push({
        type: 'frequency',
        message: 'Regular practice improves retention. Try studying daily!',
        action: 'increase_frequency'
      })
    }

    // Analyze streak patterns
    if (userStats.currentStreak > 7) {
      suggestions.push({
        type: 'motivation',
        message: `Amazing ${userStats.currentStreak}-day streak! Keep it up!`,
        action: 'celebrate'
      })
    }

    return suggestions
  }

  // Predict optimal review timing based on performance
  predictOptimalReviewTime(cardHistory) {
    const recentPerformance = cardHistory.slice(-5)
    const avgAccuracy = recentPerformance.reduce((sum, review) => 
      sum + (review.wasCorrect ? 1 : 0), 0) / recentPerformance.length

    // Adjust review interval based on performance
    let multiplier = 1
    if (avgAccuracy > 0.8) multiplier = 1.5
    else if (avgAccuracy < 0.5) multiplier = 0.7

    return multiplier
  }

  // Suggest personalized learning goals
  suggestLearningGoals(userLevel, currentStats) {
    const goals = []

    switch (userLevel) {
      case 'beginner':
        goals.push('Master 50 basic vocabulary words')
        goals.push('Maintain a 3-day study streak')
        break
      case 'intermediate':
        goals.push('Achieve 80% accuracy on 100 cards')
        goals.push('Learn 20 new phrases this week')
        break
      case 'advanced':
        goals.push('Master complex grammar patterns')
        goals.push('Maintain 90% accuracy on difficult cards')
        break
    }

    return goals
  }

  // Analyze weak areas and suggest focus topics
  identifyWeakAreas(cardPerformance) {
    const categoryStats = {}
    
    cardPerformance.forEach(card => {
      const category = card.category || 'general'
      if (!categoryStats[category]) {
        categoryStats[category] = { correct: 0, total: 0 }
      }
      categoryStats[category].total++
      if (card.lastReviewCorrect) {
        categoryStats[category].correct++
      }
    })

    const weakAreas = Object.entries(categoryStats)
      .map(([category, stats]) => ({
        category,
        accuracy: stats.correct / stats.total,
        total: stats.total
      }))
      .filter(area => area.accuracy < 0.7 && area.total >= 5)
      .sort((a, b) => a.accuracy - b.accuracy)

    return weakAreas.slice(0, 3) // Top 3 weak areas
  }

  // Generate motivational messages based on progress
  generateMotivationalMessage(progress) {
    const messages = [
      "Every expert was once a beginner. Keep going!",
      "Consistency is key to language mastery!",
      "Your brain is building new neural pathways with each review!",
      "Small daily improvements lead to stunning results!",
      "You're closer to fluency with every card you master!"
    ]

    // Personalize based on recent performance
    if (progress.recentAccuracy > 0.8) {
      return "Excellent work! Your hard work is paying off! 🌟"
    } else if (progress.currentStreak > 0) {
      return `Great ${progress.currentStreak}-day streak! Consistency wins! 🔥`
    }

    return messages[Math.floor(Math.random() * messages.length)]
  }

  // Helper method to calculate days since last study
  getDaysSinceLastStudy(lastStudyDate) {
    if (!lastStudyDate) return Infinity
    const now = new Date()
    const lastStudy = new Date(lastStudyDate)
    return Math.floor((now - lastStudy) / (1000 * 60 * 60 * 24))
  }
}

export default new AILearningAssistant()
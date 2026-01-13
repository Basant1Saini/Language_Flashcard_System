const User = require('../models/User');
const Progress = require('../models/Progress');
const Deck = require('../models/Deck');

// @desc    Get user progress
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const { deckId, timeframe = '7d' } = req.query;
    
    let query = { user: req.user.id };
    if (deckId) query.deck = deckId;

    const progress = await Progress.find(query)
      .populate('deck', 'title')
      .populate('flashcard', 'front.text back.text')
      .sort({ lastReviewed: -1 });

    res.json({
      success: true,
      data: progress
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get learning statistics
// @route   GET /api/progress/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user stats
    const user = await User.findById(userId);
    
    // Get deck count
    const deckCount = await Deck.countDocuments({ creator: userId });
    
    // Get progress stats
    const progressStats = await Progress.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalCards: { $sum: 1 },
          masteredCards: {
            $sum: { $cond: [{ $eq: ['$currentLevel', 'mastered'] }, 1, 0] }
          },
          averageMastery: { $avg: '$masteryScore' },
          totalReviews: { $sum: '$totalReviews' }
        }
      }
    ]);

    // Get recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = await Progress.aggregate([
      {
        $match: {
          user: userId,
          'reviewHistory.date': { $gte: thirtyDaysAgo }
        }
      },
      { $unwind: '$reviewHistory' },
      {
        $match: {
          'reviewHistory.date': { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$reviewHistory.date'
            }
          },
          reviewCount: { $sum: 1 },
          correctCount: {
            $sum: { $cond: ['$reviewHistory.wasCorrect', 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate streak
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateString = checkDate.toISOString().split('T')[0];
      
      const hasActivity = recentActivity.some(activity => activity._id === dateString);
      
      if (hasActivity) {
        if (i === 0 || tempStreak > 0) {
          tempStreak++;
          if (i === 0) currentStreak = tempStreak;
        }
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (i === 0) currentStreak = 0;
        tempStreak = 0;
      }
    }

    const stats = {
      user: {
        totalCardsStudied: user.stats.totalCardsStudied,
        currentStreak,
        longestStreak,
        lastStudyDate: user.stats.lastStudyDate
      },
      decks: {
        total: deckCount
      },
      cards: {
        total: progressStats[0]?.totalCards || 0,
        mastered: progressStats[0]?.masteredCards || 0,
        averageMastery: Math.round(progressStats[0]?.averageMastery || 0)
      },
      reviews: {
        total: progressStats[0]?.totalReviews || 0,
        recentActivity
      }
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProgress,
  getStats
};
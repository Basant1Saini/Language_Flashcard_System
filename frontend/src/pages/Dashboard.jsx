import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Plus, BookOpen, TrendingUp, Calendar } from 'lucide-react'
import { fetchDecks } from '../context/slices/deckSlice'
import { fetchStats } from '../context/slices/progressSlice'
import DeckCard from '../components/decks/DeckCard'
import CreateDeckModal from '../components/decks/CreateDeckModal'
import StatsCard from '../components/common/StatsCard'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { decks, loading } = useSelector(state => state.decks)
  const { stats } = useSelector(state => state.progress)
  const { user } = useSelector(state => state.auth)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    dispatch(fetchDecks())
    dispatch(fetchStats())
  }, [dispatch])

  const statsData = [
    {
      title: 'Total Decks',
      value: stats?.decks?.total || 0,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'primary'
    },
    {
      title: 'Cards Studied',
      value: stats?.user?.totalCardsStudied || 0,
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'success'
    },
    {
      title: 'Current Streak',
      value: `${stats?.user?.currentStreak || 0} days`,
      icon: <Calendar className="w-6 h-6" />,
      color: 'warning'
    },
    {
      title: 'Mastered Cards',
      value: stats?.cards?.mastered || 0,
      icon: <BookOpen className="w-6 h-6" />,
      color: 'error'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-primary-100">
          Ready to continue your language learning journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Decks Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Decks</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Deck
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : decks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(deck => (
            <DeckCard key={deck._id} deck={deck} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No decks yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Create your first deck to start learning!
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create Your First Deck
          </button>
        </div>
      )}

      {/* Create Deck Modal */}
      {showCreateModal && (
        <CreateDeckModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

export default Dashboard
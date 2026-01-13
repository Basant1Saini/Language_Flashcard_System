import { Link } from 'react-router-dom'
import { BookOpen, Play, Edit, Trash2 } from 'lucide-react'

const DeckCard = ({ deck }) => {
  const { _id, title, description, language, stats, difficulty, category } = deck

  const difficultyColors = {
    beginner: 'bg-success-100 text-success-800',
    intermediate: 'bg-warning-100 text-warning-800',
    advanced: 'bg-error-100 text-error-800'
  }

  return (
    <div className="card p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {description || 'No description'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs">
          {category}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <BookOpen className="w-4 h-4" />
            {stats?.totalCards || 0} cards
          </span>
          <span>{language?.from} → {language?.to}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <Link
          to={`/study/${_id}`}
          className="btn btn-primary flex-1 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" />
          Study
        </Link>
        <button className="btn btn-secondary p-2">
          <Edit className="w-4 h-4" />
        </button>
        <button className="btn btn-error p-2">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export default DeckCard
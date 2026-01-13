import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { User, Settings, TrendingUp, Award } from 'lucide-react'
import { updateProfile } from '../context/slices/authSlice'

const Profile = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { stats } = useSelector(state => state.progress)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    preferredLanguages: user?.profile?.preferredLanguages || [],
    learningGoals: user?.profile?.learningGoals || '',
    dailyGoal: user?.preferences?.dailyGoal || 20,
    notifications: user?.preferences?.notifications || true,
    theme: user?.preferences?.theme || 'light'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { firstName, lastName, preferredLanguages, learningGoals, dailyGoal, notifications, theme } = formData
    
    await dispatch(updateProfile({
      profile: { firstName, lastName, preferredLanguages, learningGoals },
      preferences: { dailyGoal, notifications, theme }
    }))
    
    setIsEditing(false)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="card p-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user?.username}</h1>
            <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500 mt-1">
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6 text-center">
          <TrendingUp className="w-8 h-8 text-primary-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">{stats?.user?.currentStreak || 0}</h3>
          <p className="text-gray-600 dark:text-gray-400">Day Streak</p>
        </div>
        <div className="card p-6 text-center">
          <Award className="w-8 h-8 text-success-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">{stats?.cards?.mastered || 0}</h3>
          <p className="text-gray-600 dark:text-gray-400">Cards Mastered</p>
        </div>
        <div className="card p-6 text-center">
          <User className="w-8 h-8 text-warning-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold">{stats?.user?.totalCardsStudied || 0}</h3>
          <p className="text-gray-600 dark:text-gray-400">Total Studied</p>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Profile Settings
          </h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="btn btn-primary"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                disabled={!isEditing}
                className="input"
                placeholder="Enter your first name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                disabled={!isEditing}
                className="input"
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Learning Goals</label>
            <textarea
              name="learningGoals"
              value={formData.learningGoals}
              onChange={handleChange}
              disabled={!isEditing}
              rows={3}
              className="input"
              placeholder="What are your language learning goals?"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Daily Goal (cards)</label>
              <input
                type="number"
                name="dailyGoal"
                value={formData.dailyGoal}
                onChange={handleChange}
                disabled={!isEditing}
                min="1"
                max="100"
                className="input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                disabled={!isEditing}
                className="input"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              disabled={!isEditing}
              className="mr-3"
            />
            <label className="text-sm font-medium">Enable notifications</label>
          </div>

          {isEditing && (
            <div className="flex gap-4">
              <button type="submit" className="btn btn-primary">
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
}

export default Profile
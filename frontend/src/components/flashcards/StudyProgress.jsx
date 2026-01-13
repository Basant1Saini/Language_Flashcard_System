const StudyProgress = ({ current, total }) => {
  const percentage = (current / total) * 100

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-0">
        {current} / {total}
      </span>
    </div>
  )
}

export default StudyProgress
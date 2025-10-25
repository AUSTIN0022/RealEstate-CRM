export const ProgressBar = ({ value, max = 100, showLabel = true }) => {
  const percentage = (value / max) * 100

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && <p className="text-xs text-gray-600 mt-1">{Math.round(percentage)}%</p>}
    </div>
  )
}

export const CircularProgress = ({ value, max = 100, size = 100 }) => {
  const percentage = (value / max) * 100
  const circumference = 2 * Math.PI * (size / 2 - 5)
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={size / 2 - 5} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 5}
          fill="none"
          stroke="#4f46e5"
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-300"
        />
      </svg>
      <p className="text-sm font-semibold text-gray-900 mt-2">{Math.round(percentage)}%</p>
    </div>
  )
}

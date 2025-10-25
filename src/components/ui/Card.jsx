export const Card = ({ children, className = "" }) => {
  return <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>{children}</div>
}

export const StatCard = ({ icon: Icon, label, value, trend, trendUp = true }) => {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <p className={`text-sm mt-2 ${trendUp ? "text-green-600" : "text-red-600"}`}>
              {trendUp ? "↑" : "↓"} {trend}
            </p>
          )}
        </div>
        {Icon && (
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Icon size={24} className="text-indigo-600" />
          </div>
        )}
      </div>
    </Card>
  )
}

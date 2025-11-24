// Card.jsx - Updated version with enhanced designs

export const Card = ({ children, className = "" }) => {
  return <div className={`bg-white rounded-xl shadow-md p-6 ${className}`}>{children}</div>
}

// Design 1: Enhanced StatCard with better mobile design
export const StatCard = ({ 
  label, 
  value, 
  trend, 
  trendDirection = 'neutral',
  className = "" 
}) => {
  const getTrendColor = () => {
    switch(trendDirection) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getTrendBgColor = () => {
    switch(trendDirection) {
      case 'positive': return 'bg-green-50';
      case 'negative': return 'bg-red-50';
      case 'neutral': return 'bg-gray-50';
      default: return 'bg-gray-50';
    }
  };

  const getTrendIcon = () => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return null;
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4 ${className}`}>
      <div className="flex flex-col">
        {/* Label - More compact */}
        <p className="text-xs sm:text-sm text-gray-500 font-medium mb-1 truncate">
          {label}
        </p>
        
        {/* Value - Larger and prominent */}
        <div className="flex items-baseline gap-2">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
            {value}
          </p>
          
          {/* Trend badge - Compact and inline */}
          {trend && (
            <span className={`text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full font-medium ${getTrendBgColor()} ${getTrendColor()}`}>
              {getTrendIcon()} {trend}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

// Design 3: Ultra Compact - Single Row with Dividers
export const CompactStatsRow = ({ stats = [] }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-3 sm:p-4">
      <div className="grid grid-cols-3 gap-3 sm:gap-4 divide-x divide-gray-200">
        {stats.map((stat, idx) => {
          const getTrendColor = () => {
            switch(stat.trendDirection) {
              case 'positive': return 'text-green-600';
              case 'negative': return 'text-red-600';
              case 'neutral': return 'text-gray-600';
              default: return 'text-gray-600';
            }
          };

          return (
            <div key={idx} className={idx !== 0 ? 'pl-3 sm:pl-4' : ''}>
              <p className="text-[10px] sm:text-xs text-gray-500 font-medium mb-1 truncate">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-xl sm:text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
                {stat.trend && (
                  <span className={`text-[10px] ${getTrendColor()}`}>
                    {stat.trend === 'up' ? '↑' : '↓'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Alternative compact horizontal design
export const CompactStatCard = ({ 
  label, 
  value, 
  trend, 
  trendDirection = 'neutral' 
}) => {
  const getBgColor = () => {
    switch(trendDirection) {
      case 'positive': return 'bg-green-50 border-green-200';
      case 'negative': return 'bg-red-50 border-red-200';
      case 'neutral': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTextColor = () => {
    switch(trendDirection) {
      case 'positive': return 'text-green-700';
      case 'negative': return 'text-red-700';
      case 'neutral': return 'text-blue-700';
      default: return 'text-gray-700';
    }
  };

  return (
    <div className={`rounded-lg border p-2 sm:p-3 ${getBgColor()}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] sm:text-xs text-gray-600 font-medium truncate mb-0.5">
            {label}
          </p>
          <p className={`text-xl sm:text-2xl font-bold ${getTextColor()}`}>
            {value}
          </p>
        </div>
        {trend && (
          <div className={`text-[10px] sm:text-xs font-medium ${getTextColor()}`}>
            {trend === 'up' ? '↑' : '↓'}
          </div>
        )}
      </div>
    </div>
  );
};

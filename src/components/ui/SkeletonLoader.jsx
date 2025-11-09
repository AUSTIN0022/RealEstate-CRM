export const SkeletonLoader = ({ type = "card", count = 1, className = "" }) => {
  const SkeletonTable = () => (
    <div className={`space-y-3 my-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200">
          <div className="h-12 w-12 bg-gray-200 rounded animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-24 animate-pulse" />
        </div>
      ))}
    </div>
  )

  const SkeletonCard = () => (
    <div className={`space-y-3 my-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )

  const SkeletonStatCard = () => (
    <div className={`my-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-8 w-8 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-8 bg-gray-200 rounded w-2/3 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
      ))}
    </div>
  )

  const SkeletonChart = () => (
    <div className={`space-y-4 my-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4 animate-pulse" />
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-24 flex-1 bg-gray-200 rounded animate-pulse" />
                <div className="h-6 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const SkeletonProfile = () => (
    <div className={`space-y-4 my-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex gap-4 mb-6">
            <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-5 bg-gray-200 rounded w-full animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )

  const SkeletonList = () => (
    <div className={`space-y-2 my-5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 flex items-center justify-between"
        >
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
          </div>
          <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
        </div>
      ))}
    </div>
  )

  const renderSkeleton = () => {
    switch (type) {
      case "table":
        return <SkeletonTable />
      case "card":
        return <SkeletonCard />
      case "stat":
        return <SkeletonStatCard />
      case "chart":
        return <SkeletonChart />
      case "profile":
        return <SkeletonProfile />
      case "list":
        return <SkeletonList />
      default:
        return <SkeletonCard />
    }
  }

  return renderSkeleton()
}

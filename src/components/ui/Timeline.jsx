export const Timeline = ({ events }) => {
  return (
    <div className="space-y-6">
      {events.map((event, idx) => (
        <div key={idx} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-indigo-600 rounded-full" />
            {idx < events.length - 1 && <div className="w-0.5 h-12 bg-gray-200 mt-2" />}
          </div>
          <div className="pb-1">
            <p className="text-sm font-semibold text-gray-900">{event.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-600">{event.timestamp}</p>
              {event.agent && (
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">by {event.agent}</span>
              )}
            </div>
            {event.description && <p className="text-sm text-gray-700 mt-2">{event.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}

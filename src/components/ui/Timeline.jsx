export const Timeline = ({ events }) => {
  const getTagColor = (tag) => {
    const colors = {
      "Follow-up Created": "bg-blue-100 text-blue-700 border-blue-200",
      "Client Called": "bg-green-100 text-green-700 border-green-200",
      "Site Visit Scheduled": "bg-purple-100 text-purple-700 border-purple-200",
      "Site Visit Completed": "bg-indigo-100 text-indigo-700 border-indigo-200",
      "Proposal Sent": "bg-orange-100 text-orange-700 border-orange-200",
      "Negotiation in Progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Deal Closed": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Payment Received": "bg-teal-100 text-teal-700 border-teal-200",
      "Follow-up Rescheduled": "bg-cyan-100 text-cyan-700 border-cyan-200",
      "Document Sent": "bg-pink-100 text-pink-700 border-pink-200",
      "Document Received": "bg-rose-100 text-rose-700 border-rose-200",
      "Query Resolved": "bg-lime-100 text-lime-700 border-lime-200",
      "Waiting for Client": "bg-gray-100 text-gray-700 border-gray-200",
      "Follow-up Completed": "bg-green-100 text-green-700 border-green-200",
    }
    return colors[tag] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  return (
    <div className="space-y-6">
      {events.map((event, idx) => (
        <div key={idx} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 bg-indigo-600 rounded-full" />
            {idx < events.length - 1 && <div className="w-0.5 h-24 bg-gray-200 " />}
          </div>
          <div className=" flex-1">
            <div
              className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold border ${getTagColor(event.title)}`}
            >
              {event.title}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-xs text-gray-600">{event.timestamp}</p>
              {event.agent && (
                <span className="text-xs  text-gray-700 px-2 py-1 rounded">by {event.agent}</span>
              )}
            </div>
            {event.description && (
              <p className="text-sm text-gray-700  bg-gray-50 p-2 rounded-xl">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
import { CheckCircle2, Circle } from "lucide-react"

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

  // 1. Group events by the 'groupDate' property
  const groupedEvents = events.reduce((groups, event) => {
    const date = event.groupDate || "Unknown Date"
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(event)
    return groups
  }, {})

  return (
    <div className="space-y-8">
      {Object.entries(groupedEvents).map(([date, dateEvents], groupIdx) => (
        <div key={groupIdx} className="relative">
          {/* Date Header */}
          <div className="sticky top-0 z-10 bg-white pb-4">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{date}</h3>
          </div>

          <div className="space-y-6 ml-2">
            {dateEvents.map((event, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {/* Vertical Line */}
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-indigo-600 rounded-full z-10 relative" />
                  {/* Draw line if it's not the very last item of the very last group */}
                  {(idx < dateEvents.length - 1 || groupIdx < Object.keys(groupedEvents).length - 1) && (
                    <div className="w-0.5 h-full bg-gray-200 absolute top-3" style={{ minHeight: "3rem" }} />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <divs
                    className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold border ${getTagColor(
                      event.title,
                    )}`}
                  >
                    {event.title}
                  </divs>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <p className="text-xs text-gray-500">{event.timestamp}</p>
                    {event.agent && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        by {event.agent}
                      </span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded-xl mt-2 border border-gray-100">
                      {event.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
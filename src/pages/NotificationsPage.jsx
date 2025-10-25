"use client"

import { useState, useMemo } from "react"
import { useData } from "../contexts/DataContext"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"
import { Button  } from "../components/ui/Button"
import { Trash2, Check } from "lucide-react"
import { getTimeAgo } from "../utils/helpers"

export default function NotificationsPage() {
  const { data, markNotificationRead } = useData()
  const { success } = useToast()
  const [filters, setFilters] = useState({ type: "", status: "" })

  const notifications = useMemo(() => {
    let result = data.notifications.filter((n) => !n.isDeleted)

    if (filters.type) {
      result = result.filter((n) => n.type === filters.type)
    }

    if (filters.status === "unread") {
      result = result.filter((n) => !n.isRead)
    } else if (filters.status === "read") {
      result = result.filter((n) => n.isRead)
    }

    return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [data.notifications, filters])

  const unreadCount = useMemo(() => {
    return data.notifications.filter((n) => !n.isRead && !n.isDeleted).length
  }, [data.notifications])

  const handleMarkRead = (notificationId) => {
    markNotificationRead(notificationId)
    success("Notification marked as read")
  }

  const handleMarkAllRead = () => {
    data.notifications.forEach((n) => {
      if (!n.isRead && !n.isDeleted) {
        markNotificationRead(n.notificationId)
      }
    })
    success("All notifications marked as read")
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "ENQUIRY_FOLLOWUP":
        return "bg-blue-100 text-blue-800"
      case "PAYMENT_FOLLOWUP":
        return "bg-yellow-100 text-yellow-800"
      case "DEMAND_LETTER":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "ENQUIRY_FOLLOWUP":
        return "Enquiry Follow-up"
      case "PAYMENT_FOLLOWUP":
        return "Payment Follow-up"
      case "DEMAND_LETTER":
        return "Demand Letter"
      default:
        return type
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600 mt-1">
              {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllRead} variant="secondary">
              Mark All Read
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option value="">All Types</option>
            <option value="ENQUIRY_FOLLOWUP">Enquiry Follow-up</option>
            <option value="PAYMENT_FOLLOWUP">Payment Follow-up</option>
            <option value="DEMAND_LETTER">Demand Letter</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Card
                key={notification.notificationId}
                className={`flex items-start justify-between p-4 ${!notification.isRead ? "bg-blue-50 border-l-4 border-blue-500" : ""}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="primary" className={getTypeColor(notification.type)}>
                      {getTypeLabel(notification.type)}
                    </Badge>
                    {!notification.isRead && <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>}
                  </div>
                  <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                  <p className="text-xs text-gray-500 mt-2">{getTimeAgo(notification.timestamp)}</p>
                </div>

                <div className="flex gap-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkRead(notification.notificationId)}
                      className="p-2 hover:bg-gray-100 rounded-lg text-gray-600"
                      title="Mark as read"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600" title="Delete">
                    <Trash2 size={18} />
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <Card>
              <div className="text-center py-12">
                <p className="text-gray-600">No notifications</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </AppLayout>
  )
}

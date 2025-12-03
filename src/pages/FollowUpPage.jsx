import { useState, useMemo, useCallback, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/ui/Toast"
import { followUpService } from "../services/followUpService"
import { AppLayout } from "../components/layout/AppLayout"
import { StatCard, CompactStatsRow } from "../components/ui/Card"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Modal, TwoColumnModal, ModalSection } from "../components/ui/Modal"
import { FormInput } from "../components/ui/FormInput"
import { FormTextarea } from "../components/ui/FormTextarea"
import { Timeline } from "../components/ui/Timeline"
import { FormSelect } from "../components/ui/FormSelect"
import { CheckCircle2, Circle, Calendar, Phone, User, FileText, Plus } from "lucide-react"
import { formatDateTime } from "../utils/helpers"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"
import { FOLLOWUP_EVENT_TAGS } from "../utils/constants"

// Constants
const INITIAL_FORM_STATE = {
  enquiryId: "",
  followUpDate: "",
  description: "",
}

const INITIAL_NODE_FORM_STATE = {
  body: "",
  followUpDateTime: new Date().toISOString().slice(0, 16),
  eventTag: FOLLOWUP_EVENT_TAGS.CLIENT_CALLED,
}

const VIEW_MODES = {
  TODAY: "today",
  ALL: "all",
}

// Utility functions
const getNextWeekDate = () => {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
}

const normalizeDate = (date) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

const formatDate = (date) => {
  try {
    return new Date(date).toLocaleDateString()
  } catch {
    return "Invalid Date"
  }
}

const formatDateForAPI = (date) => {
  const d = new Date(date)
  return d.toISOString().split("T")[0]
}

// Custom hooks
const useFollowUpStats = (followUps, today) => {
  return useMemo(() => {
    const pending = followUps.filter((fu) => fu.status !== "COMPLETED")

    const overdue = pending.filter((fu) => {
      const fuDate = normalizeDate(new Date(fu.followUpNextDate))
      return fuDate < today
    }).length

    const todayPending = pending.filter((fu) => {
      const fuDate = normalizeDate(new Date(fu.followUpNextDate))
      return fuDate.getTime() === today.getTime()
    }).length

    const completedToday = followUps.filter((fu) => {
      const fuDate = normalizeDate(new Date(fu.followUpNextDate))
      return fuDate.getTime() === today.getTime() && fu.status === "COMPLETED"
    }).length

    return { overdue, todayPending, completedToday }
  }, [followUps, today])
}

// Components
const FollowUpTable = ({ followUps, viewMode, onComplete, onViewTimeline }) => {
  if (followUps.length === 0) {
    return (
      <tr>
        <td colSpan="7" className="px-4 md:px-6 py-8 text-center text-gray-500 text-sm md:text-base">
          {viewMode === VIEW_MODES.TODAY ? "No tasks for today" : "No follow-ups"}
        </td>
      </tr>
    )
  }

  return followUps.map((followUp) => {
    const isComplete = followUp.status === "COMPLETED"
    const fuDate = normalizeDate(new Date(followUp.followUpNextDate))
    const today = normalizeDate(new Date())
    const isOverdue = fuDate < today && !isComplete

    return (
      <tr
        key={followUp.followUpId}
        className={`border-b border-gray-200 hover:bg-gray-50 ${
          isComplete ? "bg-gray-50 opacity-60" : ""
        } ${isOverdue ? "bg-red-50" : ""}`}
      >
        <td className="px-4 md:px-6 py-4">
          {viewMode === VIEW_MODES.TODAY && !isComplete ? (
            <button
              onClick={() => onComplete(followUp.followUpId)}
              className="text-indigo-600 hover:text-indigo-700"
              aria-label="Mark as complete"
            >
              <Circle size={20} />
            </button>
          ) : (
            <CheckCircle2 size={20} className={isComplete ? "text-green-600" : "text-gray-300"} />
          )}
        </td>
        <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-900">{followUp.clientName}</td>
        <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-900">{formatDate(followUp.followUpNextDate)}</td>
        <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-900">{followUp.mobileNumber}</td>
        <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-900">{followUp.agentName || "Unassigned"}</td>
        <td className="px-4 md:px-6 py-4 text-xs md:text-sm text-gray-900">
          <p className="truncate max-w-xs">{followUp.description || "-"}</p>
        </td>
        <td className="px-4 md:px-6 py-4 text-xs md:text-sm">
          <button
            onClick={() => onViewTimeline(followUp)}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View
          </button>
        </td>
      </tr>
    )
  })
}

// Main Component
export default function FollowUpPage() {
  const { user } = useAuth()
  const { success, error } = useToast()

  const [followUps, setFollowUps] = useState([])
  const [loading, setLoading] = useState(true)

  // State
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedFollowUp, setSelectedFollowUp] = useState(null)
  const [viewMode, setViewMode] = useState(VIEW_MODES.TODAY)
  const [nodeForm, setNodeForm] = useState(INITIAL_NODE_FORM_STATE)
  const [completeForm, setCompleteForm] = useState({
    remark: "",
    nextFollowUpDate: "",
    eventTag: FOLLOWUP_EVENT_TAGS.FOLLOW_UP_COMPLETED,
  })

  // Toggle between Design 1 and Design 3
  const [useCompactStats, setUseCompactStats] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [followUpsData] = await Promise.all([followUpService.getFollowUpTasks()])
        setFollowUps(followUpsData || [])
      } catch (err) {
        console.error("[v0] Failed to fetch follow-up data:", err)
        error("Failed to load follow-ups")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const fetchAllFollowUps = async () => {
      if (viewMode === VIEW_MODES.ALL) {
        try {
          setLoading(true)
          const todayDate = formatDateForAPI(new Date())
          const futureDate = formatDateForAPI(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000))

          const allFollowUpsData = await followUpService.getFollowUpTasks(todayDate, futureDate)
          setFollowUps(allFollowUpsData || [])
        } catch (err) {
          console.error("[v0] Failed to fetch all follow-ups:", err)
          error("Failed to load follow-ups")
        } finally {
          setLoading(false)
        }
      }
    }

    fetchAllFollowUps()
  }, [viewMode])

  const today = useMemo(() => normalizeDate(new Date()), [])

  const stats = useFollowUpStats(followUps, today)

  // Memoized follow-ups with additional metadata
  const enrichedFollowUps = useMemo(() => {
    return followUps.map((fu) => ({
      ...fu,
      isOverdue: normalizeDate(new Date(fu.followUpNextDate)) < today,
      isToday: normalizeDate(new Date(fu.followUpNextDate)).getTime() === today.getTime(),
    }))
  }, [followUps, today])

  // Filter follow-ups based on view mode
  const displayFollowUps = useMemo(() => {
    if (viewMode === VIEW_MODES.TODAY) {
      return enrichedFollowUps
        .filter((fu) => normalizeDate(new Date(fu.followUpNextDate)) <= today && fu.status !== "COMPLETED")
        .sort((a, b) => new Date(a.followUpNextDate) - new Date(b.followUpNextDate))
    }
    return enrichedFollowUps
      .filter((fu) => normalizeDate(new Date(fu.followUpNextDate)) >= today)
      .sort((a, b) => new Date(a.followUpNextDate) - new Date(b.followUpNextDate))
  }, [enrichedFollowUps, viewMode, today])

  // Timeline events - Updated with groupDate for the Timeline component
  const timelineEvents = useMemo(() => {
    if (!selectedFollowUp || !selectedFollowUp.followUpNodes) return []

    return selectedFollowUp.followUpNodes.map((node) => ({
      title: node.tag || "Note Added",
      timestamp: formatDateTime(node.followUpDateTime),
      groupDate: new Date(node.followUpDateTime).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }), // e.g., "30 Nov 2025"
      description: node.body,
      agent: node.agentName,
    }))
  }, [selectedFollowUp])

  const handleAddNote = useCallback(async () => {
    if (!nodeForm.body.trim()) {
      error("Please enter a note")
      return
    }

    try {
      const defaultNextDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]

      const nextDate =
        nodeForm.followUpDateTime && nodeForm.followUpDateTime.trim() !== ""
          ? nodeForm.followUpDateTime.split("T")[0]
          : defaultNextDate

      await followUpService.addFollowUpNode(selectedFollowUp.followUpId, {
        followUpNextDate: nextDate,
        body: nodeForm.body,
        tag: nodeForm.eventTag,
      })
      success("Note added successfully")
      setNodeForm({
        ...INITIAL_NODE_FORM_STATE,
        followUpDateTime: new Date().toISOString().slice(0, 16),
      })

      // Refresh follow-up data
      const updatedFollowUp = await followUpService.getFollowUpById(selectedFollowUp.followUpId)
      setFollowUps((prev) => prev.map((fu) => (fu.followUpId === selectedFollowUp.followUpId ? updatedFollowUp : fu)))
      setSelectedFollowUp(updatedFollowUp)
    } catch (err) {
      console.error("[v0] Failed to add note:", err)
      error("Failed to add note")
    }
  }, [nodeForm, selectedFollowUp, error, success])

  const handleCompleteFollowUp = useCallback(
    (followUpId) => {
      const followUp = enrichedFollowUps.find((fu) => fu.followUpId === followUpId)
      setSelectedFollowUp(followUp)
      setCompleteForm({
        remark: "",
        nextFollowUpDate: getNextWeekDate(),
        eventTag: FOLLOWUP_EVENT_TAGS.FOLLOW_UP_COMPLETED,
      })
      setShowCompleteModal(true)
    },
    [enrichedFollowUps],
  )

  const handleConfirmComplete = useCallback(async () => {
    if (!selectedFollowUp) return

    try {
      // Add completion node
      await followUpService.addFollowUpNode(selectedFollowUp.followUpId, {
        followUpNextDate: completeForm.nextFollowUpDate || new Date().toISOString().split("T")[0],
        body: completeForm.remark || "Follow-up completed",
        tag: completeForm.eventTag,
      })

      success("Follow-up completed successfully")
      setShowCompleteModal(false)
      setSelectedFollowUp(null)

      // Refresh data
      const followUpsData = await followUpService.getFollowUpTasks()
      setFollowUps(followUpsData || [])
    } catch (err) {
      console.error("[v0] Failed to complete follow-up:", err)
      error("Failed to complete follow-up")
    }
  }, [selectedFollowUp, completeForm, error, success])

  const handleViewTimeline = useCallback(
    (followUp) => {
      const fetchFollowUpDetails = async () => {
        try {
          const fullFollowUp = await followUpService.getFollowUpById(followUp.followUpId)
          setSelectedFollowUp(fullFollowUp)
          setShowTimelineModal(true)
        } catch (err) {
          console.error("Failed to fetch follow-up details:", err)
          error("Failed to load follow-up details")
        }
      }

      fetchFollowUpDetails()
    },
    [error],
  )

  // Helper to scroll to the add note section
  const scrollToAddNote = () => {
    const element = document.getElementById("add-note-section")
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  // Prepare stats array for CompactStatsRow
  const statsArray = useMemo(
    () => [
      {
        label: "Overdue",
        value: stats.overdue,
        trend: stats.overdue > 0 ? "up" : "down",
        trendDirection: stats.overdue > 0 ? "negative" : "positive",
      },
      {
        label: "Today's Pending",
        value: stats.todayPending,
        trend: stats.todayPending > 0 ? "up" : "down",
        trendDirection: stats.todayPending > 0 ? "neutral" : "positive",
      },
      {
        label: "Completed Today",
        value: stats.completedToday,
        trend: stats.completedToday > 0 ? "up" : "down",
        trendDirection: stats.completedToday > 0 ? "positive" : "neutral",
      },
    ],
    [stats],
  )

  if (loading) {
    return (
      <AppLayout>
        <SkeletonLoader type={"stat"} count={4} />
        <SkeletonLoader type={"list"} count={6} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Today's Tasks</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Track and manage follow-ups for enquiries</p>
          </div>
        </div>

        {/* Stats Section */}
        {useCompactStats ? (
          <CompactStatsRow stats={statsArray} />
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4">
            <StatCard
              label="Overdue"
              value={stats.overdue}
              trend={stats.overdue > 0 ? "up" : "down"}
              trendDirection={stats.overdue > 0 ? "negative" : "positive"}
            />
            <StatCard
              label="Today's Pending"
              value={stats.todayPending}
              trend={stats.todayPending > 0 ? "up" : "down"}
              trendDirection={stats.todayPending > 0 ? "neutral" : "positive"}
            />
            <StatCard
              label="Completed Today"
              value={stats.completedToday}
              trend={stats.completedToday > 0 ? "up" : "down"}
              trendDirection={stats.completedToday > 0 ? "positive" : "neutral"}
            />
          </div>
        )}

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setViewMode(VIEW_MODES.TODAY)}
            variant={viewMode === VIEW_MODES.TODAY ? "primary" : "secondary"}
            className="text-sm flex-1 sm:flex-none"
          >
            Today's Tasks
          </Button>
          <Button
            onClick={() => setViewMode(VIEW_MODES.ALL)}
            variant={viewMode === VIEW_MODES.ALL ? "primary" : "secondary"}
            className="text-sm flex-1 sm:flex-none"
          >
            All Follow-Ups
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full px-4 md:px-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 w-12"></th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Client
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Follow-Up Date
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Contact No
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Agent
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Description
                    </th>
                    <th className="px-4 md:px-6 py-3 text-left text-xs md:text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <FollowUpTable
                    followUps={displayFollowUps}
                    viewMode={viewMode}
                    onComplete={handleCompleteFollowUp}
                    onViewTimeline={handleViewTimeline}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </Card>

        {/* Complete Follow Up Modal */}
        <Modal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          title="Complete Follow-Up"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="text-lg font-semibold text-gray-900">
                {selectedFollowUp ? selectedFollowUp.clientName : ""}
              </p>
            </div>

            <FormSelect
              label="Event Tag"
              value={completeForm.eventTag}
              onChange={(e) => setCompleteForm({ ...completeForm, eventTag: e.target.value })}
              options={Object.entries(FOLLOWUP_EVENT_TAGS).map(([key, value]) => ({
                value: value,
                label: value,
              }))}
              required
            />

            <FormTextarea
              label="Add Remark (Optional)"
              value={completeForm.remark}
              onChange={(e) => setCompleteForm({ ...completeForm, remark: e.target.value })}
              placeholder="Add any notes or remarks about this follow-up..."
              rows={3}
            />

            <FormInput
              label="Next Follow-Up Date (Optional)"
              type="date"
              value={completeForm.nextFollowUpDate}
              onChange={(e) => setCompleteForm({ ...completeForm, nextFollowUpDate: e.target.value })}
              hint="Leave empty if no further follow-up is needed"
            />

            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
              <Button onClick={() => setShowCompleteModal(false)} variant="secondary" className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleConfirmComplete} variant="primary" className="w-full sm:w-auto">
                Mark as Completed
              </Button>
            </div>
          </div>
        </Modal>

        {/* Timeline Modal */}
        <TwoColumnModal
          isOpen={showTimelineModal}
          onClose={() => setShowTimelineModal(false)}
          title="Follow-Up Timeline"
          leftContent={
            selectedFollowUp && (
              <div className="flex flex-col h-full">
                
               <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between">
                    <p className="text-md font-bold text-gray-900">{selectedFollowUp.clientName}</p>
                    <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">{selectedFollowUp.mobileNumber}</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 max-h-[calc(90vh-350px)]">
                  <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-20 py-2">
                    <div className="flex items-center gap-2">
                      <Calendar size={20} className="text-purple-600" />
                      <h3 className="font-semibold text-gray-900">Activity Timeline</h3>
                    </div>
                    {/* Plus Button for Mobile Scrolling */}
                    <button
                      onClick={scrollToAddNote}
                      className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
                      aria-label="Add Note"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <Timeline events={[...timelineEvents].reverse()} />
                </div>
              </div>
            )
          }
          rightContent={
            selectedFollowUp && (
              <div className="space-y-6 px-2 overflow-y-auto max-h-[calc(90vh-200px)]">
                <ModalSection title="Follow-Up Details" icon={Calendar} iconColor="text-indigo-600">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm md:text-md text-gray-600 mb-1">Follow-Up Date</p>
                      <p className="text-sm md:text-base font-semibold text-gray-900">
                        {formatDate(selectedFollowUp.followUpNextDate)}
                      </p>
                    </div>
                  </div>
                </ModalSection>

                {/* Add Note Section with ID for scrolling */}
                <div id="add-note-section">
                  <ModalSection title="Add New Note" icon={FileText} iconColor="text-green-600">
                    <div className="space-y-3">
                      <FormInput
                        value={nodeForm.body}
                        onChange={(e) => setNodeForm({ ...nodeForm, body: e.target.value })}
                        placeholder="Enter your note..."
                      />
                      <FormSelect
                        label="Event Tag"
                        value={nodeForm.eventTag}
                        onChange={(e) => setNodeForm({ ...nodeForm, eventTag: e.target.value })}
                        options={Object.entries(FOLLOWUP_EVENT_TAGS).map(([key, value]) => ({
                          value: value,
                          label: value,
                        }))}
                        required
                      />
                      <FormInput
                        type="datetime-local"
                        label="Next Follow Up Date (optional)"
                        value={nodeForm.followUpDateTime}
                        onChange={(e) => setNodeForm({ ...nodeForm, followUpDateTime: e.target.value })}
                      />

                      <Button onClick={handleAddNote} variant="primary" className="w-full">
                        Add Note
                      </Button>
                    </div>
                  </ModalSection>
                </div>
              </div>
            )
          }
          columnGap="lg"
        />
      </div>
    </AppLayout>
  )
}
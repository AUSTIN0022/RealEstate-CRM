"use client"

import { useState, useMemo, useCallback } from "react"
import { useData } from "../contexts/DataContext"
import { useToast } from "../components/ui/Toast"
import { useAuth } from "../contexts/AuthContext"
import { AppLayout } from "../components/layout/AppLayout"
import { StatCard } from "../components/ui/Card"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Modal, TwoColumnModal, ModalSection } from "../components/ui/Modal"
import { FormInput } from "../components/ui/FormInput"
import { FormTextarea } from "../components/ui/FormTextarea"
import { Timeline } from "../components/ui/Timeline"
import { FormSelect } from "../components/ui/FormSelect"
import { Plus, CheckCircle2, Circle, Calendar, User, FileText } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { formatDateTime } from "../utils/helpers"

// Constants
const INITIAL_FORM_STATE = {
  enquiryId: "",
  followUpDate: "",
  description: "",
}

const INITIAL_NODE_FORM_STATE = {
  body: "",
  followUpDateTime: new Date().toISOString().slice(0, 16),
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

// Custom hooks
const useEnquiryInfo = (data) => {
  return useCallback((enquiryId) => {
    const enquiry = data.enquiries.find((e) => e.enquiryId === enquiryId && !e.isDeleted)
    const client = data.clients.find((c) => c.clientId === enquiry?.clientId)
    const flat = data.flats.find((f) => f.propertyId === enquiry?.propertyId)
    
    return {
      clientName: client?.clientName || "Unknown",
      unitNumber: flat?.unitNumber || "Unknown",
    }
  }, [data.enquiries, data.clients, data.flats])
}

const useFollowUpStats = (followUps, today) => {
  return useMemo(() => {
    console.log("Recalculating stats, total followUps:", followUps.length)
    const pending = followUps.filter((fu) => fu.status === "PENDING")
    
    const overdue = pending.filter((fu) => normalizeDate(fu.followUpDate) < today).length
    
    const todayPending = pending.filter((fu) => {
      const fuDate = normalizeDate(fu.followUpDate)
      return fuDate.getTime() === today.getTime()
    }).length

    const completedToday = followUps.filter((fu) => {
      const fuDate = normalizeDate(fu.followUpDate)
      return fuDate.getTime() === today.getTime() && fu.status === "COMPLETED"
    }).length

    const stats = { overdue, todayPending, completedToday }
    console.log("Calculated stats:", stats)
    return stats
  }, [followUps, today])
}

// Components
const FollowUpTable = ({ followUps, columns, viewMode, onComplete, onViewTimeline }) => {
  if (followUps.length === 0) {
    return (
      <tr>
        <td colSpan={columns.length + 2} className="px-6 py-8 text-center text-gray-500">
          {viewMode === VIEW_MODES.TODAY ? "No tasks for today" : "No follow-ups"}
        </td>
      </tr>
    )
  }

  return followUps.map((followUp) => {
    const isComplete = followUp.status === "COMPLETED"
    const isOverdue = followUp.isOverdue && !isComplete
    
    return (
      <tr
        key={followUp.followUpId}
        className={`border-b border-gray-200 hover:bg-gray-50 ${
          isComplete ? "bg-gray-50 opacity-60" : ""
        } ${isOverdue ? "bg-red-50" : ""}`}
      >
        <td className="px-6 py-4">
          {viewMode === VIEW_MODES.TODAY && !isComplete ? (
            <button
              onClick={() => onComplete(followUp.followUpId)}
              className="text-indigo-600 hover:text-indigo-700"
              aria-label="Mark as complete"
            >
              <Circle size={20} />
            </button>
          ) : (
            <CheckCircle2 size={20} className="text-green-600" />
          )}
        </td>
        {columns.map((col) => (
          <td
            key={col.key}
            className={`px-6 py-4 text-sm text-gray-900 ${
              isComplete ? "line-through text-gray-500" : ""
            }`}
          >
            {col.render(followUp[col.key], followUp)}
          </td>
        ))}
        <td className="px-6 py-4 text-sm">
          <button
            onClick={() => onViewTimeline(followUp)}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            View Timeline
          </button>
        </td>
      </tr>
    )
  })
}

const AddFollowUpModal = ({ isOpen, onClose, form, setForm, enquiries, getEnquiryInfo, onSubmit }) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Add Follow-Up" size="lg">
    <div className="space-y-4">
      <FormSelect
        label="Select Enquiry"
        value={form.enquiryId}
        onChange={(e) => setForm({ ...form, enquiryId: e.target.value })}
        options={enquiries.map((e) => {
          const info = getEnquiryInfo(e.enquiryId)
          return {
            value: e.enquiryId,
            label: `${info.clientName} - ${info.unitNumber}`,
          }
        })}
        placeholder="Select an enquiry"
        required
      />

      <FormInput
        label="Next Follow-Up Date"
        type="date"
        value={form.followUpDate}
        onChange={(e) => setForm({ ...form, followUpDate: e.target.value })}
        required
      />

      <FormTextarea
        label="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
        rows={3}
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={onSubmit} variant="primary">
          Create Follow-Up
        </Button>
      </div>
    </div>
  </Modal>
)

const CompleteFollowUpModal = ({ 
  isOpen, 
  onClose, 
  selectedFollowUp, 
  getEnquiryInfo, 
  form, 
  setForm, 
  onConfirm 
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title="Complete Follow-Up" size="lg">
    <div className="space-y-4">
      <div>
        <p className="text-sm text-gray-600">Enquiry</p>
        <p className="text-lg font-semibold text-gray-900">
          {selectedFollowUp ? getEnquiryInfo(selectedFollowUp.enquiryId).clientName : ""}
        </p>
      </div>

      <FormTextarea
        label="Add Remark (Optional)"
        value={form.remark}
        onChange={(e) => setForm({ ...form, remark: e.target.value })}
        placeholder="Add any notes or remarks about this follow-up..."
        rows={3}
      />

      <FormInput
        label="Next Follow-Up Date (Optional)"
        type="date"
        value={form.nextFollowUpDate}
        onChange={(e) => setForm({ ...form, nextFollowUpDate: e.target.value })}
        hint="Leave empty if no further follow-up is needed"
      />

      <div className="flex gap-2 justify-end pt-4">
        <Button onClick={onClose} variant="secondary">
          Cancel
        </Button>
        <Button onClick={onConfirm} variant="primary">
          Mark as Completed
        </Button>
      </div>
    </div>
  </Modal>
)

// Main Component
export default function FollowUpPage() {
  const { data, addFollowUp, addFollowUpNode, updateFollowUp } = useData()
  const { user } = useAuth()
  const { success, error } = useToast()
  
  // State
  const [showAddModal, setShowAddModal] = useState(false)
  const [showTimelineModal, setShowTimelineModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedFollowUp, setSelectedFollowUp] = useState(null)
  const [viewMode, setViewMode] = useState(VIEW_MODES.TODAY)
  const [addForm, setAddForm] = useState(INITIAL_FORM_STATE)
  const [nodeForm, setNodeForm] = useState(INITIAL_NODE_FORM_STATE)
  const [completeForm, setCompleteForm] = useState({ remark: "", nextFollowUpDate: "" })

  // Memoized data
  const activeEnquiries = useMemo(() => {
    console.log("Recalculating activeEnquiries, total:", data.enquiries?.length)
    return data.enquiries.filter((e) => !e.isDeleted)
  }, [data.enquiries])

  const activeFollowUps = useMemo(() => {
    console.log("Recalculating activeFollowUps, total:", data.followUps?.length)
    return (data.followUps || []).filter((fu) => !fu.isDeleted)
  }, [data.followUps])

  const today = useMemo(() => normalizeDate(new Date()), [])

  // Custom hooks
  const getEnquiryInfo = useEnquiryInfo(data)
  const stats = useFollowUpStats(activeFollowUps, today)

  // Memoized follow-ups with additional metadata
  const enrichedFollowUps = useMemo(() => {
    return activeFollowUps.map((fu) => ({
      ...fu,
      isOverdue: normalizeDate(fu.followUpDate) < today,
      isToday: normalizeDate(fu.followUpDate).getTime() === today.getTime(),
    }))
  }, [activeFollowUps, today])

  // Filter follow-ups based on view mode
  const displayFollowUps = useMemo(() => {
    if (viewMode === VIEW_MODES.TODAY) {
      return enrichedFollowUps
        .filter((fu) => normalizeDate(fu.followUpDate) <= today && fu.status === "PENDING")
        .sort((a, b) => new Date(a.followUpDate) - new Date(b.followUpDate))
    }
    return enrichedFollowUps
  }, [enrichedFollowUps, viewMode, today])

  // Get follow-up nodes
  const getFollowUpNodes = useCallback((followUpId) => {
    return (data.followUpNodes || [])
      .filter((node) => node.followUpId === followUpId && !node.isDeleted)
      .sort((a, b) => new Date(a.followUpDateTime) - new Date(b.followUpDateTime))
  }, [data.followUpNodes])

  // Timeline events
  const timelineEvents = useMemo(() => {
    if (!selectedFollowUp) return []
    
    return [
      {
        title: "Follow-up Created",
        timestamp: formatDate(selectedFollowUp.followUpDate),
        description: selectedFollowUp.notes || "No description",
        agent: selectedFollowUp.agentName,
      },
      ...getFollowUpNodes(selectedFollowUp.followUpId).map((node) => ({
        title: "Note Added",
        timestamp: formatDateTime(node.followUpDateTime),
        description: node.body,
        agent: node.agentName,
      })),
    ]
  }, [selectedFollowUp, getFollowUpNodes])

  // Handlers
  const handleAddFollowUp = useCallback(() => {
    if (!addForm.enquiryId || !addForm.followUpDate) {
      error("Please fill all required fields")
      return
    }

    const followUp = {
      followUpId: uuidv4(),
      enquiryId: addForm.enquiryId,
      followUpDate: addForm.followUpDate,
      followUpTime: "10:00",
      status: "PENDING",
      notes: addForm.description,
      agentName: user?.fullName || "Unknown",
      createdDate: new Date().toISOString().split("T")[0],
      isDeleted: false,
    }

    addFollowUp(followUp)
    success("Follow-up created successfully")
    setAddForm(INITIAL_FORM_STATE)
    setShowAddModal(false)
  }, [addForm, user, addFollowUp, success, error])

  const handleAddNote = useCallback(() => {
    if (!nodeForm.body.trim()) {
      error("Please enter a note")
      return
    }

    const node = {
      followUpNodeId: uuidv4(),
      followUpId: selectedFollowUp.followUpId,
      followUpDateTime: nodeForm.followUpDateTime,
      body: nodeForm.body,
      agentName: user?.fullName || "Unknown",
      userId: user?.userId || "current-user",
      isDeleted: false,
    }

    addFollowUpNode(node)
    success("Note added successfully")
    setNodeForm({ ...INITIAL_NODE_FORM_STATE, followUpDateTime: new Date().toISOString().slice(0, 16) })
  }, [nodeForm, selectedFollowUp, user, addFollowUpNode, success, error])

  const handleCompleteFollowUp = useCallback((followUpId) => {
    const followUp = enrichedFollowUps.find((fu) => fu.followUpId === followUpId)
    setSelectedFollowUp(followUp)
    setCompleteForm({
      remark: "",
      nextFollowUpDate: getNextWeekDate(),
    })
    setShowCompleteModal(true)
  }, [enrichedFollowUps])

  const handleConfirmComplete = useCallback(() => {
    if (!selectedFollowUp) return

    console.log("=== Starting follow-up completion ===")
    console.log("Selected follow-up:", selectedFollowUp)
    console.log("Complete form data:", completeForm)

    try {
      // Add completion note - always add one, use remark or default message
      const node = {
        followUpNodeId: uuidv4(),
        followUpId: selectedFollowUp.followUpId,
        followUpDateTime: new Date().toISOString(),
        body: completeForm.remark || "Follow-up completed",
        agentName: user?.fullName || "Unknown",
        userId: user?.userId || "current-user",
        isDeleted: false,
      }
      console.log("Adding completion node:", node)
      addFollowUpNode(node)

      // Mark as completed
      console.log("Marking follow-up as completed:", selectedFollowUp.followUpId)
      updateFollowUp(selectedFollowUp.followUpId, { status: "COMPLETED" })

      // Create next follow-up if date provided
      if (completeForm.nextFollowUpDate) {
        const nextFollowUp = {
          followUpId: uuidv4(),
          enquiryId: selectedFollowUp.enquiryId,
          followUpDate: completeForm.nextFollowUpDate,
          followUpTime: "10:00",
          status: "PENDING",
          notes: "",
          agentName: user?.fullName || "Unknown",
          createdDate: new Date().toISOString().split("T")[0],
          isDeleted: false,
        }
        console.log("Creating next follow-up:", nextFollowUp)
        addFollowUp(nextFollowUp)
      }

      console.log("=== Follow-up completion successful ===")
      success("Follow-up completed successfully")
      
      // Reset state after successful completion
      setShowCompleteModal(false)
      setSelectedFollowUp(null)
      setCompleteForm({ remark: "", nextFollowUpDate: "" })
    } catch (err) {
      console.error("=== Error completing follow-up ===", err)
      error("Failed to complete follow-up. Please try again.")
    }
  }, [selectedFollowUp, completeForm, user, addFollowUpNode, updateFollowUp, addFollowUp, success, error])

  const handleViewTimeline = useCallback((followUp) => {
    setSelectedFollowUp(followUp)
    setShowTimelineModal(true)
  }, [])

  // Table columns
  const columns = useMemo(() => [
    {
      key: "enquiryId",
      label: "Enquiry",
      render: (val) => {
        const info = getEnquiryInfo(val)
        return `${info.clientName} - ${info.unitNumber}`
      },
    },
    {
      key: "followUpDate",
      label: "Follow-Up Date",
      render: (val) => formatDate(val),
    },
    {
      key: "agentName",
      label: "Agent",
      render: (val) => val || "Unassigned",
    },
    {
      key: "notes",
      label: "Description",
      render: (val) => <p className="truncate max-w-xs">{val || "-"}</p>,
    },
  ], [getEnquiryInfo])

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Today's Tasks</h1>
            <p className="text-gray-600 mt-1">Track and manage follow-ups for enquiries</p>
          </div>
          <Button onClick={() => setShowAddModal(true)} variant="primary">
            <Plus size={20} />
            Add Follow-Up
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon="AlertCircle"
            label="Overdue"
            value={stats.overdue}
            trend={stats.overdue > 0 ? "up" : "down"}
            trendDirection={stats.overdue > 0 ? "negative" : "positive"}
          />
          <StatCard
            icon="Clock"
            label="Today's Pending"
            value={stats.todayPending}
            trend={stats.todayPending > 0 ? "up" : "down"}
            trendDirection={stats.todayPending > 0 ? "neutral" : "positive"}
          />
          <StatCard
            icon="CheckCircle"
            label="Completed Today"
            value={stats.completedToday}
            trend={stats.completedToday > 0 ? "up" : "down"}
            trendDirection={stats.completedToday > 0 ? "positive" : "neutral"}
          />
        </div>

        {/* View Mode Buttons */}
        <div className="flex gap-2">
          <Button 
            onClick={() => setViewMode(VIEW_MODES.TODAY)} 
            variant={viewMode === VIEW_MODES.TODAY ? "primary" : "secondary"}
          >
            Today's Tasks
          </Button>
          <Button 
            onClick={() => setViewMode(VIEW_MODES.ALL)} 
            variant={viewMode === VIEW_MODES.ALL ? "primary" : "secondary"}
          >
            All Follow-Ups
          </Button>
        </div>

        {/* Follow-Ups Table */}
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-12"></th>
                  {columns.map((col) => (
                    <th key={col.key} className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                <FollowUpTable
                  followUps={displayFollowUps}
                  columns={columns}
                  viewMode={viewMode}
                  onComplete={handleCompleteFollowUp}
                  onViewTimeline={handleViewTimeline}
                />
              </tbody>
            </table>
          </div>
        </Card>

        {/* Add Follow-Up Modal */}
        <AddFollowUpModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          form={addForm}
          setForm={setAddForm}
          enquiries={activeEnquiries}
          getEnquiryInfo={getEnquiryInfo}
          onSubmit={handleAddFollowUp}
        />

        {/* Complete Follow-Up Modal */}
        <CompleteFollowUpModal
          isOpen={showCompleteModal}
          onClose={() => setShowCompleteModal(false)}
          selectedFollowUp={selectedFollowUp}
          getEnquiryInfo={getEnquiryInfo}
          form={completeForm}
          setForm={setCompleteForm}
          onConfirm={handleConfirmComplete}
        />

        {/* Timeline Modal - Two Column */}
        <TwoColumnModal
          isOpen={showTimelineModal}
          onClose={() => setShowTimelineModal(false)}
          title="Follow-Up Timeline"
          leftContent={
            selectedFollowUp && (
              <div className="space-y-6">
                <ModalSection title="Follow-Up Details" icon={Calendar} iconColor="text-indigo-600">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Enquiry</p>
                      <p className="text-base font-semibold text-gray-900">
                        {getEnquiryInfo(selectedFollowUp.enquiryId).clientName}
                      </p>
                      <p className="text-sm text-gray-600">
                        Unit: {getEnquiryInfo(selectedFollowUp.enquiryId).unitNumber}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Follow-Up Date</p>
                      <p className="text-base font-semibold text-gray-900">
                        {formatDate(selectedFollowUp.followUpDate)}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Agent</p>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <p className="text-base font-semibold text-gray-900">
                          {selectedFollowUp.agentName || "Unassigned"}
                        </p>
                      </div>
                    </div>

                    {selectedFollowUp.notes && (
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Initial Notes</p>
                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                          {selectedFollowUp.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </ModalSection>

                <ModalSection title="Add New Note" icon={FileText} iconColor="text-green-600">
                  <div className="space-y-3">
                    <FormTextarea
                      value={nodeForm.body}
                      onChange={(e) => setNodeForm({ ...nodeForm, body: e.target.value })}
                      placeholder="Enter your note..."
                      rows={4}
                    />
                    <FormInput
                      type="datetime-local"
                      value={nodeForm.followUpDateTime}
                      onChange={(e) => setNodeForm({ ...nodeForm, followUpDateTime: e.target.value })}
                    />
                    <Button onClick={handleAddNote} variant="primary" className="w-full">
                      Add Note
                    </Button>
                  </div>
                </ModalSection>
              </div>
            )
          }
          rightContent={
            <ModalSection title="Activity Timeline" icon={Calendar} iconColor="text-purple-600">
              <Timeline events={timelineEvents} />
            </ModalSection>
          }
          columnGap="lg"
        />
      </div>
    </AppLayout>
  )
}
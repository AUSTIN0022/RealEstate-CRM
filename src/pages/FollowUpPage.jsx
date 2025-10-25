import { useState, useMemo } from "react"
import { useData } from "../contexts/DataContext"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { Card } from "../components/ui/Card"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { Modal } from "../components/ui/Modal"
import { FormInput } from "../components/ui/FormInput"
import { FormTextarea } from "../components/ui/FormTextarea"
import { Timeline } from "../components/ui/Timeline"
import { FormSelect } from "../components/ui/FormSelect"
import { Drawer } from "../components/ui/Drawer"
import { Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { formatDateTime } from "../utils/helpers"

export default function FollowUpPage() {
  const { data, addFollowUp, addFollowUpNode } = useData()
  const { success, error } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [showDrawer, setShowDrawer] = useState(false)
  const [selectedFollowUp, setSelectedFollowUp] = useState(null)
  const [filters, setFilters] = useState({ project: "", status: "" })

  const [form, setForm] = useState({
    enquiryId: "",
    followUpDate: "",
    description: "",
  })

  const [nodeForm, setNodeForm] = useState({
    body: "",
    followUpDateTime: new Date().toISOString().slice(0, 16),
  })

  const projects = useMemo(() => {
    return data.projects.filter((p) => !p.isDeleted)
  }, [data.projects])

  const enquiries = useMemo(() => {
    return data.enquiries.filter((e) => !e.isDeleted)
  }, [data.enquiries])

  const followUps = useMemo(() => {
    let result = data.followUps || []

    if (filters.project) {
      result = result.filter((fu) => {
        const enquiry = enquiries.find((e) => e.enquiryId === fu.enquiryId)
        return enquiry?.projectId === filters.project
      })
    }

    return result.filter((fu) => !fu.isDeleted)
  }, [data.followUps, enquiries, filters])

  const getFollowUpNodes = (followUpId) => {
    return (data.followUpNodes || []).filter((node) => node.followUpId === followUpId && !node.isDeleted)
  }

  const handleAddFollowUp = () => {
    if (!form.enquiryId || !form.followUpDate) {
      error("Please fill all required fields")
      return
    }

    const followUp = {
      followUpId: uuidv4(),
      enquiryId: form.enquiryId,
      followUpDate: form.followUpDate,
      followUpTime: "10:00",
      status: "PENDING",
      notes: form.description,
      createdDate: new Date().toISOString().split("T")[0],
      isDeleted: false,
    }

    addFollowUp(followUp)
    success("Follow-up created successfully")
    setForm({ enquiryId: "", followUpDate: "", description: "" })
    setShowModal(false)
  }

  const handleAddNode = () => {
    if (!nodeForm.body.trim()) {
      error("Please enter a note")
      return
    }

    const node = {
      followUpNodeId: uuidv4(),
      followUpId: selectedFollowUp.followUpId,
      followUpDateTime: nodeForm.followUpDateTime,
      body: nodeForm.body,
      userId: "current-user",
      isDeleted: false,
    }

    addFollowUpNode(node)
    success("Note added successfully")
    setNodeForm({ body: "", followUpDateTime: new Date().toISOString().slice(0, 16) })
  }

  const getEnquiryInfo = (enquiryId) => {
    const enquiry = enquiries.find((e) => e.enquiryId === enquiryId)
    const client = data.clients.find((c) => c.clientId === enquiry?.clientId)
    const flat = data.flats.find((f) => f.propertyId === enquiry?.propertyId)
    return {
      clientName: client?.clientName || "Unknown",
      unitNumber: flat?.unitNumber || "Unknown",
    }
  }

  const columns = [
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
      label: "Next Follow-Up Date",
      render: (val) => {
        if (!val) return "Invalid Date"
        try {
          return new Date(val).toLocaleDateString()
        } catch {
          return "Invalid Date"
        }
      },
    },
    {
      key: "notes",
      label: "Description",
      render: (val) => <p className="truncate">{val || "-"}</p>,
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Follow-Up Management</h1>
            <p className="text-gray-600 mt-1">Track and manage follow-ups for enquiries</p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="primary">
            <Plus size={20} />
            Add Follow-Up
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <select
            value={filters.project}
            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option  value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId} >
                {p.projectName}
              </option>
            ))}
          </select>
        </div>

        {/* Follow-Ups Table */}
        <Card>
          <Table
            columns={columns}
            data={followUps}
            onRowClick={(row) => {
              setSelectedFollowUp(row)
              setShowDrawer(true)
            }}
            actions={(row) => [
              {
                label: "View Timeline",
                onClick: () => {
                  setSelectedFollowUp(row)
                  setShowDrawer(true)
                },
              },
              {
                label: "Mark Complete",
                onClick: () => {
                  success("Follow-up marked as complete")
                },
              },
            ]}
          />
        </Card>

        {/* Add Follow-Up Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Follow-Up">
          <div className="space-y-4">
            <FormSelect
              label="Select Enquiry"
              value={form.enquiryId}
              onChange={(e) => setForm({ ...form, enquiryId: e.target.value })}
              options={enquiries.map((e) => {
                const info = getEnquiryInfo(e.enquiryId)
                return {
                  value: e.enquiryId,
                  label: `${info.clientName} - ${info.unitNumber}`
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
              <Button onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleAddFollowUp} variant="primary">
                Create Follow-Up
              </Button>
            </div>
          </div>
        </Modal>

        {/* Timeline Drawer */}
        <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} title="Follow-Up Timeline">
          {selectedFollowUp && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-600">Enquiry</p>
                <p className="text-lg font-semibold text-gray-900">
                  {getEnquiryInfo(selectedFollowUp.enquiryId).clientName}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Next Follow-Up Date</p>
                <p className="text-lg font-semibold text-gray-900">
                  {selectedFollowUp.followUpDate
                    ? new Date(selectedFollowUp.followUpDate).toLocaleDateString()
                    : "Invalid Date"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Add Note</h3>
                <FormTextarea
                  value={nodeForm.body}
                  onChange={(e) => setNodeForm({ ...nodeForm, body: e.target.value })}
                  placeholder="Enter your note..."
                  rows={3}
                />
                <FormInput
                  type="datetime-local"
                  value={nodeForm.followUpDateTime}
                  onChange={(e) => setNodeForm({ ...nodeForm, followUpDateTime: e.target.value })}
                  className="mt-2"
                />
                <Button onClick={handleAddNode} variant="primary" className="mt-3 w-full">
                  Add Note
                </Button>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Timeline</h3>
                <Timeline
                  events={[
                    {
                      title: "Follow-up Created",
                      timestamp: selectedFollowUp.followUpDate
                        ? new Date(selectedFollowUp.followUpDate).toLocaleDateString()
                        : "Invalid Date",
                      description: selectedFollowUp.notes,
                    },
                    ...getFollowUpNodes(selectedFollowUp.followUpId).map((node) => ({
                      title: "Note Added",
                      timestamp: formatDateTime(node.followUpDateTime),
                      description: node.body,
                    })),
                  ]}
                />
              </div>
            </div>
          )}
        </Drawer>
      </div>
    </AppLayout>
  )
}

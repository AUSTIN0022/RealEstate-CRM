import { useState, useMemo } from "react"
import { useData } from "../contexts/DataContext"
import { AppLayout } from "../components/layout/AppLayout"

import { useToast } from "../components/ui/Toast"
import { Card } from "../components/ui/Card"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"
import { FormInput } from "../components/ui/FormInput"
import { FormSelect } from "../components/ui/FormSelect"
import { FormTextarea } from "../components/ui/FormTextarea"

import { Plus, Search } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { validateEmail, validatePhone } from "../utils/helpers"


export default function EnquiryBookPage() {
  const { data, addEnquiry, addClient, updateEnquiry, addFollowUp, updateData  } = useData()
  const { success, error } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({ project: "", status: "" })
  const [editingId, setEditingId] = useState(null)

  // Form state
  const [form, setForm] = useState({
    clientId: "",
    projectId: "",
    propertyId: "",
    budget: "",
    reference: "",
    referenceName: "",
    remark: "",
    status: "ONGOING",
  })

  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    mobile: "",
    pan: "",
    aadhar: "",
  })

  const [createNewClient, setCreateNewClient] = useState(false)
  const [showRemarkModal, setShowRemarkModal] = useState(false)
  const [remarkText, setRemarkText] = useState("")
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)

  // Get filtered enquiries
  const enquiries = useMemo(() => {
    let result = data.enquiries.filter((e) => !e.isDeleted)

    if (filters.project) {
      result = result.filter((e) => e.projectId === filters.project)
    }
    if (filters.status) {
      result = result.filter((e) => e.status === filters.status)
    }
    if (searchTerm) {
      result = result.filter(
        (e) =>
          data.clients
            .find((c) => c.clientId === e.clientId)
            ?.clientName.toLowerCase()
            .includes(searchTerm.toLowerCase()) || e.budget.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    return result
  }, [data.enquiries, data.clients, filters, searchTerm])

  const projects = useMemo(() => {
    return data.projects.filter((p) => !p.isDeleted)
  }, [data.projects])
// Replace your handleAddEnquiry function with this fixed version

const handleAddEnquiry = () => {
  let clientId = form.clientId

  if (createNewClient) {
    if (!newClient.name || !newClient.email || !newClient.mobile) {
      error("Please fill all required client fields")
      return
    }
    if (!validateEmail(newClient.email)) {
      error("Invalid email format")
      return
    }
    if (!validatePhone(newClient.mobile)) {
      error("Mobile number must be 10 digits")
      return
    }

    clientId = uuidv4()
    const newClientObj = {
      clientId,
      clientName: newClient.name,
      email: newClient.email,
      mobileNumber: newClient.mobile,
      panNo: newClient.pan,
      aadharNo: newClient.aadhar,
      dob: "",
      city: "",
      address: "",
      occupation: "",
      company: "",
      createdDate: new Date().toISOString().split("T")[0],
      isDeleted: false,
    }
    addClient(newClientObj)
  }

  if (!clientId || !form.projectId || !form.propertyId || !form.budget) {
    error("Please fill all required fields")
    return
  }

  if (editingId) {
    const enquiry = {
      enquiryId: editingId,
      projectId: form.projectId,
      clientId: clientId,
      propertyId: form.propertyId,
      budget: form.budget,
      reference: form.reference,
      referenceName: form.referenceName,
      remark: form.remark,
      status: form.status,
      createdDate: new Date().toISOString().split("T")[0],
      isDeleted: false,
    }
    updateEnquiry(editingId, enquiry)
    success("Enquiry updated successfully")
  } else {
    // Create both enquiry and follow-up in a single update
    const enquiryId = uuidv4()
    const enquiry = {
      enquiryId: enquiryId,
      projectId: form.projectId,
      clientId: clientId,
      propertyId: form.propertyId,
      budget: form.budget,
      reference: form.reference,
      referenceName: form.referenceName,
      remark: form.remark,
      status: form.status,
      createdDate: new Date().toISOString().split("T")[0],
      isDeleted: false,
    }

    const nextFollowUpDate = new Date()
    nextFollowUpDate.setDate(nextFollowUpDate.getDate() + 7)
    const followUpDateStr = nextFollowUpDate.toISOString().split("T")[0]

    const initialFollowUp = {
      followUpId: uuidv4(),
      enquiryId: enquiryId,
      followUpDate: followUpDateStr,
      followUpTime: "10:00",
      status: "PENDING",
      notes: "Initial follow-up created",
      createdDate: new Date().toISOString().split("T")[0],
      isDeleted: false,
    }

    // Add both in a single update to avoid stale data issues
    const updated = {
      ...data,
      enquiries: [...(data.enquiries || []), enquiry],
      followUps: [...(data.followUps || []), initialFollowUp],
    }
    
    updateData(updated)
    success("Enquiry created successfully with initial follow-up")
  }

  resetForm()
  setShowModal(false)
}
  
  const handleAddRemark = () => {
    if (!remarkText.trim()) {
      error("Please enter a remark")
      return
    }

    const timestamp = new Date().toLocaleString()
    const updatedRemark = selectedEnquiry.remark
      ? `${selectedEnquiry.remark}\n[${timestamp}] ${remarkText}`
      : `[${timestamp}] ${remarkText}`

    updateEnquiry(selectedEnquiry.enquiryId, { remark: updatedRemark })
    success("Remark added successfully")
    setShowRemarkModal(false)
    setRemarkText("")
  }

  const resetForm = () => {
    setForm({
      clientId: "",
      projectId: "",
      propertyId: "",
      budget: "",
      reference: "",
      referenceName: "",
      remark: "",
      status: "ONGOING",
    })
    setNewClient({ name: "", email: "", mobile: "", pan: "", aadhar: "" })
    setCreateNewClient(false)
    setEditingId(null)
  }

  const getClientName = (clientId) => {
    return data.clients.find((c) => c.clientId === clientId)?.clientName || "Unknown"
  }

  const getProjectName = (projectId) => {
    return data.projects.find((p) => p.projectId === projectId)?.projectName || "Unknown"
  }

  const getPropertyNumber = (propertyId) => {
    return data.flats.find((f) => f.propertyId === propertyId)?.unitNumber || "Unknown"
  }

  const columns = [
    { key: "enquiryId", label: "SN", render: (_, __, idx) => idx + 1 },
    {
      key: "clientId",
      label: "Client Name",
      render: (val) => getClientName(val),
    },
    {
      key: "projectId",
      label: "Project",
      render: (val) => getProjectName(val),
    },
    {
      key: "propertyId",
      label: "Unit",
      render: (val) => getPropertyNumber(val),
    },
    { key: "budget", label: "Budget" },
    {
      key: "status",
      label: "Status",
      render: (val) => <Badge status={val}>{val}</Badge>,
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Enquiry Book</h1>
            <p className="text-gray-600 mt-1">Manage all client enquiries</p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="primary">
            <Plus size={20} />
            Add Enquiry
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client name or budget..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
            />
          </div>
          <select
            value={filters.project}
            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option value="">All Projects</option>
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.projectName}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option value="">All Status</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Enquiries Table */}
        <Card>
          <Table
            columns={columns}
            data={enquiries}
            actions={(row) => [
              {
                label: "View Details",
                onClick: () => {
                  setSelectedEnquiry(row)
                  setForm(row)
                  setEditingId(row.enquiryId)
                  setShowModal(true)
                },
              },
              {
                label: "Add Remark",
                onClick: () => {
                  setSelectedEnquiry(row)
                  setShowRemarkModal(true)
                },
              },
              {
                label: "Convert to Booking",
                onClick: () => {
                  updateEnquiry(row.enquiryId, { status: "COMPLETED" })
                  success("Enquiry converted to booking")
                },
              },
            ]}
          />
        </Card>

        {/* Add/Edit Enquiry Modal */}
        {/* Add/Edit Enquiry Modal - Two Column Layout */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            resetForm()
          }}
          title={editingId ? "Edit Enquiry" : "Add New Enquiry"}
          type={editingId ? "info" : "default"}
          size="5xl"
          variant="form"
          scrollBehavior="outside"
          twoColumn={true}
          columnGap="lg"
          showSectionDividers={false}
          leftColumn={
            <div className="space-y-6">
              {/* Client Section */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Client Information</h3>
                </div>

                {!createNewClient ? (
                  <FormSelect
                    label="Select Client"
                    value={form.clientId}
                    onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                    options={data.clients
                      .filter((c) => !c.isDeleted)
                      .map((c) => ({ value: c.clientId, label: c.clientName }))}
                    required
                  />
                ) : (
                  <div className="space-y-4">
                    <FormInput
                      label="Client Name"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      required
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="Email"
                        type="email"
                        value={newClient.email}
                        onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                        required
                      />
                      <FormInput
                        label="Mobile"
                        value={newClient.mobile}
                        onChange={(e) => setNewClient({ ...newClient, mobile: e.target.value })}
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormInput
                        label="PAN"
                        value={newClient.pan}
                        onChange={(e) => setNewClient({ ...newClient, pan: e.target.value })}
                      />
                      <FormInput
                        label="Aadhar"
                        value={newClient.aadhar}
                        onChange={(e) => setNewClient({ ...newClient, aadhar: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                  <input
                    type="checkbox"
                    id="newClient"
                    checked={createNewClient}
                    onChange={(e) => setCreateNewClient(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-600"
                  />
                  <label htmlFor="newClient" className="text-sm font-medium text-gray-700 cursor-pointer">
                    Create New Client
                  </label>
                </div>
              </div>

              {/* Property Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Property Details</h3>
                </div>

                <div className="space-y-4">
                  <FormSelect
                    label="Project"
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                    options={projects.map((p) => ({ value: p.projectId, label: p.projectName }))}
                    required
                  />

                  {form.projectId && (
                    <FormSelect
                      label="Unit"
                      value={form.propertyId}
                      onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                      options={data.flats
                        .filter((f) => f.projectId === form.projectId && f.status === "VACANT" && !f.isDeleted)
                        .map((f) => ({ value: f.propertyId, label: f.unitNumber }))}
                      required
                    />
                  )}
                </div>
              </div>
            </div>
          }
          rightColumn={
            <div className="space-y-6">
              {/* Enquiry Details */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Enquiry Details</h3>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Budget"
                      value={form.budget}
                      onChange={(e) => setForm({ ...form, budget: e.target.value })}
                      required
                    />

                    <FormSelect
                      label="Status"
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value })}
                      options={[
                        { value: "ONGOING", label: "Ongoing" },
                        { value: "COMPLETED", label: "Completed" },
                        { value: "CANCELLED", label: "Cancelled" },
                      ]}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Reference"
                      value={form.reference}
                      onChange={(e) => setForm({ ...form, reference: e.target.value })}
                    />

                    <FormInput
                      label="Reference Name"
                      value={form.referenceName}
                      onChange={(e) => setForm({ ...form, referenceName: e.target.value })}
                    />
                  </div>

                  <FormTextarea
                    label="Remark"
                    value={form.remark}
                    onChange={(e) => setForm({ ...form, remark: e.target.value })}
                    rows={4}
                    placeholder="Add any additional notes or remarks..."
                  />
                </div>
              </div>

              {/* Summary Card - Only show when editing */}
              {editingId && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Enquiry Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Created Date</span>
                        <span className="font-medium text-gray-900">{selectedEnquiry?.createdDate || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Status</span>
                        <Badge status={form.status}>{form.status}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
          footer={
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEnquiry}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
              >
                {editingId ? "Update" : "Create"} Enquiry
              </button>
            </div>
          }
        />   

        {/* Add Remark Modal */}
        <Modal isOpen={showRemarkModal} onClose={() => setShowRemarkModal(false)} title="Add Remark">
          <FormTextarea
            label="Remark"
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            rows={4}
            placeholder="Enter your remark here..."
          />
          <div className="flex gap-2 justify-end pt-4">
            <Button onClick={() => setShowRemarkModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddRemark} variant="primary">
              Add Remark
            </Button>
          </div>
        </Modal>
        
      </div>
    </AppLayout>
  )
}

import { useState, useEffect, useMemo } from "react"
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
// Added Filter icon
import { Plus, Search, Filter } from "lucide-react" 
import { enquiryService } from "../services/enquiryService"
import { projectService } from "../services/projectService"
import { validateEmail, validatePhone } from "../utils/helpers"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"

export default function EnquiryBookPage() {
  const { success, error } = useToast()
  const [enquiries, setEnquiries] = useState([])
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  // New state for the filter modal
  const [showFilterModal, setShowFilterModal] = useState(false) 
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({ project: "", status: "" })
  const [editingId, setEditingId] = useState(null)
  
  const [remarkText, setRemarkText] = useState("")
  const [selectedEnquiry, setSelectedEnquiry] = useState(null)

  // Form state
  const [form, setForm] = useState({
    clientName: "",
    mobileNumber: "",
    landlineNumber: "",
    email: "",
    city: "",
    address: "",
    occupation: "",
    company: "",
    projectId: "",
    propertyType: "",
    property: "",
    area: "",
    budget: "",
    reference: "",
    referenceName: "",
    remark: "",
    status: "ONGOING",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("Fetching enquiries and projects...")
        const [enquiriesData, projectsData] = await Promise.all([
          enquiryService.getAllEnquiries(),
          projectService.getProjects(),
        ])
        setEnquiries(enquiriesData)
        setProjects(projectsData)
        console.log("Data fetched successfully")
      } catch (err) {
        console.error("Failed to fetch data:", err)
        error(err.message || "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Get filtered enquiries
  const filteredEnquiries = useMemo(() => {
    let result = enquiries

    if (filters.project) {
      result = result.filter((e) => e.projectId === filters.project)
    }
    if (filters.status) {
      result = result.filter((e) => e.status === filters.status)
    }
    if (searchTerm) {
      result = result.filter(
        (e) =>
          e.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || e.budget.toString().includes(searchTerm),
      )
    }

    return result
  }, [enquiries, filters, searchTerm])

  const handleAddEnquiry = async () => {
    if (!form.clientName || !form.email || !form.mobileNumber) {
      error("Please fill all required client fields")
      return
    }

    if (!validateEmail(form.email)) {
      error("Invalid email format")
      return
    }

    if (!validatePhone(form.mobileNumber)) {
      error("Mobile number must be 10 digits")
      return
    }

    if (!form.projectId || !form.property || !form.area || !form.budget) {
      error("Please fill all required property fields")
      return
    }

    try {
      if (editingId) {
        // Update enquiry
        await enquiryService.updateEnquiry(editingId, form)
        const updated = enquiries.map((e) => (e.enquiryId === editingId ? { ...e, ...form } : e))
        setEnquiries(updated)
        success("Enquiry updated successfully")
      } else {
        // Create new enquiry
        const response = await enquiryService.createEnquiry(form)
        setEnquiries([...enquiries, response])
        success("Enquiry created successfully")
      }

      resetForm()
      setShowModal(false)
    } catch (err) {
      console.error("Failed to save enquiry:", err)
      error(err.message || "Failed to save enquiry")
    }
  }

  const resetForm = () => {
    setForm({
      clientName: "",
      mobileNumber: "",
      landlineNumber: "",
      email: "",
      city: "",
      address: "",
      occupation: "",
      company: "",
      projectId: "",
      propertyType: "",
      property: "",
      area: "",
      budget: "",
      reference: "",
      referenceName: "",
      remark: "",
      status: "ONGOING",
    })
    setEditingId(null)
  }

  const columns = [
    { key: "enquiryId", label: "SN", render: (_, __, idx) => idx + 1 },
    {
      key: "clientName",
      label: "Client Name",
      render: (val) => <p className="text-sm truncate">{val}</p>,
    },
    {
      key: "projectName",
      label: "Project",
      render: (val) => <p className="text-sm truncate">{val}</p>,
    },
    {
      key: "property",
      label: "Property Type",
      render: (val) => <p className="text-sm">{val}</p>,
    },
    { key: "budget", label: "Budget", render: (val) => <p className="text-sm font-medium">₹{val}</p> },
    {
      key: "status",
      label: "Status",
      render: (val) => <Badge status={val}>{val}</Badge>,
    },
  ]

  if (loading) {
    return (
      <AppLayout>
       <SkeletonLoader type={"table"} count={5} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header - MODIFIED */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Enquiry Book</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Manage all client enquiries</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            // Responsive classes for the button
            className="flex-shrink-0 p-2 sm:px-4 sm:py-2 rounded-full sm:rounded-xl text-sm md:text-base"
          >
            <Plus size={18} />
            {/* Text hidden on mobile, visible on sm screens and up */}
            <span className="hidden sm:inline sm:ml-2">Add Enquiry</span>
          </Button>
        </div>

        {/* Filters - MODIFIED */}
        <div className="flex flex-row gap-2 md:gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative min-w-0">
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by client or budget..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm"
            />
          </div>
          
          {/* Desktop Filters - Hidden on mobile */}
          <select
            value={filters.project}
            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
            className="hidden sm:block px-3 md:px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm sm:flex-none"
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
            className="hidden sm:block px-3 md:px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm sm:flex-none"
          >
            <option value="">All Status</option>
            <option value="ONGOING">Ongoing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Mobile Filter Button - Visible only on mobile */}
          <Button
            onClick={() => setShowFilterModal(true)}
            variant="outline"
            className="sm:hidden p-2 rounded-xl border-gray-300"
          >
            <Filter size={18} className="text-gray-600" />
          </Button>
        </div>

        {/* Enquiries Table */}
        <Card>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full px-4 md:px-0">
              <Table
                columns={columns}
                data={filteredEnquiries}
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
                ]}
              />
            </div>
          </div>
        </Card>

        {/* Add/Edit Enquiry Modal */}
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Client Information</h3>
                </div>

                <div className="space-y-4">
                  <FormInput
                    label="Client Name"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    required
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                    <FormInput
                      label="Mobile"
                      value={form.mobileNumber}
                      onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                      required
                    />
                  </div>
                  <FormInput
                    label="Landline"
                    value={form.landlineNumber}
                    onChange={(e) => setForm({ ...form, landlineNumber: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="City"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                    />
                    <FormInput
                      label="Address"
                      value={form.address}
                      onChange={(e) => setForm({ ...form, address: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Occupation"
                      value={form.occupation}
                      onChange={(e) => setForm({ ...form, occupation: e.target.value })}
                    />
                    <FormInput
                      label="Company"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Property Section */}
              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
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
                  <div className="grid grid-cols-2 gap-4">
                    <FormSelect
                      label="Property Type"
                      value={form.propertyType}
                      onChange={(e) => setForm({ ...form, propertyType: e.target.value })}
                      options={[
                        { value: "Commercial", label: "Commercial" },
                        { value: "Residential", label: "Residential" },
                      ]}
                      required
                    />
                    <FormInput
                      label="Property"
                      value={form.property}
                      onChange={(e) => setForm({ ...form, property: e.target.value })}
                      placeholder="e.g., 3 BHK"
                      required
                    />
                  </div>
                  <FormInput
                    label="Area (sq ft)"
                    type="number"
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: e.target.value })}
                    required
                  />
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
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Enquiry Details</h3>
                </div>

                <div className="space-y-4">
                  <FormInput
                    label="Budget"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: e.target.value })}
                    required
                  />

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

                  <FormTextarea
                    label="Remark"
                    value={form.remark}
                    onChange={(e) => setForm({ ...form, remark: e.target.value })}
                    rows={4}
                    placeholder="Add any additional notes or remarks..."
                  />
                </div>
              </div>
            </div>
          }
          footer={
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEnquiry}
                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto"
              >
                {editingId ? "Update" : "Create"} Enquiry
              </button>
            </div>
          }
        />

      

        {/* NEW - Filter Modal (for Mobile) */}
        <Modal
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          title="Filter Enquiries"
        >
          <div className="space-y-4">
            <FormSelect
              label="Project"
              value={filters.project}
              onChange={(e) => setFilters({ ...filters, project: e.target.value })}
              options={[
                // Add "All Projects" option
                { value: "", label: "All Projects" }, 
                ...projects.map((p) => ({ value: p.projectId, label: p.projectName })),
              ]}
            />
            <FormSelect
              label="Status"
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              options={[
                // Add "All Status" option
                { value: "", label: "All Status" },
                { value: "ONGOING", label: "Ongoing" },
                { value: "COMPLETED", label: "Completed" },
                { value: "CANCELLED", label: "Cancelled" },
              ]}
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
            <Button
              onClick={() => {
                setFilters({ project: "", status: "" })
                setShowFilterModal(false)
              }}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Clear Filters
            </Button>
            <Button
              onClick={() => setShowFilterModal(false)} // Just close, state is already set
              variant="primary"
              className="w-full sm:w-auto"
            >
              Apply
            </Button>
          </div>
        </Modal>

      </div>
    </AppLayout>
  )
}
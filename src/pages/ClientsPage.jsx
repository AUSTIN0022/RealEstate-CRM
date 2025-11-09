import { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { Modal } from "../components/ui/Modal"
import { FormInput } from "../components/ui/FormInput"
import { Card } from "../components/ui/Card"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { Plus, Search, User, Briefcase, FileText, MapPin } from "lucide-react"
import { clientService } from "../services/clientService"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"
import { validateEmail, validatePhone, validatePAN, validateAadhar } from "../utils/helpers"

export default function ClientsPage() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    clientName: "",
    email: "",
    mobileNumber: "",
    dob: "",
    city: "",
    address: "",
    occupation: "",
    company: "",
    panNo: "",
    aadharNo: "",
  })

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true)
        const data = await clientService.getClientsBasicInfo()
        setClients(data || [])
      } catch (err) {
        console.error("[v0] Failed to fetch clients:", err)
        error("Failed to load clients")
      } finally {
        setLoading(false)
      }
    }

    fetchClients()
  }, [])

  const filteredClients = useMemo(() => {
    let result = clients
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.mobileNumber.includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return result
  }, [clients, searchTerm])

  const handleAddClient = async () => {
    if (!form.clientName || !form.email || !form.mobileNumber) {
      error("Please fill all required fields")
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

    if (form.panNo && !validatePAN(form.panNo)) {
      error("Invalid PAN format")
      return
    }

    if (form.aadharNo && !validateAadhar(form.aadharNo)) {
      error("Invalid Aadhar format")
      return
    }

    try {
      if (editingId) {
        await clientService.updateClient(editingId, form)
        success("Client updated successfully")
      } else {
        await clientService.createClient(form)
        success("Client created successfully")
      }

      const data = await clientService.getClientsBasicInfo()
      setClients(data || [])

      resetForm()
      setShowModal(false)
    } catch (err) {
      console.error("[v0] Failed to save client:", err)
      error("Failed to save client")
    }
  }

  const resetForm = () => {
    setForm({
      clientName: "",
      email: "",
      mobileNumber: "",
      dob: "",
      city: "",
      address: "",
      occupation: "",
      company: "",
      panNo: "",
      aadharNo: "",
    })
    setEditingId(null)
  }

  const columns = [
    { key: "clientName", label: "Name" },
    { key: "mobileNumber", label: "Mobile" },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    { key: "occupation", label: "Occupation" },
  ]

  if (loading) {
    return (
      <AppLayout>
        <SkeletonLoader type="table" count={5} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Manage all clients</p>
          </div>
          {/* <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            className="w-full sm:w-auto text-sm md:text-base"
          >
            <Plus size={20} />
            Add Client
          </Button> */}
        </div>

        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, mobile, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm"
          />
        </div>

        <Card>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full px-4 md:px-0">
              <Table
                columns={columns}
                data={filteredClients}
                onRowClick={(row) => navigate(`/clients/${row.clientId}`)}
                actions={(row) => [
                  {
                    label: "View Profile",
                    onClick: () => navigate(`/clients/${row.clientId}`),
                  },
                  {
                    label: "Edit",
                    onClick: () => {
                      setForm(row)
                      setEditingId(row.clientId)
                      setShowModal(true)
                    },
                  },
                ]}
              />
            </div>
          </div>
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            resetForm()
          }}
          title={editingId ? "Edit Client" : "Add New Client"}
          type={editingId ? "info" : "default"}
          size="4xl"
          variant="form"
          scrollBehavior="outside"
          twoColumn={true}
          columnGap="lg"
          leftColumn={
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Personal Information</h3>
                </div>

                <div className="space-y-4">
                  <FormInput
                    label="Client Name"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormInput
                      label="Email"
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />

                    <FormInput
                      label="Mobile Number"
                      value={form.mobileNumber}
                      onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                      required
                    />
                  </div>

                  <FormInput
                    label="Date of Birth"
                    type="date"
                    value={form.dob}
                    onChange={(e) => setForm({ ...form, dob: e.target.value })}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-purple-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Address Details</h3>
                </div>

                <div className="space-y-4">
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
              </div>
            </div>
          }
          rightColumn={
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Briefcase className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Professional Details</h3>
                </div>

                <div className="space-y-4">
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

              <div className="pt-6 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-amber-600" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">Document Details</h3>
                </div>

                <div className="space-y-4">
                  <FormInput
                    label="PAN Number"
                    value={form.panNo}
                    onChange={(e) => setForm({ ...form, panNo: e.target.value.toUpperCase() })}
                    placeholder="ABCDE1234F"
                  />

                  <FormInput
                    label="Aadhar Number"
                    value={form.aadharNo}
                    onChange={(e) => setForm({ ...form, aadharNo: e.target.value })}
                    placeholder="123456789012"
                  />
                </div>

                <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-700">
                    <span className="font-semibold">Note:</span> Document details are optional but recommended for
                    compliance purposes.
                  </p>
                </div>
              </div>

              {editingId && (
                <div className="pt-6 border-t border-gray-200">
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                    <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Client Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Client ID</span>
                        <span className="font-medium text-gray-900 font-mono text-xs">{editingId.slice(0, 8)}...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          }
          footer={
            <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
              <Button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                variant="outline"
                size="md"
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button onClick={handleAddClient} size="md" className="w-full sm:w-auto">
                {editingId ? "Update" : "Create"} Client
              </Button>
            </div>
          }
        />
      </div>
    </AppLayout>
  )
}

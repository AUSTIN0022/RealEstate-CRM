"use client"

import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { Modal } from "../components/ui/Modal"
import { FormInput } from "../components/ui/FormInput"
import { Card } from "../components/ui/Card"
import { Tabs } from "../components/ui/Tabs"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { Plus, Search } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { validateEmail, validatePhone, validatePAN, validateAadhar } from "../utils/helpers"

export default function ClientsPage() {
  const navigate = useNavigate()
  const { data, addClient, updateClient } = useData()
  const { success, error } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState(null)

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

  const clients = useMemo(() => {
    let result = data.clients.filter((c) => !c.isDeleted)
    if (searchTerm) {
      result = result.filter(
        (c) =>
          c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.mobileNumber.includes(searchTerm) ||
          c.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }
    return result.sort((a, b) => {
      const dateA = new Date(a.createdDate || 0)
      const dateB = new Date(b.createdDate || 0)
      return dateB - dateA
    })
  }, [data.clients, searchTerm])

  const handleAddClient = () => {
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

    if (editingId) {
      updateClient(editingId, form)
      success("Client updated successfully")
    } else {
      addClient({
        clientId: uuidv4(),
        ...form,
        isDeleted: false,
      })
      success("Client created successfully")
    }

    resetForm()
    setShowModal(false)
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

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">Manage all clients</p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="primary">
            <Plus size={20} />
            Add Client
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, mobile, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          />
        </div>

        {/* Clients Table */}
        <Card>
          <Table
            columns={columns}
            data={clients}
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
        </Card>

        {/* Add/Edit Client Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false)
            resetForm()
          }}
          title={editingId ? "Edit Client" : "Add Client"}
          size="lg"
        >
          <div className="space-y-4">
            <FormInput
              label="Client Name"
              value={form.clientName}
              onChange={(e) => setForm({ ...form, clientName: e.target.value })}
              required
            />

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

            <FormInput
              label="Date of Birth"
              type="date"
              value={form.dob}
              onChange={(e) => setForm({ ...form, dob: e.target.value })}
            />

            <FormInput label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />

            <FormInput
              label="Address"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />

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

            <FormInput
              label="PAN Number"
              value={form.panNo}
              onChange={(e) => setForm({ ...form, panNo: e.target.value })}
              placeholder="ABCDE1234F"
            />

            <FormInput
              label="Aadhar Number"
              value={form.aadharNo}
              onChange={(e) => setForm({ ...form, aadharNo: e.target.value })}
              placeholder="123456789012"
            />

            <div className="flex gap-2 justify-end pt-4">
              <Button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button onClick={handleAddClient} variant="primary">
                {editingId ? "Update" : "Create"} Client
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  )
}

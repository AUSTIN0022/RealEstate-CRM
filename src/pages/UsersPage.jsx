"use client"

import { useState, useMemo } from "react"
import { useData } from "../contexts/DataContext"
import { useToast } from "../components/ui/Toast"
import { useAuth } from "../contexts/AuthContext"
import { AppLayout } from "../components/layout/AppLayout"

import { Table } from "../components/ui/Table"
import { Button  } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"
import { Modal, } from "../components/ui/Modal"
import { FormInput } from "../components/ui/FormInput"
import { FormSelect } from "../components/ui/FormSelect"
import { Drawer } from "../components/ui/Drawer"

import { Plus } from "lucide-react"

export default function UsersPage() {
  const { user } = useAuth()
  const { data } = useData()
  const { success, error } = useToast()
  const [showModal, setShowModal] = useState(false)

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    role: "EMPLOYEE",
  })

  const users = useMemo(() => {
    return data.users.filter((u) => !u.isDeleted)
  }, [data.users])

  const projects = useMemo(() => {
    return data.projects.filter((p) => !p.isDeleted)
  }, [data.projects])

  const handleAddUser = () => {
    if (!form.fullName || !form.email || !form.password) {
      error("Please fill all required fields")
      return
    }

    success("User created successfully (Demo)")
    setForm({ fullName: "", email: "", mobileNumber: "", password: "", role: "EMPLOYEE" })
    setShowModal(false)
  }

  const columns = [
    { key: "fullName", label: "Name" },
    { key: "email", label: "Email" },
    {
      key: "role",
      label: "Role",
      render: (val) => <Badge status={val === "ADMIN" ? "COMPLETED" : "ONGOING"}>{val}</Badge>,
    },
    {
      key: "enabled",
      label: "Status",
      render: (val) => <Badge variant={val ? "success" : "danger"}>{val ? "Active" : "Inactive"}</Badge>,
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1">Manage system users and agents</p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="primary">
            <Plus size={20} />
            Add Agent
          </Button>
        </div>

        {/* Users Table */}
        <Card>
          <Table
            columns={columns}
            data={users}
            actions={(row) => [
              { label: "Edit", onClick: () => {} },
              { label: "Reset Password", onClick: () => success("Password reset email sent") },
              { label: "Deactivate", onClick: () => success("User deactivated") },
            ]}
          />
        </Card>

        {/* Add User Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Agent" size="lg">
          <div className="space-y-4">
            <FormInput
              label="Full Name"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
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
            />

            <FormInput
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />

            <FormSelect
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              options={[
                { value: "ADMIN", label: "Admin" },
                { value: "EMPLOYEE", label: "Employee" },
              ]}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign Projects</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {projects.map((p) => (
                  <label key={p.projectId} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4 text-indigo-600 border-gray-300 rounded" />
                    <span className="text-sm text-gray-700">{p.projectName}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleAddUser} variant="primary">
                Create Agent
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  )
}

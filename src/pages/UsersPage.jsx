
import { useState, useEffect } from "react"
import { useData } from "../contexts/DataContext"
import { useToast } from "../components/ui/Toast"
import { useAuth } from "../contexts/AuthContext"
import { userService } from "../services/userService"
import { AppLayout } from "../components/layout/AppLayout"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"
import { Modal } from "../components/ui/Modal"
import { FormInput } from "../components/ui/FormInput"
import { FormSelect } from "../components/ui/FormSelect"
import { SkeletonLoader } from "../components/ui/SkeletonLoader";
import { Plus } from "lucide-react"

export default function UsersPage() {
  const { user } = useAuth()
  const { data } = useData()
  const { success, error } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    username: "",
    employeeName: "",
    email: "",
    mobileNumber: "",
    password: "",
    userType: "EMPLOYEE",
    projectIds: [],
  })
  const projects = data.projects || []

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await userService.getAllUsers()
        setUsers(data || [])
      } catch (err) {
        console.error("[v0] Failed to fetch users:", err)
        error("Failed to load users")
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleAddUser = async () => {
    if (!form.username || !form.employeeName || !form.email || !form.password) {
      error("Please fill all required fields")
      return
    }

    try {
      await userService.createEmployee({
        username: form.username,
        email: form.email,
        password: form.password,
        employeeName: form.employeeName,
        mobileNumber: form.mobileNumber,
        userType: form.userType,
        projectIds: form.projectIds
      })

      console.log(`ProjectID: ${form.projectIds}`);
      success("Agent created successfully")

      const data = await userService.getAllUsers()
      setUsers(data || [])

      setForm({
        username: "",
        employeeName: "",
        email: "",
        mobileNumber: "",
        password: "",
        userType: "EMPLOYEE",
        projectIds: [],
      })
      setShowModal(false)
    } catch (err) {
      console.error("[v0] Failed to create agent:", err)
      error("Failed to create agent")
    }
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

  if (loading) {
    return (
      <AppLayout>
        <SkeletonLoader type={"list"} count={5} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Users</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Manage system users and agents</p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            variant="primary"
            className="w-full sm:w-auto text-sm md:text-base"
          >
            <Plus size={20} />
            Add Agent
          </Button>
        </div>

        <Card>
          <div className="overflow-x-auto -mx-3 md:mx-0">
            <div className="inline-block min-w-full px-3 md:px-0">
              <Table columns={columns} data={users} />
            </div>
          </div>
        </Card>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Agent" size="lg">
          <div className="space-y-4 max-h-screen md:max-h-96 overflow-y-auto">
            <FormInput
              label="Username"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />

            <FormInput
              label="Employee Name"
              value={form.employeeName}
              onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
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
              value={form.userType}
              onChange={(e) => setForm({ ...form, userType: e.target.value })}
              options={[
                { value: "EMPLOYEE", label: "Employee" },
                { value: "ADMIN", label: "Admin" },
              ]}
              required
            />
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assign Projects</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {projects.map((p) => (
                  <label key={p.projectId} className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded"
                      checked={form.projectIds.includes(p.projectId)}
                      onChange={(e) => {
                        if (e.target.checked) {
                            setForm({ ...form, projectIds: [...form.projectIds, p.projectId] })
                        } else {
                            setForm({ ...form, projectIds: form.projectIds.filter(id => id !== p.projectId) })
                        }
                    }}

                    />
                    <span className="text-sm text-gray-700 truncate">{p.projectName}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 justify-end pt-4">
              <Button onClick={() => setShowModal(false)} variant="secondary" className="w-full sm:w-auto">
                Cancel
              </Button>
              <Button onClick={handleAddUser} variant="primary" className="w-full sm:w-auto">
                Create Agent
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  )
}

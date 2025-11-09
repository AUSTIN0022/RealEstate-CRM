import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { ProgressBar } from "../components/ui/ProgressBar"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"
import { Plus } from "lucide-react"
import { ROLES } from "../utils/constants"
import { formatDate } from "../utils/helpers"
import { projectService } from "../services/projectService"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"

export default function ProjectsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const isAdmin = user?.role === ROLES.ADMIN

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        console.log("Fetching projects...")
        const data = await projectService.getProjects()
        setProjects(data)
        console.log("Projects fetched:", data)
      } catch (err) {
        console.error("Failed to fetch projects:", err)
        error(err.message || "Failed to load projects")
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleDelete = async (projectId) => {
    try {
      await projectService.deleteProject(projectId)
      setProjects(projects.filter((p) => p.projectId !== projectId))
      setDeleteConfirm(null)
      success("Project deleted successfully")
    } catch (err) {
      console.error("Failed to delete project:", err)
      error(err.message || "Failed to delete project")
    }
  }

  const columns = [
    {
      key: "projectName",
      label: "Project Name",
      render: (val, row) => (
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-lg flex items-center justify-center rounded-xl flex-shrink-0">
            <span className="text-xs font-bold text-gray-600">{val.charAt(0)}</span>
          </div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900 truncate text-sm md:text-base">{val}</p>
            <p className="text-xs text-gray-600 truncate">{row.mahareraNo || "N/A"}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => <Badge status={val}>{val}</Badge>,
    },
    {
      key: "progress",
      label: "Progress",
      render: (val) => <ProgressBar value={val || 0} max={100} showLabel={true} />,
    },
    {
      key: "projectAddress",
      label: "Location",
      render: (val) => <p className="text-xs md:text-sm text-gray-600 truncate">{val}</p>,
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (val) => <span className="text-xs md:text-sm">{formatDate(val)}</span>,
    },
    {
      key: "completionDate",
      label: "Completion Date",
      render: (val) => <span className="text-xs md:text-sm">{formatDate(val)}</span>,
    },
  ]

  if (loading) {
    return (
      <AppLayout>
        <SkeletonLoader type={"table"} count={3} />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Manage all real estate projects</p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => navigate("/registration")}
              variant="primary"
              className="w-full sm:w-auto text-sm md:text-base"
            >
              <Plus size={18} />
              New Project
            </Button>
          )}
        </div>

        {/* Projects Table */}
        {projects.length > 0 ? (
          <Card>
            <div className="overflow-x-auto -mx-4 md:mx-0">
              <div className="inline-block min-w-full px-4 md:px-0">
                <Table
                  columns={columns}
                  data={projects}
                  onRowClick={(row) => navigate(`/projects/${row.projectId}`)}
                  actions={(row) => [
                    {
                      label: "View Details",
                      onClick: () => navigate(`/projects/${row.projectId}`),
                    },
                    ...(isAdmin
                      ? [
                          {
                            label: "Edit",
                            onClick: () => navigate(`/registration?edit=${row.projectId}`),
                          },
                          {
                            label: "Delete",
                            onClick: () => setDeleteConfirm(row.projectId),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
            </div>
          </Card>
        ) : (
          <EmptyState
            icon={Plus}
            title="No Projects Yet"
            message="Create your first project to get started"
            action={() => navigate("/registration")}
            actionLabel="Create Project"
          />
        )}

        {/* Delete Confirmation */}
        <ConfirmDialog
          isOpen={!!deleteConfirm}
          onClose={() => setDeleteConfirm(null)}
          onConfirm={() => handleDelete(deleteConfirm)}
          title="Delete Project"
          message="Are you sure you want to delete this project? This action cannot be undone."
          confirmText="Delete"
          isDangerous={true}
        />
      </div>
    </AppLayout>
  )
}

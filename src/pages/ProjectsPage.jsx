"use client"

import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { ProgressBar } from "../components/ui/ProgressBar"
import { ConfirmDialog } from "../components/ui/ConfirmDialog"
import { EmptyState } from "../components/ui/EmptyState"

import { Table } from "../components/ui/Table"
import { Button  } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Card } from "../components/ui/Card"

import { Plus } from "lucide-react"
import { ROLES } from "../utils/constants"
import { formatDate, generateSlug } from "../utils/helpers"

export default function ProjectsPage() {
  const navigate = useNavigate()
  const { data, deleteProject } = useData()
  const { user } = useAuth()
  const { success, error } = useToast()
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const isAdmin = user?.role === ROLES.ADMIN

  const projects = useMemo(() => {
    return data.projects.filter((p) => !p.isDeleted)
  }, [data.projects])

  const handleDelete = (projectId) => {
    deleteProject(projectId)
    setDeleteConfirm(null)
    success("Project deleted successfully")
  }

  const columns = [
    {
      key: "projectName",
      label: "Project Name",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center rounded-xl">
            <span className="text-xs font-bold text-gray-600">{val.charAt(0)}</span>
          </div>
          <div>
            <p className="font-medium text-gray-900">{val}</p>
            <p className="text-xs text-gray-600">{row.mahareraNo}</p>
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
      render: (val) => <ProgressBar value={val} max={100} showLabel={true} />,
    },
    {
      key: "projectAddress",
      label: "Location",
      render: (val) => <p className="text-sm text-gray-600">{val}</p>,
    },
    {
      key: "startDate",
      label: "Start Date",
      render: (val) => formatDate(val),
    },
    {
      key: "completionDate",
      label: "Completion Date",
      render: (val) => formatDate(val),
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
            <p className="text-gray-600 mt-1">Manage all real estate projects</p>
          </div>
          {isAdmin && (
            <Button onClick={() => navigate("/registration")} variant="primary">
              <Plus size={20} />
              New Project
            </Button>
          )}
        </div>

        {/* Projects Table */}
        {projects.length > 0 ? (
          <Card>
            <Table
              columns={columns}
              data={projects}
              onRowClick={(row) => navigate(`/projects/${generateSlug(row.projectName)}`)}
              actions={(row) => [
                {
                  label: "View Details",
                  onClick: () => navigate(`/projects/${generateSlug(row.projectName)}`),
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

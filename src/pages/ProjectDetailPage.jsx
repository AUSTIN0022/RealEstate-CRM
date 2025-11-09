import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { Card } from "../components/ui/Card"
import { Tabs } from "../components/ui/Tabs"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { Table } from "../components/ui/Table"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { formatDate } from "../utils/helpers"
import { projectService } from "../services/projectService"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { success, error } = useToast()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enquiries, setEnquiries] = useState([])

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        setLoading(true)
        console.log("Fetching project details for ID:", projectId)

        const projectData = await projectService.getProjectById(projectId)
        setProject(projectData)
        console.log("Project details fetched:", projectData)

        try {
          const enquiriesData = await projectService.getProjectEnquiries(projectId)
          setEnquiries(enquiriesData)
          console.log("Project enquiries fetched:", enquiriesData)
        } catch (err) {
          console.warn("Failed to fetch enquiries:", err)
          setEnquiries([])
        }
      } catch (err) {
        console.error("Failed to fetch project details:", err)
        error(err.message || "Failed to load project details")
      } finally {
        setLoading(false)
      }
    }

    if (projectId) {
      fetchProjectDetails()
    }
  }, [projectId])

  if (loading) {
    return (
      <AppLayout>
        <SkeletonLoader type={"stat"} count={4} />
        <SkeletonLoader type={"table"} count={5} />
      </AppLayout>
    )
  }

  if (!project) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Project not found</p>
          <Button onClick={() => navigate("/projects")} className="mt-4">
            Back to Projects
          </Button>
        </div>
      </AppLayout>
    )
  }

  const flats = project.wings?.flatMap((wing) => wing.floors?.flatMap((floor) => floor.flats || []) || []) || []

  const unitStats = {
    total: flats.length,
    vacant: flats.filter((f) => f.status === "Vacant").length,
    booked: flats.filter((f) => f.status === "Booked").length,
    registered: flats.filter((f) => f.status === "Registered").length,
  }

  const tabs = [
    {
      label: "Overview",
      content: (
        <div className="space-y-6">
          <Card>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge status={project.status} className="mt-2">
                  {project.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">{project.progress}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">{formatDate(project.startDate)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Completion Date</p>
                <p className="text-lg font-semibold text-gray-900 mt-2">{formatDate(project.completionDate)}</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900">{unitStats.total}</p>
                <p className="text-sm text-gray-600 mt-1">Total Units</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{unitStats.vacant}</p>
                <p className="text-sm text-gray-600 mt-1">Vacant</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{unitStats.booked}</p>
                <p className="text-sm text-gray-600 mt-1">Booked</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{unitStats.registered}</p>
                <p className="text-sm text-gray-600 mt-1">Registered</p>
              </div>
            </div>
          </Card>
        </div>
      ),
    },
    {
      label: "Wings & Floors",
      content: (
        <Card>
          <div className="space-y-4">
            {project.wings && project.wings.length > 0 ? (
              project.wings.map((wing) => (
                <div key={wing.wingId} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{wing.wingName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {wing.noOfFloors} floors, {wing.noOfProperties} properties
                  </p>
                  <div className="mt-3 space-y-2">
                    {wing.floors &&
                      wing.floors.map((floor) => (
                        <div key={floor.floorId} className="text-sm text-gray-700 ml-4">
                          {floor.floorName} - {floor.quantity} units
                        </div>
                      ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600">No wings data available</p>
            )}
          </div>
        </Card>
      ),
    },
    {
      label: "Enquiries",
      content: (
        <Card>
          {enquiries && enquiries.length > 0 ? (
            <Table
              columns={[
                {
                  key: "clientName",
                  label: "Client Name",
                  render: (val) => <p className="font-medium text-gray-900">{val}</p>,
                },
                {
                  key: "budget",
                  label: "Budget",
                  render: (val) => <p className="text-gray-700">{val}</p>,
                },
                {
                  key: "reference",
                  label: "Reference",
                  render: (val) => <p className="text-sm text-gray-600">{val}</p>,
                },
                {
                  key: "status",
                  label: "Status",
                  render: (val) => <Badge status={val}>{val}</Badge>,
                },
              ]}
              data={enquiries}
            />
          ) : (
            <p className="text-gray-600">No enquiries for this project</p>
          )}
        </Card>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={() => navigate("/projects")} className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{project.projectName}</h1>
              <p className="text-gray-600 mt-1 text-sm break-words">{project.projectAddress}</p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-col-reverse sm:flex-row">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              <Edit size={20} />
              Edit
            </Button>
            <Button variant="danger" className="w-full sm:w-auto">
              <Trash2 size={20} />
              Delete
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} />
      </div>
    </AppLayout>
  )
}

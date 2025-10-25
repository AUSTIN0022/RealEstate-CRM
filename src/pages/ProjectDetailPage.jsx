"use client"

import { useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import { AppLayout } from "../components/layout/AppLayout"
import { Card } from "../components/ui/Card"
import { Tabs } from "../components/ui/Tabs"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { Table } from "../components/ui/Table"
import { ArrowLeft, Edit, Trash2 } from "lucide-react"
import { generateSlug, formatDate } from "../utils/helpers"
import { FLAT_STATUS } from "../utils/constants"

export default function ProjectDetailPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { data } = useData()

  const project = useMemo(() => {
    return data.projects.find((p) => generateSlug(p.projectName) === slug && !p.isDeleted)
  }, [data.projects, slug])

  const wings = useMemo(() => {
    return data.wings.filter((w) => w.projectId === project?.projectId && !w.isDeleted)
  }, [data.wings, project])

  const floors = useMemo(() => {
    return data.floors.filter((f) => f.projectId === project?.projectId && !f.isDeleted)
  }, [data.floors, project])

  const flats = useMemo(() => {
    return data.flats.filter((f) => f.projectId === project?.projectId && !f.isDeleted)
  }, [data.flats, project])

  const amenities = useMemo(() => {
    return data.amenities.filter((a) => a.projectId === project?.projectId && !a.isDeleted)
  }, [data.amenities, project])

  const documents = useMemo(() => {
    return data.documents.filter((d) => d.projectId === project?.projectId && !d.isDeleted)
  }, [data.documents, project])

  const disbursements = useMemo(() => {
    return data.disbursements.filter((d) => d.projectId === project?.projectId && !d.isDeleted)
  }, [data.disbursements, project])

  const bankDetails = useMemo(() => {
    return data.bankDetails.filter((b) => b.projectId === project?.projectId && !b.isDeleted)
  }, [data.bankDetails, project])

  const enquiries = useMemo(() => {
    return data.enquiries.filter((e) => e.projectId === project?.projectId && !e.isDeleted)
  }, [data.enquiries, project])

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

  const unitStats = {
    total: flats.length,
    vacant: flats.filter((f) => f.status === FLAT_STATUS.VACANT).length,
    booked: flats.filter((f) => f.status === FLAT_STATUS.BOOKED).length,
    registered: flats.filter((f) => f.status === FLAT_STATUS.REGISTERED).length,
  }

  const tabs = [
    {
      label: "Overview",
      content: (
        <div className="space-y-6">
          <Card>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            {wings.map((wing) => {
              const wingFloors = floors.filter((f) => f.wingId === wing.wingId)
              return (
                <div key={wing.wingId} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{wing.wingName}</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {wing.noOfFloors} floors, {wing.noOfProperties} properties
                  </p>
                  <div className="mt-3 space-y-2">
                    {wingFloors.map((floor) => (
                      <div key={floor.floorId} className="text-sm text-gray-700 ml-4">
                        {floor.floorName} - {floor.quantity} units
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      ),
    },
    {
      label: "Banks",
      content: (
        <Card>
          {bankDetails.length > 0 ? (
            <div className="space-y-4">
              {bankDetails.map((bank) => (
                <div key={bank.bankDetailId} className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900">{bank.bankName}</h4>
                  <p className="text-sm text-gray-600 mt-1">{bank.branchName}</p>
                  <p className="text-sm text-gray-600">Contact: {bank.contactPerson}</p>
                  <p className="text-sm text-gray-600">{bank.contactNumber}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No bank details added</p>
          )}
        </Card>
      ),
    },
    {
      label: "Amenities",
      content: (
        <Card>
          <div className="flex flex-wrap gap-2">
            {amenities.length > 0 ? (
              amenities.map((amenity) => (
                <Badge key={amenity.amenityId} variant="primary">
                  {amenity.amenityName}
                </Badge>
              ))
            ) : (
              <p className="text-gray-600">No amenities added</p>
            )}
          </div>
        </Card>
      ),
    },
    {
      label: "Documents",
      content: (
        <Card>
          {documents.length > 0 ? (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.documentId}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">{doc.documentTitle}</p>
                    <p className="text-xs text-gray-600">{doc.documentType}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Download
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No documents added</p>
          )}
        </Card>
      ),
    },
    {
      label: "Disbursements",
      content: (
        <Card>
          {disbursements.length > 0 ? (
            <div className="space-y-4">
              {disbursements.map((d) => (
                <div key={d.disbursementId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{d.disbursementTitle}</h4>
                      <p className="text-sm text-gray-600">{d.description}</p>
                    </div>
                    <Badge variant="primary">{d.percentage}%</Badge>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  Total: {disbursements.reduce((sum, d) => sum + d.percentage, 0)}%
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No disbursements added</p>
          )}
        </Card>
      ),
    },
    {
      label: "Enquiries",
      content: (
        <Card>
          {enquiries.length > 0 ? (
            <Table
              columns={[
                { key: "budget", label: "Budget" },
                { key: "reference", label: "Reference" },
                { key: "status", label: "Status", render: (val) => <Badge status={val}>{val}</Badge> },
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/projects")} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{project.projectName}</h1>
              <p className="text-gray-600 mt-1">{project.projectAddress}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Edit size={20} />
              Edit
            </Button>
            <Button variant="danger">
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

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { Card } from "../components/ui/Card"
import { Tabs } from "../components/ui/Tabs"
import { Badge } from "../components/ui/Badge"
import { Button } from "../components/ui/Button"
import { Table } from "../components/ui/Table"
import { FormInput } from "../components/ui/FormInput"
import { Modal } from "../components/ui/Modal"
import { ArrowLeft, Edit, Trash2, Plus, X, Building2, FileText, Download, Eye } from "lucide-react"
import { formatDate } from "../utils/helpers"
import { projectService } from "../services/projectService"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"


import { DOCUMENT_TYPE } from "../utils/constants"

export default function ProjectDetailPage() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { success, error: toastError } = useToast()

  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  const [previewModal, setPreviewModal] = useState({ isOpen: false, doc: null, fileUrl: null })

  // Detached Lists
  const [enquiries, setEnquiries] = useState([])
  const [disbursements, setDisbursements] = useState([])
  const [amenities, setAmenities] = useState([])
  const [banks, setBanks] = useState([])
  const [documents, setDocuments] = useState([])

  // Modal/Form States
  const [isEditingBasic, setIsEditingBasic] = useState(false)
  const [basicForm, setBasicForm] = useState({})

  const [isAddingWing, setIsAddingWing] = useState(false)
  const [wingForm, setWingForm] = useState({ wingName: "", noOfFloors: 0, noOfProperties: 0, floors: [] })

  const [isAddingBank, setIsAddingBank] = useState(false)
  const [editingBankId, setEditingBankId] = useState(null)
  const [bankForm, setBankForm] = useState({ bankName: "", branchName: "", contactPerson: "", contactNumber: "" })

  const [isAddingAmenity, setIsAddingAmenity] = useState(false)
  const [editingAmenityId, setEditingAmenityId] = useState(null)
  const [amenityForm, setAmenityForm] = useState({ amenityName: "" })

  const [isAddingDocument, setIsAddingDocument] = useState(false)
  const [documentForm, setDocumentForm] = useState({ documentType: "", documentTitle: "", file: null })

  const [isEditingDisbursements, setIsEditingDisbursements] = useState(false)
  const [disbursementForm, setDisbursementForm] = useState([])

  // --- Data Fetching ---

  const fetchData = async () => {
    try {
      setLoading(true)

      const [pData, eData, dData, aData, bData, docData] = await Promise.all([
        projectService.getProjectById(projectId).catch((err) => {
          console.error("Error fetching project:", err)
          return null
        }),
        projectService.getProjectEnquiries(projectId).catch(() => []),
        projectService.getDisbursements(projectId).catch(() => []),
        projectService.getAmenitiesByProject(projectId).catch((err) => {
          console.error("Error fetching amenities:", err)
          return []
        }),
        projectService.getBanksByProject(projectId).catch((err) => {
          console.error("Error fetching banks:", err)
          return []
        }),
        projectService.getDocumentsByProject(projectId).catch((err) => {
          console.error("Error fetching documents:", err)
          return []
        }),
      ])

      if (pData) setProject(pData)
      setEnquiries(eData || [])
      setDisbursements(dData || [])
      setAmenities(aData || [])
      setBanks(bData || [])
      setDocuments(docData || [])

      if (pData) {
        setBasicForm({
          projectName: pData.projectName,
          projectAddress: pData.projectAddress,
          startDate: pData.startDate?.split("T")[0],
          completionDate: pData.completionDate?.split("T")[0],
          mahareraNo: pData.mahareraNo,
          progress: pData.progress,
        })
      }
    } catch (err) {
      console.error("Failed to load details:", err)
      toastError(err.message || "Failed to load project details")
    } finally {
      setLoading(false)
    }
  }

  // Helper to re-fetch just specific lists
  const refreshAmenities = async () => {
    try {
      const data = await projectService.getAmenitiesByProject(projectId)
      setAmenities(data || [])
    } catch (err) {
      toastError("Failed to refresh amenities")
    }
  }

  const refreshBanks = async () => {
    try {
      const data = await projectService.getBanksByProject(projectId)
      setBanks(data || [])
    } catch (err) {
      toastError("Failed to refresh banks")
    }
  }

  const refreshDocuments = async () => {
    try {
      const data = await projectService.getDocumentsByProject(projectId)
      setDocuments(data || [])
    } catch (err) {
      toastError("Failed to refresh documents")
    }
  }

  useEffect(() => {
    if (projectId) {
      fetchData()
    }
  }, [projectId])

  // --- Handlers: Basic Info & Wings (Unchanged Logic) ---
  const handleUpdateBasicInfo = async () => {
    try {
      await projectService.updateProject(projectId, basicForm)
      success("Project info updated")
      setIsEditingBasic(false)
      fetchData()
    } catch (err) {
      toastError("Update failed")
    }
  }

  const handleCreateWing = async () => {
    try {
      let floorsPayload = wingForm.floors
      if (!floorsPayload || floorsPayload.length === 0) {
        const floorsCount = Number.parseInt(wingForm.noOfFloors) || 1
        const propsCount = Number.parseInt(wingForm.noOfProperties) || 1
        const propsPerFloor = Math.max(1, Math.floor(propsCount / floorsCount))
        floorsPayload = Array.from({ length: floorsCount }, (_, i) => ({
          floorNo: i,
          floorName: i === 0 ? "Ground Floor" : `Floor ${i}`,
          propertyType: "Residential",
          property: "",
          area: 0,
          quantity: propsPerFloor,
        }))
      }
      const payload = {
        wingName: wingForm.wingName,
        noOfFloors: Number.parseInt(wingForm.noOfFloors),
        noOfProperties: Number.parseInt(wingForm.noOfProperties),
        floors: floorsPayload,
      }
      await projectService.createWing(projectId, payload)
      success("Wing created")
      setIsAddingWing(false)
      setWingForm({ wingName: "", noOfFloors: 0, noOfProperties: 0, floors: [] })
      fetchData()
    } catch (err) {
      toastError("Failed to create wing")
    }
  }

  // --- Handlers: Bank Info ---

  const handleSaveBank = async () => {
    try {
      if (!bankForm.bankName || !bankForm.branchName) {
        toastError("Please fill all required fields")
        return
      }

      if (editingBankId) {
        await projectService.updateBankInfo(editingBankId, bankForm)
        success("Bank info updated")
      } else {
        await projectService.createBankInfo(projectId, bankForm)
        success("Bank added")
      }
      setIsAddingBank(false)
      setEditingBankId(null)
      setBankForm({ bankName: "", branchName: "", contactPerson: "", contactNumber: "" })
      await refreshBanks()
    } catch (err) {
      console.error("Error saving bank:", err)
      toastError("Failed to save bank info")
    }
  }

  const handleDeleteBank = async (id) => {
    if (!window.confirm("Delete this bank info?")) return
    try {
      await projectService.deleteBankInfo(id)
      success("Bank deleted")
      await refreshBanks()
    } catch (err) {
      console.error("Error deleting bank:", err)
      toastError("Failed to delete bank")
    }
  }

  // --- Handlers: Amenities ---

  const handleSaveAmenity = async () => {
    try {
      if (!amenityForm.amenityName) {
        toastError("Please enter amenity name")
        return
      }

      if (editingAmenityId) {
        await projectService.updateAmenity(editingAmenityId, amenityForm)
        success("Amenity updated")
      } else {
        await projectService.createAmenity(projectId, amenityForm)
        success("Amenity added")
      }
      setIsAddingAmenity(false)
      setEditingAmenityId(null)
      setAmenityForm({ amenityName: "" })
      await refreshAmenities()
    } catch (err) {
      console.error("Error saving amenity:", err)
      toastError("Failed to save amenity")
    }
  }

  const handleDeleteAmenity = async (id) => {
    if (!window.confirm("Delete this amenity?")) return
    try {
      await projectService.deleteAmenity(id)
      success("Amenity deleted")
      await refreshAmenities()
    } catch (err) {
      console.error("Error deleting amenity:", err)
      toastError("Failed to delete amenity")
    }
  }

  // --- Handlers: Documents ---

  const handleCreateDocument = async () => {
    if (!documentForm.file || !documentForm.documentTitle || !documentForm.documentType) {
      toastError("Please fill all fields and select a file")
      return
    }

    try {
      await projectService.createDocument(projectId, documentForm)
        success("Document uploaded successfully")
        setIsAddingDocument(false)
        setDocumentForm({ documentType: "", documentTitle: "", file: null })
        await refreshDocuments()
    } catch (err) {
      console.error("Error uploading document:", err)
      toastError("Failed to upload document")
    }
  }

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return
    try {
      await projectService.deleteDocument(id)
      success("Document deleted")
      await refreshDocuments()
    } catch (err) {
      console.error("Error deleting document:", err)
      toastError("Failed to delete document")
    }
  }

  const handlePreviewDocument = async (doc) => {
    try {
      const fileUrl = `https://realestate.ysminfosolution.com/api/documents/${doc.id || doc.documentId}`
      const fileType = doc.fileName?.split(".").pop()?.toLowerCase() || "pdf"

      setPreviewModal({
        isOpen: true,
        doc: doc,
        fileUrl: fileUrl,
        fileType: fileType,
      })
    } catch (err) {
      toastError("Failed to load preview")
    }
  }

  const handleDownloadDocument = async (doc) => {
    try {
      const path = doc.filePath || doc.path || `documents/${doc.id}`
      await projectService.downloadDocument(path)
    } catch (e) {
      console.error("Download error:", e)
      toastError("Download failed")
    }
  }

  // --- Render Helpers ---

  if (loading) {
    return (
      <AppLayout>
        <SkeletonLoader type={"stat"} count={4} />
        <SkeletonLoader type={"table"} count={5} />
      </AppLayout>
    )
  }

  if (!project)
    return (
      <AppLayout>
        <div>Project not found</div>
      </AppLayout>
    )

  const tabs = [
    {
      label: "Overview",
      content: (
        <div className="space-y-6">
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Basic Details</h3>
              {!isEditingBasic ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditingBasic(true)}>
                  <Edit size={16} className="mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingBasic(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleUpdateBasicInfo}>
                    Save
                  </Button>
                </div>
              )}
            </div>

            {isEditingBasic ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Project Name</label>
                  <FormInput
                    value={basicForm.projectName}
                    onChange={(e) => setBasicForm({ ...basicForm, projectName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <FormInput
                    value={basicForm.projectAddress}
                    onChange={(e) => setBasicForm({ ...basicForm, projectAddress: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date</label>
                  <FormInput
                    type="date"
                    value={basicForm.startDate}
                    onChange={(e) => setBasicForm({ ...basicForm, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Completion Date</label>
                  <FormInput
                    type="date"
                    value={basicForm.completionDate}
                    onChange={(e) => setBasicForm({ ...basicForm, completionDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">MahaRERA No</label>
                  <FormInput
                    value={basicForm.mahareraNo}
                    onChange={(e) => setBasicForm({ ...basicForm, mahareraNo: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Progress (%)</label>
                  <FormInput
                    type="number"
                    value={basicForm.progress}
                    onChange={(e) => setBasicForm({ ...basicForm, progress: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-sm text-gray-500">MahaRERA</p>
                  <p className="font-medium">{project.mahareraNo || "N/A"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{formatDate(project.startDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completion</p>
                  <p className="font-medium">{formatDate(project.completionDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <span className="text-sm font-medium">{project.progress}%</span>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      ),
    },
    {
      label: "Wings",
      content: (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => setIsAddingWing(true)}>
              <Plus size={18} className="mr-2" /> Add Wing
            </Button>
          </div>

          {isAddingWing && (
            <Card className="mb-4 border-blue-200 bg-blue-50">
              <h4 className="font-semibold mb-3">New Wing Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <FormInput
                  placeholder="Wing Name (e.g. Wing A)"
                  value={wingForm.wingName}
                  onChange={(e) => setWingForm({ ...wingForm, wingName: e.target.value })}
                />
                <FormInput
                  type="number"
                  placeholder="No. of Floors"
                  value={wingForm.noOfFloors}
                  onChange={(e) => setWingForm({ ...wingForm, noOfFloors: e.target.value })}
                />
                <FormInput
                  type="number"
                  placeholder="Total Properties"
                  value={wingForm.noOfProperties}
                  onChange={(e) => setWingForm({ ...wingForm, noOfProperties: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsAddingWing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateWing}>Create Wing</Button>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.wings?.map((wing) => (
              <Card key={wing.id || wing.wingId} className="hover:shadow-md transition-shadow">
                <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 size={20} className="text-blue-600" /> {wing.wingName}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {wing.noOfFloors} Floors • {wing.noOfProperties} Properties
                </p>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      label: "Bank Info",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Approved Banks</h3>
            <Button
              onClick={() => {
                setEditingBankId(null)
                setBankForm({ bankName: "", branchName: "", contactPerson: "", contactNumber: "" })
                setIsAddingBank(true)
              }}
            >
              <Plus size={18} className="mr-2" /> Add Bank
            </Button>
          </div>

          {isAddingBank && (
            <Card className="mb-4 bg-gray-50">
              <h4 className="font-semibold mb-3">{editingBankId ? "Edit Bank" : "Add New Bank"}</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <FormInput
                  placeholder="Bank Name *"
                  value={bankForm.bankName}
                  onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                />
                <FormInput
                  placeholder="Branch Name *"
                  value={bankForm.branchName}
                  onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                />
                <FormInput
                  placeholder="Contact Person"
                  value={bankForm.contactPerson}
                  onChange={(e) => setBankForm({ ...bankForm, contactPerson: e.target.value })}
                />
                <FormInput
                  placeholder="Contact Number"
                  value={bankForm.contactNumber}
                  onChange={(e) => setBankForm({ ...bankForm, contactNumber: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsAddingBank(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveBank}>Save Bank</Button>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {banks && banks.length > 0 ? (
              banks.map((bank) => (
                <Card key={bank.id || bank.bankInfoId}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">{bank.bankName}</h4>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setBankForm({
                            bankName: bank.bankName,
                            branchName: bank.branchName,
                            contactPerson: bank.contactPerson,
                            contactNumber: bank.contactNumber,
                          })
                          setEditingBankId(bank.id || bank.bankInfoId)
                          setIsAddingBank(true)
                        }}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteBank(bank.id || bank.bankInfoId)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{bank.branchName}</p>
                  <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
                    <p>
                      <span className="font-medium">Person:</span> {bank.contactPerson || "N/A"}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span> {bank.contactNumber || "N/A"}
                    </p>
                  </div>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                No banks added yet.
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      label: "Amenities",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Project Amenities</h3>
            <Button
              onClick={() => {
                setEditingAmenityId(null)
                setAmenityForm({ amenityName: "" })
                setIsAddingAmenity(true)
              }}
            >
              <Plus size={18} className="mr-2" /> Add Amenity
            </Button>
          </div>

          {isAddingAmenity && (
            <Card className="mb-4 bg-green-50 border-green-100">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1 w-full">
                  <label className="text-sm font-medium mb-1 block">Amenity Name</label>
                  <FormInput
                    value={amenityForm.amenityName}
                    onChange={(e) => setAmenityForm({ ...amenityForm, amenityName: e.target.value })}
                    placeholder="e.g. Swimming Pool, Gym"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button className="flex-1 sm:flex-none" onClick={handleSaveAmenity}>
                    Save
                  </Button>
                  <Button variant="ghost" className="flex-1 sm:flex-none" onClick={() => setIsAddingAmenity(false)}>
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {amenities && amenities.length > 0 ? (
              amenities.map((amenity) => (
                <div
                  key={amenity.id || amenity.amenityId}
                  className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <span className="font-medium text-gray-800">{amenity.amenityName}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        setEditingAmenityId(amenity.id || amenity.amenityId)
                        setAmenityForm({ amenityName: amenity.amenityName })
                        setIsAddingAmenity(true)
                      }}
                      className="p-1 text-gray-500 hover:text-blue-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteAmenity(amenity.id || amenity.amenityId)}
                      className="p-1 text-gray-500 hover:text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                No amenities listed.
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      label: "Documents",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Project Documents</h3>
            <Button onClick={() => setIsAddingDocument(true)}>
              <Plus size={18} className="mr-2" /> Upload Document
            </Button>
          </div>

          {isAddingDocument && (
            <Card className="mb-4 bg-gray-50">
              <h4 className="font-semibold mb-3">Upload New Document</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="text-sm mb-1 block">Document Type</label>

                <select
                    className="w-full border rounded p-2 text-sm bg-white"
                    value={documentForm.documentType}
                    onChange={(e) => setDocumentForm({ ...documentForm, documentType: e.target.value })}
                    >
                    <option value="">Select Document Type</option>

                    {Object.keys(DOCUMENT_TYPE).map((key) => (
                        <option key={key} value={DOCUMENT_TYPE[key]}>
                        {DOCUMENT_TYPE[key]}
                        </option>
                    ))}
                </select>


                </div>
                <div>
                  <label className="text-sm mb-1 block">Title</label>
                  <FormInput
                    placeholder="e.g. Area Chart"
                    value={documentForm.documentTitle}
                    onChange={(e) => setDocumentForm({ ...documentForm, documentTitle: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm mb-1 block">File</label>
                  <input
                    type="file"
                    className="w-full border rounded p-2 bg-white text-sm"
                    onChange={(e) => setDocumentForm({ ...documentForm, file: e.target.files[0] })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsAddingDocument(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateDocument}>Upload</Button>
              </div>
            </Card>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documents && documents.length > 0 ? (
                  documents.map((doc, idx) => (
                    <tr key={doc.id || idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                        <FileText size={16} className="text-blue-500" /> {doc.documentType}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{doc.documentTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                        <button
                          onClick={() => handlePreviewDocument(doc)}
                          className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-1"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleDownloadDocument(doc)}
                          className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                          title="Download"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No documents uploaded.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <Modal
            isOpen={previewModal.isOpen}
            onClose={() => setPreviewModal({ isOpen: false, doc: null, fileUrl: null })}
            title={`Preview: ${previewModal.doc?.documentTitle || "Document"}`}
            size="3xl"
          >
            <div className="flex flex-col items-center justify-center min-h-96 bg-gray-50 rounded-lg">
              {previewModal.fileType === "pdf" ? (
                <iframe src={previewModal.fileUrl} className="w-full h-96 border-0" title="PDF Preview" />
              ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(previewModal.fileType) ? (
                <img
                  src={previewModal.fileUrl || "/placeholder.svg"}
                  alt="Document preview"
                  className="max-w-full max-h-96 object-contain"
                />
              ) : (
                <div className="text-center">
                  <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Preview not available for this file type</p>
                  <Button className="mt-4" onClick={() => handleDownloadDocument(previewModal.doc)}>
                    Download Instead
                  </Button>
                </div>
              )}
            </div>
          </Modal>
        </div>
      ),
    },
    {
      label: "Payment Stages",
      content: (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Payment Stages</h3>
            {!isEditingDisbursements && (
              <Button
                onClick={() => {
                  setDisbursementForm(
                    disbursements.length ? disbursements : [{ disbursementTitle: "", description: "", percentage: "" }],
                  )
                  setIsEditingDisbursements(true)
                }}
              >
                <Edit size={18} className="mr-2" /> Edit Stages
              </Button>
            )}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {disbursements && disbursements.length > 0 ? (
                  disbursements.map((d, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{d.disbursementTitle}</td>
                      <td className="px-6 py-4 text-gray-500">{d.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-blue-600">
                        {d.percentage}%
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                      No payment stages defined.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
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
                { key: "budget", label: "Budget", render: (val) => <p className="text-gray-700">{val}</p> },
                { key: "status", label: "Status", render: (val) => <Badge status={val}>{val}</Badge> },
              ]}
              data={enquiries}
            />
          ) : (
            <div className="text-center py-8 text-gray-500">No enquiries for this project</div>
          )}
        </Card>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <button onClick={() => navigate("/projects")} className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
              <ArrowLeft size={24} className="text-gray-600" />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">{project.projectName}</h1>
              <p className="text-gray-600 mt-1 text-sm break-words flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
                {project.projectAddress}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto flex-col-reverse sm:flex-row">
            <Button
              variant="danger"
              className="w-full sm:w-auto"
              onClick={async () => {
                if (window.confirm("Are you sure? This cannot be undone.")) {
                  await projectService.deleteProject(projectId)
                  navigate("/projects")
                }
              }}
            >
              <Trash2 size={20} />
              Delete Project
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} />
      </div>
    </AppLayout>
  )
}

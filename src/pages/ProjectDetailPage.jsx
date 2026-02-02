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
import { SkeletonLoader } from "../components/ui/SkeletonLoader"
import {
    ArrowLeft,
    Edit,
    Trash2,
    Plus,
    X,
    Building2,
    FileText,
    Download,
    Eye,
} from "lucide-react"
import { formatDate } from "../utils/helpers"
import { projectService } from "../services/projectService"
import { DOCUMENT_TYPE } from "../utils/constants"
import { v4 as uuidv4 } from "uuid"

// Import the WingModal from the Registration folder (Adjust path if necessary)
import WingModal from "./Registration/modals/WingModal"

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

    // --- Modal/Form States ---

    // Basic Info
    const [isEditingBasic, setIsEditingBasic] = useState(false)
    const [basicForm, setBasicForm] = useState({})

    // --- WINGS STATE (Complex Modal Logic) ---
    const [wingModalOpen, setWingModalOpen] = useState(false)
    const [viewWingModalOpen, setViewWingModalOpen] = useState(false)
    const [selectedWing, setSelectedWing] = useState(null) // For Viewing

    // Wing Form State (Matches WingModal requirements)
    const [wingForm, setWingForm] = useState({
        wingId: null,
        wingName: "",
        noOfFloors: "",
        manualFloorEntry: false,
    })

    // Floors State for Wing Modal
    const [currentWingFloors, setCurrentWingFloors] = useState([])
    const [floorInput, setFloorInput] = useState({
        floorNo: "", floorName: "", propertyType: "", property: "", area: "", quantity: ""
    })
    const [editingFloorIndex, setEditingFloorIndex] = useState(-1)

    // Banks
    const [isAddingBank, setIsAddingBank] = useState(false)
    const [editingBankId, setEditingBankId] = useState(null)
    const [bankForm, setBankForm] = useState({
        bankName: "",
        branchName: "",
        contactPerson: "",
        contactNumber: "",
    })

    // Amenities
    const [isAddingAmenity, setIsAddingAmenity] = useState(false)
    const [editingAmenityId, setEditingAmenityId] = useState(null)
    const [amenityForm, setAmenityForm] = useState({ amenityName: "" })

    // Documents
    const [isAddingDocument, setIsAddingDocument] = useState(false)
    const [documentForm, setDocumentForm] = useState({
        documentType: "",
        documentTitle: "",
        file: null,
    })

    // Disbursements
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
                projectService.getAmenitiesByProject(projectId).catch(() => []),
                projectService.getBanksByProject(projectId).catch(() => []),
                projectService.getDocumentsByProject(projectId).catch(() => []),
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

    const refreshBanks = async () => {
        try {
            const data = await projectService.getBanksByProject(projectId)
            setBanks(data || [])
        } catch (err) {
            toastError("Failed to refresh banks")
        }
    }

    const refreshAmenities = async () => {
        try {
            const data = await projectService.getAmenitiesByProject(projectId)
            setAmenities(data || [])
        } catch (err) {
            toastError("Failed to refresh amenities")
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

    // --- Handlers: Basic Info ---
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

    // --- HANDLERS: WINGS (Complex Logic) ---

    // 1. Auto-generate floors if manual entry is off
    useEffect(() => {
        if (wingModalOpen && !wingForm.manualFloorEntry && wingForm.noOfFloors && currentWingFloors.length === 0) {
            const count = parseInt(wingForm.noOfFloors) || 0
            const autoFloors = []
            for (let i = 0; i <= count; i++) {
                autoFloors.push({
                    floorNo: i.toString(),
                    floorName: i === 0 ? "Ground Floor" : `Floor ${i}`,
                    propertyType: "Residential",
                    property: "2 BHK",
                    area: "0",
                    quantity: "0"
                })
            }
            setCurrentWingFloors(autoFloors)
        }
    }, [wingForm.noOfFloors, wingForm.manualFloorEntry, wingModalOpen])

    // 2. Open Modal for Create
    const openAddWingModal = () => {
        setWingForm({ wingId: null, wingName: "", noOfFloors: "", manualFloorEntry: false })
        setCurrentWingFloors([])
        setFloorInput({ floorNo: "", floorName: "", propertyType: "", property: "", area: "", quantity: "" })
        setEditingFloorIndex(-1)
        setWingModalOpen(true)
    }

    // 3. Open Modal for Edit
    const openEditWingModal = (wing) => {
        setWingForm({
            wingId: wing.id || wing.wingId,
            wingName: wing.wingName,
            noOfFloors: wing.noOfFloors,
            manualFloorEntry: true // Set true to show the table immediately
        })
        // Deep copy floors to avoid mutating directly
        setCurrentWingFloors(wing.floors ? JSON.parse(JSON.stringify(wing.floors)) : [])
        setWingModalOpen(true)
    }

    // 4. Floor Row Handlers (Passed to WingModal)
    const handleAddOrUpdateFloorRow = () => {
        if (!floorInput.floorName) { toastError("Floor Name is required"); return }

        const newFloorData = { ...floorInput }
        // Auto-assign floorNo if missing
        if (newFloorData.floorNo === "" || newFloorData.floorNo === undefined) {
            newFloorData.floorNo = editingFloorIndex >= 0
                ? currentWingFloors[editingFloorIndex].floorNo
                : currentWingFloors.length.toString()
        }

        if (editingFloorIndex >= 0) {
            const updatedFloors = [...currentWingFloors]
            updatedFloors[editingFloorIndex] = newFloorData
            setCurrentWingFloors(updatedFloors)
            setEditingFloorIndex(-1)
            success("Floor updated")
        } else {
            setCurrentWingFloors([...currentWingFloors, newFloorData])
        }
        setFloorInput({ floorNo: "", floorName: "", propertyType: "", property: "", area: "", quantity: "" })
    }

    const handleEditFloorRow = (index) => {
        setFloorInput(currentWingFloors[index])
        setEditingFloorIndex(index)
    }

    const handleDeleteFloorRow = (index) => {
        const updated = currentWingFloors.filter((_, i) => i !== index)
        setCurrentWingFloors(updated)
        if (editingFloorIndex === index) {
            setEditingFloorIndex(-1)
            setFloorInput({ floorNo: "", floorName: "", propertyType: "", property: "", area: "", quantity: "" })
        }
    }

    // 5. Save Wing (Create or Update)
    const handleSaveWing = async () => {
        if (!wingForm.wingName) { toastError("Wing Name is required"); return }
        if (currentWingFloors.length === 0) { toastError("Please add at least one floor"); return }

        try {
            const totalProps = currentWingFloors.reduce((sum, floor) => sum + (parseInt(floor.quantity) || 0), 0)

            const payload = {
                wingName: wingForm.wingName,
                noOfFloors: parseInt(wingForm.noOfFloors) || 0,
                noOfProperties: totalProps,
                floors: currentWingFloors.map(f => ({
                    ...f,
                    floorNo: parseInt(f.floorNo) || 0,
                    quantity: parseInt(f.quantity) || 0
                }))
            }

            if (wingForm.wingId) {
                // Update
                await projectService.updateWing(wingForm.wingId, payload)
                success("Wing updated successfully")
            } else {
                // Create
                await projectService.createWing(projectId, payload)
                success("Wing created successfully")
            }

            setWingModalOpen(false)
            fetchData() // Refresh project data
        } catch (err) {
            console.error(err)
            toastError("Failed to save wing")
        }
    }

    const handleDeleteWing = async (id) => {
        if (!window.confirm("Delete this wing? All associated properties will be deleted.")) return
        try {
            await projectService.deleteWing(id)
            success("Wing deleted")
            fetchData()
        } catch (err) {
            toastError("Failed to delete wing")
        }
    }

    const openViewWingModal = (wing) => {
        setSelectedWing(wing)
        setViewWingModalOpen(true)
    }

    // --- Handlers: Bank Info (FIXED) ---

    const handleSaveBank = async () => {
        try {
            if (!bankForm.bankName || !bankForm.branchName) {
                toastError("Please fill all required fields")
                return
            }

            if (editingBankId) {
                // FIXED: Use bankProjectId for updates
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
            toastError("Failed to delete bank")
        }
    }

    // --- Handlers: Amenities ---
    const handleSaveAmenity = async () => {
        try {
            if (!amenityForm.amenityName) { toastError("Please enter amenity name"); return }

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
            toastError("Failed to delete document")
        }
    }

    const handlePreviewDocument = async (doc) => {
        try {
            const fileUrl = `${import.meta.env.VITE_API_URL}/documents/${doc.id || doc.documentId
                }`
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
                <div className="p-4 text-center">Project not found</div>
            </AppLayout>
        )

    const tabs = [
        {
            label: "Overview",
            content: (
                <div className="space-y-6">
                    {/* Key Metrics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Total Properties */}
                        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Total Properties</p>
                                    <p className="text-3xl font-bold text-blue-900 mt-1">
                                        {project?.totalProperties || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-blue-200 rounded-lg">
                                    <Building2 size={24} className="text-blue-700" />
                                </div>
                            </div>
                        </Card>

                        {/* Properties Booked */}
                        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600">Properties Booked</p>
                                    <p className="text-3xl font-bold text-green-900 mt-1">
                                        {project?.propertiesBooked || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-green-200 rounded-lg">
                                    <Building2 size={24} className="text-green-700" />
                                </div>
                            </div>
                        </Card>

                        {/* Properties Available */}
                        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Properties Available</p>
                                    <p className="text-3xl font-bold text-purple-900 mt-1">
                                        {project?.propertiesAvailable || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-purple-200 rounded-lg">
                                    <Building2 size={24} className="text-purple-700" />
                                </div>
                            </div>
                        </Card>

                        {/* Total Enquiries */}
                        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-600">Total Enquiries</p>
                                    <p className="text-3xl font-bold text-orange-900 mt-1">
                                        {project?.totalEnquiries || 0}
                                    </p>
                                    <p className="text-xs text-orange-600 mt-1">
                                        Cancelled: {project?.cancelledEnquiries || 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-200 rounded-lg">
                                    <FileText size={24} className="text-orange-700" />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Basic Details Section */}
                    <Card>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
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
                                        onChange={(e) =>
                                            setBasicForm({ ...basicForm, projectName: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Address</label>
                                    <FormInput
                                        value={basicForm.projectAddress}
                                        onChange={(e) =>
                                            setBasicForm({ ...basicForm, projectAddress: e.target.value })
                                        }
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
                                        onChange={(e) =>
                                            setBasicForm({ ...basicForm, completionDate: e.target.value })
                                        }
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
                                            <div
                                                className="bg-blue-600 h-2.5 rounded-full"
                                                style={{ width: `${project.progress}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-medium">{project.progress}%</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    {/* Wings Overview */}
                    {project?.wings && project.wings.length > 0 && (
                        <Card>
                            <h3 className="text-lg font-semibold mb-4">Wings Overview</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {project.wings.map((wing) => (
                                    <div
                                        key={wing.wingId}
                                        className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow bg-white"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                                <Building2 size={18} className="text-blue-600" />
                                                {wing.wingName}
                                            </h4>
                                            <Badge status="active" className="text-xs">
                                                {wing.noOfFloors + 1} Floors
                                            </Badge>
                                        </div>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Total Properties:</span>
                                                <span className="font-medium text-gray-900">{wing.noOfProperties}</span>
                                            </div>
                                            {wing.floors && (
                                                <div className="text-xs text-gray-500 mt-2 pt-2 border-t">
                                                    {wing.floors.length} floor{wing.floors.length !== 1 ? "s" : ""}{" "}
                                                    configured
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}

                    {/* Project Status */}
                    <Card>
                        <h3 className="text-lg font-semibold mb-4">Project Status</h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <Badge
                                status={
                                    project?.status === "UPCOMING"
                                        ? "pending"
                                        : project?.status === "ONGOING"
                                            ? "active"
                                            : "completed"
                                }
                                className="text-sm px-4 py-2"
                            >
                                {project?.status || "N/A"}
                            </Badge>
                            {project?.progress !== undefined && (
                                <div className="flex-1 w-full sm:max-w-md">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Overall Progress</span>
                                        <span className="font-semibold text-gray-900">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div
                                            className="bg-blue-600 h-3 rounded-full transition-all"
                                            style={{ width: `${project.progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            ),
        },
        {
            label: "Wings",
            content: (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Wings Configuration</h3>
                        <Button onClick={openAddWingModal} className="w-full sm:w-auto">
                            <Plus size={18} className="mr-2" /> Add Wing
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {project.wings?.map((wing) => (
                            <Card
                                key={wing.id || wing.wingId}
                                className="hover:shadow-md transition-shadow relative"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                            <Building2 size={20} className="text-blue-600" /> {wing.wingName}
                                        </h4>
                                        <p className="text-sm text-gray-600 mt-2">
                                            <span className="font-semibold">{wing.noOfFloors}</span> Floors
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <span className="font-semibold">{wing.noOfProperties}</span> Total
                                            Properties
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openViewWingModal(wing)}
                                            className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"
                                            title="View Details"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => openEditWingModal(wing)}
                                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                            title="Edit Wing"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteWing(wing.id || wing.wingId)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                            title="Delete Wing"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                        {(!project.wings || project.wings.length === 0) && (
                            <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg border border-dashed text-gray-500">
                                No wings added yet. Click "Add Wing" to get started.
                            </div>
                        )}
                    </div>

                    {/* New Complex Wing Modal */}
                    <WingModal
                        isOpen={wingModalOpen}
                        onClose={() => setWingModalOpen(false)}
                        onSave={handleSaveWing}
                        wingForm={wingForm} setWingForm={setWingForm}
                        floorInput={floorInput} setFloorInput={setFloorInput}
                        currentWingFloors={currentWingFloors} editingFloorIndex={editingFloorIndex}
                        onAddFloor={handleAddOrUpdateFloorRow} onEditFloor={handleEditFloorRow} onDeleteFloor={handleDeleteFloorRow}
                    />

                    {/* Wing View Modal */}
                    <Modal
                        isOpen={viewWingModalOpen}
                        onClose={() => setViewWingModalOpen(false)}
                        title={`Details: ${selectedWing?.wingName || "Wing"}`}
                        size="lg"
                    >
                        {selectedWing ? (
                            <div className="space-y-4">
                                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 mx-2">
                                        <p className="text-xs text-gray-500 uppercase">Floors</p>
                                        <p className="text-md font-semibold">{selectedWing.noOfFloors}</p>
                                    </div>
                                    <div className="flex items-center gap-3 mx-2">
                                        <p className="text-xs text-gray-500 uppercase">Properties</p>
                                        <p className="text-md font-semibold">{selectedWing.noOfProperties}</p>
                                    </div>
                                </div>

                                {selectedWing.floors && selectedWing.floors.length > 0 ? (
                                    <div className="max-h-60 overflow-y-auto border rounded">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-gray-100 sticky top-0">
                                                <tr>
                                                    <th className="p-2 border-b">Floor</th>
                                                    <th className="p-2 border-b">Type</th>
                                                    <th className="p-2 border-b">Property</th>
                                                    <th className="p-2 border-b">Area</th>
                                                    <th className="p-2 border-b">Qty</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {selectedWing.floors.map((f, idx) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="p-2">{f.floorName}</td>
                                                        <td className="p-2">{f.propertyType}</td>
                                                        <td className="p-2">{f.property}</td>
                                                        <td className="p-2">{f.area}</td>
                                                        <td className="p-2">{f.quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 text-center">No floor details available.</p>
                                )}
                            </div>
                        ) : (
                            <></>
                        )}
                    </Modal>
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
                                setBankForm({
                                    bankName: "",
                                    branchName: "",
                                    contactPerson: "",
                                    contactNumber: "",
                                })
                                setIsAddingBank(true)
                            }}
                        >
                            <Plus size={18} className="mr-2" /> Add Bank
                        </Button>
                    </div>

                    {isAddingBank && (
                        <Card className="mb-4 bg-gray-50">
                            <h4 className="font-semibold mb-3">
                                {editingBankId ? "Edit Bank Details" : "Add New Bank"}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <FormInput
                                    label="Bank Name *"
                                    value={bankForm.bankName}
                                    onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
                                />
                                <FormInput
                                    label="Branch Name *"
                                    value={bankForm.branchName}
                                    onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })}
                                />
                                <FormInput
                                    label="Contact Person"
                                    value={bankForm.contactPerson}
                                    onChange={(e) => setBankForm({ ...bankForm, contactPerson: e.target.value })}
                                />
                                <FormInput
                                    label="Contact Number"
                                    value={bankForm.contactNumber}
                                    onChange={(e) => setBankForm({ ...bankForm, contactNumber: e.target.value })}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button variant="ghost" onClick={() => setIsAddingBank(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSaveBank}>
                                    {editingBankId ? "Update Bank" : "Save Bank"}
                                </Button>
                            </div>
                        </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {banks && banks.length > 0 ? (
                            banks.map((bank) => (
                                <Card key={bank.bankProjectId || bank.id}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-lg">{bank.bankName}</h4>
                                        <div className="flex gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    // FIX: Capture the specific bankProjectId for updates
                                                    const idToEdit = bank.bankProjectId
                                                    if (!idToEdit) {
                                                        toastError("Error: Bank ID missing")
                                                        return
                                                    }
                                                    setEditingBankId(idToEdit)
                                                    setBankForm({
                                                        bankName: bank.bankName,
                                                        branchName: bank.branchName,
                                                        contactPerson: bank.contactPerson || "",
                                                        contactNumber: bank.contactNumber || "",
                                                    })
                                                    setIsAddingBank(true)
                                                }}
                                            >
                                                <Edit size={16} />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-500 hover:text-red-700"
                                                onClick={() => handleDeleteBank(bank.bankProjectId)}
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
                                        onChange={(e) =>
                                            setAmenityForm({ ...amenityForm, amenityName: e.target.value })
                                        }
                                        placeholder="e.g. Swimming Pool, Gym"
                                    />
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <Button className="flex-1 sm:flex-none" onClick={handleSaveAmenity}>
                                        Save
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="flex-1 sm:flex-none"
                                        onClick={() => setIsAddingAmenity(false)}
                                    >
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
                                        onChange={(e) =>
                                            setDocumentForm({ ...documentForm, documentType: e.target.value })
                                        }
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
                                        onChange={(e) =>
                                            setDocumentForm({ ...documentForm, documentTitle: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="text-sm mb-1 block">File</label>
                                    <input
                                        type="file"
                                        className="w-full border rounded p-2 bg-white text-sm"
                                        onChange={(e) =>
                                            setDocumentForm({ ...documentForm, file: e.target.files[0] })
                                        }
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

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Type
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Title
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
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
                                <iframe
                                    src={previewModal.fileUrl}
                                    className="w-full h-96 border-0"
                                    title="PDF Preview"
                                />
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
                                    <Button
                                        className="mt-4"
                                        onClick={() => handleDownloadDocument(previewModal.doc)}
                                    >
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
                                        disbursements.length
                                            ? disbursements
                                            : [{ disbursementTitle: "", description: "", percentage: "" }],
                                    )
                                    setIsEditingDisbursements(true)
                                }}
                            >
                                <Edit size={18} className="mr-2" /> Edit Stages
                            </Button>
                        )}
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Stage
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Description
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                                        Percentage
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {disbursements && disbursements.length > 0 ? (
                                    disbursements.map((d, idx) => (
                                        <tr key={idx}>
                                            <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                                {d.disbursementTitle}
                                            </td>
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
                        <div className="overflow-x-auto">
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
                                        key: "status",
                                        label: "Status",
                                        render: (val) => <Badge status={val}>{val}</Badge>,
                                    },
                                ]}
                                data={enquiries}
                            />
                        </div>
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
                        <button
                            onClick={() => navigate("/projects")}
                            className="p-2 hover:bg-gray-100 rounded-lg flex-shrink-0"
                        >
                            <ArrowLeft size={24} className="text-gray-600" />
                        </button>
                        <div className="min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 break-words">
                                {project.projectName}
                            </h1>
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
                            <Trash2 size={20} className="mr-2" />
                            Delete Project
                        </Button>
                    </div>
                </div>

                <Tabs tabs={tabs} />
            </div>
        </AppLayout>
    )
}
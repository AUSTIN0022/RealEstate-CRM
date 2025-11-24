import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { FormTextarea } from "../components/ui/FormTextarea"
import { Stepper } from "../components/ui/Stepper"
import { Table } from "../components/ui/Table"
import { Modal } from "../components/ui/Modal"
import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { FormInput } from "../components/ui/FormInput"
import { FormSelect } from "../components/ui/FormSelect"
import { Plus, Trash2, Eye } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { validateMahareraNo } from "../utils/helpers"
import { projectService } from "../services/projectService"

export default function RegistrationPage() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)

  // Step 1: Basic Info
  const [basicInfo, setBasicInfo] = useState({
    projectName: "",
    mahareraNo: "",
    startDate: "",
    completionDate: "",
    status: "UPCOMING",
    address: "",
  })

  // Step 2: Wings & Floors
  const [wings, setWings] = useState([])
  const [showWingModal, setShowWingModal] = useState(false)
  const [wingForm, setWingForm] = useState({ wingName: "", noOfFloors: "", noOfProperties: "" })

  // Step 3: Bank Info
  const [banks, setBanks] = useState([])
  const [showBankModal, setShowBankModal] = useState(false)
  const [bankForm, setBankForm] = useState({
    bankName: "",
    branchName: "",
    contactPerson: "",
    contactNumber: "",
    ifsc: "",
  })

  // Step 4: Amenities & Documents
  const [amenities, setAmenities] = useState([])
  const [customAmenity, setCustomAmenity] = useState("")
  const [documents, setDocuments] = useState([])
  const [showDocModal, setShowDocModal] = useState(false)
  const [docForm, setDocForm] = useState({ title: "", type: "FloorPlan", file: null })

  // Step 5: Disbursements
  const [disbursements, setDisbursements] = useState([])
  const [showDisbursementModal, setShowDisbursementModal] = useState(false)
  const [disbursementForm, setDisbursementForm] = useState({ title: "", description: "", percentage: "" })

  const steps = ["Basic Info", "Wings & Floors", "Bank Info", "Amenities", "Disbursements", "Review"]

  // Validation
  const validateStep = () => {
    if (currentStep === 0) {
      if (!basicInfo.projectName || !basicInfo.mahareraNo || !basicInfo.startDate || !basicInfo.completionDate) {
        error("Please fill all required fields")
        return false
      }
      if (!validateMahareraNo(basicInfo.mahareraNo)) {
        error("Invalid Maharera number format")
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1))
    }
  }

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0))
  }

  const handleAddWing = () => {
    if (!wingForm.wingName || !wingForm.noOfFloors || !wingForm.noOfProperties) {
      error("Please fill all wing fields")
      return
    }
    setWings([...wings, { ...wingForm, wingId: uuidv4() }])
    setWingForm({ wingName: "", noOfFloors: "", noOfProperties: "" })
    setShowWingModal(false)
    success("Wing added successfully")
  }

  const handleAddBank = () => {
    if (!bankForm.bankName || !bankForm.branchName || !bankForm.contactPerson || !bankForm.contactNumber) {
      error("Please fill all bank fields")
      return
    }
    setBanks([...banks, { ...bankForm, bankDetailId: uuidv4() }])
    setBankForm({ bankName: "", branchName: "", contactPerson: "", contactNumber: "", ifsc: "" })
    setShowBankModal(false)
    success("Bank added successfully")
  }

  const handleAddCustomAmenity = () => {
    if (!customAmenity.trim()) {
      error("Please enter an amenity name")
      return
    }
    if (amenities.includes(customAmenity)) {
      error("Amenity already exists")
      return
    }
    setAmenities([...amenities, customAmenity])
    setCustomAmenity("")
    success("Amenity added successfully")
  }

  const handleAddDocument = () => {
    if (!docForm.title) {
      error("Please enter document title")
      return
    }
    if (!docForm.file) {
      error("Please select a file")
      return
    }
    setDocuments([...documents, { ...docForm, documentId: uuidv4() }])
    setDocForm({ title: "", type: "FloorPlan", file: null })
    setShowDocModal(false)
    success("Document added successfully")
  }

  const handleAddDisbursement = () => {
    if (!disbursementForm.title || !disbursementForm.percentage) {
      error("Please fill all disbursement fields")
      return
    }
    const totalPercentage =
      disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0) +
      Number.parseFloat(disbursementForm.percentage)
    if (totalPercentage > 100) {
      error("Total disbursement percentage cannot exceed 100%")
      return
    }
    setDisbursements([...disbursements, { ...disbursementForm, disbursementId: uuidv4() }])
    setDisbursementForm({ title: "", description: "", percentage: "" })
    success("Disbursement added successfully")
  }

  const handlePreviewDocument = (file) => {
    setPreviewFile(file)
    setShowPreviewModal(true)
  }

  const handleSubmit = async () => {
    const totalPercentage = disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0)
    if (totalPercentage !== 100) {
      error("Total disbursement percentage must equal 100%")
      return
    }

    if (wings.length === 0) {
      error("Please add at least one wing")
      return
    }

    if (banks.length === 0) {
      error("Please add at least one bank")
      return
    }

    setIsSubmitting(true)

    try {
      const projectData = {
        projectName: basicInfo.projectName,
        projectAddress: basicInfo.address,
        startDate: basicInfo.startDate,
        completionDate: basicInfo.completionDate,
        mahareraNo: basicInfo.mahareraNo || "",
        status: basicInfo.status || "UPCOMING",
        progress: 0,
        path: "/",

        // Wings with floors
        wings: wings.map((wing) => ({
          wingName: wing.wingName,
          noOfFloors: Number.parseInt(wing.noOfFloors),
          noOfProperties: Number.parseInt(wing.noOfProperties),
          floors: Array.from({ length: Number.parseInt(wing.noOfFloors) }, (_, i) => ({
            floorNo: i,
            floorName: i === 0 ? "Ground Floor" : `${i} Floor`,
            propertyType: "Residential",
            property: `Property ${i + 1}`,
            area: "95.5",
            quantity: Number.parseInt(wing.noOfProperties) / Number.parseInt(wing.noOfFloors),
          })),
        })),

        // Project-approved banks
        projectApprovedBanksInfo: banks.map((bank) => ({
          bankName: bank.bankName,
          branchName: bank.branchName,
          contactPerson: bank.contactPerson,
          contactNumber: bank.contactNumber,
        })),

        // Disbursement bank details
        disbursementBanksDetail: banks.map((bank) => ({
          accountName: bank.bankName,
          bankName: bank.bankName,
          branchName: bank.branchName,
          ifsc: bank.ifsc || "",
          accountType: "SAVINGS",
          accountNo: "0000000000",
          disbursementLetterHead: bank.letterHeadFile || null, // support if uploaded
        })),

        // Amenities
        amenities: amenities.map((a) => ({
          amenityName: a,
        })),

        // Documents
        documents: documents.map((doc) => ({
          documentType: doc.type,
          documentTitle: doc.title,
          document: doc.file,
        })),

        // Disbursements
        disbursements: disbursements.map((d) => ({
          disbursementTitle: d.title,
          description: d.description || "",
          percentage: Number.parseFloat(d.percentage),
        })),

        // Letterhead file
        letterHeadFile: documents.find((d) => d.type === "LetterHead")?.file || null,
      }

      console.log("[v1] Creating project with:", projectData)
      const response = await projectService.createProject(projectData)

      console.log("[v1] Project created successfully:", response)
      success("Project registered successfully!")
      navigate("/projects")
    } catch (err) {
      console.error("[v1] Error creating project:", err)
      error(err.message || "Failed to create project. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6 max-w-4xl mx-auto px-0">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Project Registration</h1>
          <p className="text-gray-600 mt-1 text-sm md:text-base">Complete all steps to register a new project</p>
        </div>

        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="px-4 md:px-0">
            <Stepper steps={steps} currentStep={currentStep} />
          </div>
        </div>

        <Card>
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Basic Information</h2>
              <FormInput
                label="Project Name"
                value={basicInfo.projectName}
                onChange={(e) => setBasicInfo({ ...basicInfo, projectName: e.target.value })}
                required
              />
              <FormInput
                label="Maharera Number"
                value={basicInfo.mahareraNo}
                onChange={(e) => setBasicInfo({ ...basicInfo, mahareraNo: e.target.value })}
                placeholder="P52100012345"
                required
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormInput
                  label="Start Date"
                  type="date"
                  value={basicInfo.startDate}
                  onChange={(e) => setBasicInfo({ ...basicInfo, startDate: e.target.value })}
                  required
                />
                <FormInput
                  label="Completion Date"
                  type="date"
                  value={basicInfo.completionDate}
                  onChange={(e) => setBasicInfo({ ...basicInfo, completionDate: e.target.value })}
                  required
                />
              </div>
              <FormSelect
                label="Status"
                value={basicInfo.status}
                onChange={(e) => setBasicInfo({ ...basicInfo, status: e.target.value })}
                options={[
                  { value: "UPCOMING", label: "Upcoming" },
                  { value: "IN_PROGRESS", label: "In Progress" },
                  { value: "COMPLETED", label: "Completed" },
                ]}
              />
              <FormTextarea
                label="Address"
                value={basicInfo.address}
                onChange={(e) => setBasicInfo({ ...basicInfo, address: e.target.value })}
              />
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Wings & Floors</h2>
                <Button
                  onClick={() => setShowWingModal(true)}
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <Plus size={18} />
                  Add Wing
                </Button>
              </div>
              {wings.length > 0 ? (
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="inline-block min-w-full px-4 md:px-0">
                    <Table
                      columns={[
                        { key: "wingName", label: "Wing Name" },
                        { key: "noOfFloors", label: "Floors" },
                        { key: "noOfProperties", label: "Properties" },
                      ]}
                      data={wings}
                      actions={(row) => [
                        {
                          label: "Delete",
                          onClick: () => setWings(wings.filter((w) => w.wingId !== row.wingId)),
                        },
                      ]}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8 text-sm md:text-base">No wings added yet</p>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Bank Information</h2>
                <Button
                  onClick={() => setShowBankModal(true)}
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <Plus size={18} />
                  Add Bank
                </Button>
              </div>
              {banks.length > 0 ? (
                <div className="overflow-x-auto -mx-4 md:mx-0">
                  <div className="inline-block min-w-full px-4 md:px-0">
                    <Table
                      columns={[
                        { key: "bankName", label: "Bank Name" },
                        { key: "branchName", label: "Branch" },
                        { key: "contactPerson", label: "Contact Person" },
                        { key: "contactNumber", label: "Contact Number" },
                      ]}
                      data={banks}
                      actions={(row) => [
                        {
                          label: "Delete",
                          onClick: () => setBanks(banks.filter((b) => b.bankDetailId !== row.bankDetailId)),
                        },
                      ]}
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 text-center py-8 text-sm md:text-base">No banks added yet</p>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Amenities & Documents</h2>
              <div>
                <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Amenities</label>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {["Gym", "Pool", "Garden", "Parking", "Security", "Club House"].map((amenity) => (
                      <button
                        key={amenity}
                        onClick={() =>
                          setAmenities((prev) =>
                            prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
                          )
                        }
                        className={`px-3 py-1 rounded-full text-sm md:text-base font-medium transition ${
                          amenities.includes(amenity)
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                  <div className="border-t pt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Amenity</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={customAmenity}
                        onChange={(e) => setCustomAmenity(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            handleAddCustomAmenity()
                          }
                        }}
                        placeholder="Enter amenity name"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                      />
                      <Button onClick={handleAddCustomAmenity} variant="primary" size="sm" className="w-full sm:w-auto">
                        <Plus size={18} />
                        Add
                      </Button>
                    </div>
                  </div>
                  {amenities.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                      {amenities.map((amenity) => (
                        <div key={amenity} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full">
                          <span className="text-sm text-indigo-900">{amenity}</span>
                          <button
                            onClick={() => setAmenities(amenities.filter((a) => a !== amenity))}
                            className="text-indigo-600 hover:text-indigo-900 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
                  <label className="block text-sm md:text-base font-medium text-gray-700">Documents</label>
                  <Button
                    onClick={() => setShowDocModal(true)}
                    variant="primary"
                    size="sm"
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Plus size={18} />
                    Add Document
                  </Button>
                </div>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.documentId}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg gap-2"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm md:text-base">{doc.title}</p>
                          <div className="flex flex-col sm:flex-row sm:gap-4 text-xs md:text-sm text-gray-600 mt-1">
                            <p>{doc.type}</p>
                            <p>
                              {doc.file.name} ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => handlePreviewDocument(doc.file)}
                            className="text-indigo-600 hover:text-indigo-700 p-1"
                            title="Preview document"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => setDocuments(documents.filter((d) => d.documentId !== doc.documentId))}
                            className="text-red-600 hover:text-red-700 p-1"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8 text-sm md:text-base">No documents added yet</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Disbursements</h2>
                <Button
                  onClick={() => setShowDisbursementModal(true)}
                  variant="primary"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                >
                  <Plus size={18} />
                  Add Disbursement
                </Button>
              </div>
              {disbursements.length > 0 ? (
                <>
                  <div className="overflow-x-auto -mx-4 md:mx-0">
                    <div className="inline-block min-w-full px-4 md:px-0">
                      <Table
                        columns={[
                          { key: "title", label: "Title" },
                          { key: "description", label: "Description" },
                          { key: "percentage", label: "Percentage" },
                        ]}
                        data={disbursements}
                        actions={(row) => [
                          {
                            label: "Delete",
                            onClick: () =>
                              setDisbursements(disbursements.filter((d) => d.disbursementId !== row.disbursementId)),
                          },
                        ]}
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm md:text-base font-medium text-blue-900">
                      Total: {disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0)}%
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 text-center py-8 text-sm md:text-base">No disbursements added yet</p>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Review & Submit</h2>

              {/* Basic Information Section */}
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">Basic Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm md:text-base">
                  <div>
                    <p className="text-gray-600">Project Name</p>
                    <p className="font-medium text-gray-900">{basicInfo.projectName}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Maharera Number</p>
                    <p className="font-medium text-gray-900">{basicInfo.mahareraNo}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Start Date</p>
                    <p className="font-medium text-gray-900">{basicInfo.startDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Completion Date</p>
                    <p className="font-medium text-gray-900">{basicInfo.completionDate}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status</p>
                    <p className="font-medium text-gray-900">{basicInfo.status}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Address</p>
                    <p className="font-medium text-gray-900">{basicInfo.address || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Wings & Floors Section */}
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">Wings & Floors ({wings.length})</h3>
                {wings.length > 0 ? (
                  <div className="space-y-2">
                    {wings.map((wing) => (
                      <div key={wing.wingId} className="bg-gray-50 p-3 rounded text-sm">
                        <p className="font-medium text-gray-900">{wing.wingName}</p>
                        <div className="grid grid-cols-2 gap-2 text-gray-600 mt-1">
                          <p>Floors: {wing.noOfFloors}</p>
                          <p>Properties: {wing.noOfProperties}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No wings added</p>
                )}
              </div>

              {/* Bank Information Section */}
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">Bank Information ({banks.length})</h3>
                {banks.length > 0 ? (
                  <div className="space-y-2">
                    {banks.map((bank) => (
                      <div key={bank.bankDetailId} className="bg-gray-50 p-3 rounded text-sm">
                        <p className="font-medium text-gray-900">
                          {bank.bankName} - {bank.branchName}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-600 mt-1 text-xs">
                          <p>Contact: {bank.contactPerson}</p>
                          <p>Phone: {bank.contactNumber}</p>
                          <p>IFSC: {bank.ifsc || "-"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No banks added</p>
                )}
              </div>

              {/* Amenities Section */}
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">Amenities</h3>
                {amenities.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                      <span key={amenity} className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded-full text-sm">
                        {amenity}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No amenities selected</p>
                )}
              </div>

              {/* Documents Section */}
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">Documents ({documents.length})</h3>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.documentId}
                        className="flex items-start justify-between bg-gray-50 p-3 rounded text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{doc.title}</p>
                          <p className="text-gray-600 text-xs mt-1">
                            {doc.type} - {doc.file.name}
                          </p>
                        </div>
                        <button
                          onClick={() => handlePreviewDocument(doc.file)}
                          className="text-indigo-600 hover:text-indigo-700 p-1 ml-2 flex-shrink-0"
                          title="Preview document"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No documents added</p>
                )}
              </div>

              {/* Disbursements Section */}
              <div className="border rounded-lg p-4 space-y-3">
                <h3 className="font-semibold text-gray-900 text-lg">Disbursements</h3>
                {disbursements.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      {disbursements.map((d) => (
                        <div
                          key={d.disbursementId}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded text-sm"
                        >
                          <div>
                            <p className="font-medium text-gray-900">{d.title}</p>
                            <p className="text-gray-600 text-xs">{d.description || "-"}</p>
                          </div>
                          <p className="font-semibold text-indigo-600">{d.percentage}%</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-green-50 border border-green-200 rounded">
                      <p className="font-semibold text-green-900">
                        Total: {disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0)}%
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600">No disbursements added</p>
                )}
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm md:text-base text-green-900 font-medium">
                  All information is ready to be submitted
                </p>
              </div>
            </div>
          )}
        </Card>

        <div className="fixed md:relative bottom-0 md:bottom-auto left-0 right-0 md:left-auto md:right-auto bg-white md:bg-transparent border-t md:border-t-0 border-gray-200 p-4 md:p-0 flex flex-row gap-3 md:gap-3 md:justify-between max-w-4xl mx-auto md:max-w-none">
          <Button onClick={handlePrev} variant="secondary" disabled={currentStep === 0} className="flex-1 md:flex-none">
            Previous
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} variant="success" disabled={isSubmitting} className="flex-1 md:flex-none">
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </Button>
          ) : (
            <Button onClick={handleNext} variant="primary" className="flex-1 md:flex-none">
              Next
            </Button>
          )}
        </div>

        {/* Add padding to prevent content being hidden behind fixed buttons on mobile */}
        <div className="h-16 md:h-0" />

        {/* Modals */}
        <Modal isOpen={showWingModal} onClose={() => setShowWingModal(false)} title="Add Wing">
          <FormInput
            label="Wing Name"
            value={wingForm.wingName}
            onChange={(e) => setWingForm({ ...wingForm, wingName: e.target.value })}
          />
          <FormInput
            label="Number of Floors"
            type="number"
            value={wingForm.noOfFloors}
            onChange={(e) => setWingForm({ ...wingForm, noOfFloors: e.target.value })}
          />
          <FormInput
            label="Number of Properties"
            type="number"
            value={wingForm.noOfProperties}
            onChange={(e) => setWingForm({ ...wingForm, noOfProperties: e.target.value })}
          />
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-4">
            <Button onClick={() => setShowWingModal(false)} variant="secondary" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddWing} variant="primary" className="w-full sm:w-auto">
              Add Wing
            </Button>
          </div>
        </Modal>

        <Modal isOpen={showBankModal} onClose={() => setShowBankModal(false)} title="Add Bank">
          <FormInput
            label="Bank Name"
            value={bankForm.bankName}
            onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })}
          />
          <FormInput
            label="Branch Name"
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
          <FormInput
            label="IFSC Code"
            value={bankForm.ifsc}
            onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value })}
          />
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-4">
            <Button onClick={() => setShowBankModal(false)} variant="secondary" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddBank} variant="primary" className="w-full sm:w-auto">
              Add Bank
            </Button>
          </div>
        </Modal>

        <Modal isOpen={showDocModal} onClose={() => setShowDocModal(false)} title="Add Document">
          <FormInput
            label="Document Title"
            value={docForm.title}
            onChange={(e) => setDocForm({ ...docForm, title: e.target.value })}
          />
          <FormSelect
            label="Document Type"
            value={docForm.type}
            onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
            options={[
              { value: "FloorPlan", label: "Floor Plan" },
              { value: "BasementPlan", label: "Basement Plan" },
            ]}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
            <input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const allowedExtensions = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
                  const fileExtension = "." + file.name.split(".").pop().toLowerCase()
                  const isValidType = allowedExtensions.includes(fileExtension)

                  if (!isValidType) {
                    error(`Invalid file type. Only ${allowedExtensions.join(", ")} are allowed`)
                    e.target.value = ""
                    return
                  }
                  setDocForm({ ...docForm, file })
                }
              }}
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
            <p className="text-xs text-gray-500 mt-1">Supported: PDF, DOC, DOCX, JPG, JPEG, PNG</p>
            {docForm.file && <p className="text-xs text-green-600 mt-1">Selected: {docForm.file.name}</p>}
          </div>
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-4">
            <Button onClick={() => setShowDocModal(false)} variant="secondary" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddDocument} variant="primary" className="w-full sm:w-auto">
              Add Document
            </Button>
          </div>
        </Modal>

        <Modal isOpen={showDisbursementModal} onClose={() => setShowDisbursementModal(false)} title="Add Disbursement">
          <FormInput
            label="Title"
            value={disbursementForm.title}
            onChange={(e) => setDisbursementForm({ ...disbursementForm, title: e.target.value })}
          />
          <FormInput
            label="Description"
            value={disbursementForm.description}
            onChange={(e) => setDisbursementForm({ ...disbursementForm, description: e.target.value })}
          />
          <FormInput
            label="Percentage"
            type="number"
            value={disbursementForm.percentage}
            onChange={(e) => setDisbursementForm({ ...disbursementForm, percentage: e.target.value })}
          />
          <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-4">
            <Button onClick={() => setShowDisbursementModal(false)} variant="secondary" className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button onClick={handleAddDisbursement} variant="primary" className="w-full sm:w-auto">
              Add Disbursement
            </Button>
          </div>
        </Modal>

        <Modal isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} title="Document Preview" size="lg">
          {previewFile && (
            <div className="w-full h-96 md:h-[600px] bg-gray-50 rounded-lg overflow-auto">
              {previewFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(previewFile) || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-full object-contain"
                />
              ) : previewFile.type === "application/pdf" ? (
                <iframe src={URL.createObjectURL(previewFile)} className="w-full h-full" title="PDF Preview" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500 text-center">
                    Preview not available for this file type
                    <br />
                    <span className="text-sm">File: {previewFile.name}</span>
                  </p>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </AppLayout>
  )
}

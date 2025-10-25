"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { FormTextarea } from "../components/ui/FormTextarea"
import { Stepper } from "../components/ui/Stepper"
import { Table } from "../components/ui/Table"
import { Modal, } from "../components/ui/Modal"
import { Card } from "../components/ui/Card"
import { Button  } from "../components/ui/Button"
import { FormInput } from "../components/ui/FormInput"
import { FormSelect } from "../components/ui/FormSelect"
import { Drawer } from "../components/ui/Drawer"
import { Badge } from "../components/ui/Badge"
import { Plus, Trash2 } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { validateMahareraNo } from "../utils/helpers"

export default function RegistrationPage() {
  const navigate = useNavigate()
  const { addProject, addWing, addFloor, addFlat, addDisbursement, addBankDetail, addDocument } = useData()
  const { success, error } = useToast()
  const [currentStep, setCurrentStep] = useState(0)

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
  const [documents, setDocuments] = useState([])
  const [showDocModal, setShowDocModal] = useState(false)
  const [docForm, setDocForm] = useState({ title: "", type: "FloorPlan" })

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

  const handleAddDocument = () => {
    if (!docForm.title) {
      error("Please enter document title")
      return
    }
    setDocuments([...documents, { ...docForm, documentId: uuidv4() }])
    setDocForm({ title: "", type: "FloorPlan" })
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

  const handleSubmit = () => {
    const totalPercentage = disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0)
    if (totalPercentage !== 100) {
      error("Total disbursement percentage must equal 100%")
      return
    }

    const projectId = uuidv4()
    const project = {
      projectId,
      projectName: basicInfo.projectName,
      mahareraNo: basicInfo.mahareraNo,
      startDate: basicInfo.startDate,
      completionDate: basicInfo.completionDate,
      status: basicInfo.status,
      projectAddress: basicInfo.address,
      progress: 0,
      letterHeadFileURL: "/placeholder.svg",
      isDeleted: false,
    }

    addProject(project)

    // Add wings, floors, and flats
    wings.forEach((wing) => {
      const wingData = {
        wingId: wing.wingId,
        projectId,
        wingName: wing.wingName,
        noOfFloors: Number.parseInt(wing.noOfFloors),
        noOfProperties: Number.parseInt(wing.noOfProperties),
        isDeleted: false,
      }
      addWing(wingData)

      // Add floors
      for (let i = 0; i < Number.parseInt(wing.noOfFloors); i++) {
        const floorData = {
          floorId: uuidv4(),
          projectId,
          wingId: wing.wingId,
          floorNo: i,
          floorName: ["Ground", "1st", "2nd", "3rd", "4th"][i] || `${i}th`,
          propertyType: "Residential",
          area: 1000,
          quantity: Number.parseInt(wing.noOfProperties) / Number.parseInt(wing.noOfFloors),
          isDeleted: false,
        }
        addFloor(floorData)

        // Add flats
        for (let j = 0; j < Number.parseInt(wing.noOfProperties) / Number.parseInt(wing.noOfFloors); j++) {
          const flatData = {
            propertyId: uuidv4(),
            projectId,
            wingId: wing.wingId,
            floorId: floorData.floorId,
            unitNumber: `${wing.wingName}-${i}${j + 1}`,
            status: "VACANT",
            area: 1000,
            bhk: "2BHK",
            isDeleted: false,
          }
          addFlat(flatData)
        }
      }
    })

    // Add banks
    banks.forEach((bank) => {
      addBankDetail({
        bankDetailId: bank.bankDetailId,
        projectId,
        ...bank,
        isDeleted: false,
      })
    })

    // Add disbursements
    disbursements.forEach((d) => {
      addDisbursement({
        disbursementId: d.disbursementId,
        projectId,
        disbursementTitle: d.title,
        description: d.description,
        percentage: Number.parseFloat(d.percentage),
        isDeleted: false,
      })
    })

    // Add documents
    documents.forEach((doc) => {
      addDocument({
        documentId: doc.documentId,
        projectId,
        documentType: doc.type,
        documentTitle: doc.title,
        documentURL: "/placeholder.svg",
        isDeleted: false,
      })
    })

    success("Project registered successfully!")
    navigate("/projects")
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Project Registration</h1>
          <p className="text-gray-600 mt-1">Complete all steps to register a new project</p>
        </div>

        {/* Stepper */}
        <Stepper steps={steps} currentStep={currentStep} />

        {/* Step Content */}
        <Card>
          {currentStep === 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Basic Information</h2>
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
              <div className="grid grid-cols-2 gap-4">
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
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Wings & Floors</h2>
                <Button onClick={() => setShowWingModal(true)} variant="primary" size="sm">
                  <Plus size={18} />
                  Add Wing
                </Button>
              </div>
              {wings.length > 0 ? (
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
              ) : (
                <p className="text-gray-600 text-center py-8">No wings added yet</p>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Bank Information</h2>
                <Button onClick={() => setShowBankModal(true)} variant="primary" size="sm">
                  <Plus size={18} />
                  Add Bank
                </Button>
              </div>
              {banks.length > 0 ? (
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
              ) : (
                <p className="text-gray-600 text-center py-8">No banks added yet</p>
              )}
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Amenities & Documents</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Gym", "Pool", "Garden", "Parking", "Security", "Club House"].map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() =>
                        setAmenities((prev) =>
                          prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity],
                        )
                      }
                      className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                        amenities.includes(amenity)
                          ? "bg-indigo-600 text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">Documents</label>
                  <Button onClick={() => setShowDocModal(true)} variant="primary" size="sm">
                    <Plus size={18} />
                    Add Document
                  </Button>
                </div>
                {documents.length > 0 ? (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <div
                        key={doc.documentId}
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">{doc.title}</p>
                          <p className="text-xs text-gray-600">{doc.type}</p>
                        </div>
                        <button
                          onClick={() => setDocuments(documents.filter((d) => d.documentId !== doc.documentId))}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600 text-center py-8">No documents added yet</p>
                )}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Disbursements</h2>
                <Button onClick={() => setShowDisbursementModal(true)} variant="primary" size="sm">
                  <Plus size={18} />
                  Add Disbursement
                </Button>
              </div>
              {disbursements.length > 0 ? (
                <>
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
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">
                      Total: {disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0)}%
                    </p>
                  </div>
                </>
              ) : (
                <p className="text-gray-600 text-center py-8">No disbursements added yet</p>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Review & Submit</h2>
              <div className="space-y-3 text-sm">
                <p>
                  <span className="font-medium text-gray-900">Project Name:</span> {basicInfo.projectName}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Maharera No:</span> {basicInfo.mahareraNo}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Wings:</span> {wings.length}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Banks:</span> {banks.length}
                </p>
                <p>
                  <span className="font-medium text-gray-900">Disbursements:</span>{" "}
                  {disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0)}%
                </p>
              </div>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-900">All information is ready to be submitted</p>
              </div>
            </div>
          )}
        </Card>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button onClick={handlePrev} variant="secondary" disabled={currentStep === 0}>
            Previous
          </Button>
          {currentStep === steps.length - 1 ? (
            <Button onClick={handleSubmit} variant="success">
              Submit Project
            </Button>
          ) : (
            <Button onClick={handleNext} variant="primary">
              Next
            </Button>
          )}
        </div>

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
          <div className="flex gap-2 justify-end mt-4">
            <Button onClick={() => setShowWingModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddWing} variant="primary">
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
          <div className="flex gap-2 justify-end mt-4">
            <Button onClick={() => setShowBankModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddBank} variant="primary">
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
          <div className="flex gap-2 justify-end mt-4">
            <Button onClick={() => setShowDocModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddDocument} variant="primary">
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
          <div className="flex gap-2 justify-end mt-4">
            <Button onClick={() => setShowDisbursementModal(false)} variant="secondary">
              Cancel
            </Button>
            <Button onClick={handleAddDisbursement} variant="primary">
              Add Disbursement
            </Button>
          </div>
        </Modal>
      </div>
    </AppLayout>
  )
}

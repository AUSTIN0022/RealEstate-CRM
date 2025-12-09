import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useToast } from "../../../components/ui/Toast"
import { v4 as uuidv4 } from "uuid"
import { validateMahareraNo } from "../../../utils/helpers"
import { projectService } from "../../../services/projectService"

export function useRegistrationForm() {
  const navigate = useNavigate()
  const { success, error } = useToast()
  
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Modal Visibilities
  const [showWingModal, setShowWingModal] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [showDocModal, setShowDocModal] = useState(false)
  const [showDisbursementModal, setShowDisbursementModal] = useState(false)
  const [showPreviewModal, setShowPreviewModal] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)

  // --- DATA STATES ---

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
  const [wingForm, setWingForm] = useState({ 
    wingId: null,
    wingName: "", 
    noOfFloors: "", 
    manualFloorEntry: false 
  })
  const [currentWingFloors, setCurrentWingFloors] = useState([])
  const [floorInput, setFloorInput] = useState({
    floorNo: "", floorName: "", propertyType: "", property: "", area: "", quantity: ""
  })
  const [editingFloorIndex, setEditingFloorIndex] = useState(-1)

  // Step 3: Bank Info (Updated with Account fields)
  const [banks, setBanks] = useState([])
  const [bankForm, setBankForm] = useState({
    bankName: "", 
    branchName: "", 
    contactPerson: "", 
    contactNumber: "", 
    ifsc: "",
    accountNo: "",          // Added
    accountType: "SAVINGS"  // Added
  })

  // Step 4: Amenities & Documents
  const [amenities, setAmenities] = useState([])
  const [customAmenity, setCustomAmenity] = useState("")
  const [documents, setDocuments] = useState([])
  const [docForm, setDocForm] = useState({ title: "", type: "FloorPlan", file: null })

  // Step 5: Disbursements
  const [disbursements, setDisbursements] = useState([])
  const [disbursementForm, setDisbursementForm] = useState({ title: "", description: "", percentage: "" })

  const steps = ["Basic Info", "Wings & Floors", "Bank Info", "Amenities", "Disbursements", "Review"]

  // --- WING LOGIC ---

  useEffect(() => {
    if (!wingForm.manualFloorEntry && wingForm.noOfFloors && currentWingFloors.length === 0) {
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
  }, [wingForm.noOfFloors, wingForm.manualFloorEntry])

  const resetWingModal = () => {
    setWingForm({ wingId: null, wingName: "", noOfFloors: "", manualFloorEntry: false })
    setCurrentWingFloors([])
    setFloorInput({ floorNo: "", floorName: "", propertyType: "", property: "", area: "", quantity: "" })
    setEditingFloorIndex(-1)
  }

  const handleOpenAddWing = () => {
    resetWingModal()
    setShowWingModal(true)
  }

  const handleEditWing = (wing) => {
    setWingForm({
        wingId: wing.wingId,
        wingName: wing.wingName,
        noOfFloors: wing.noOfFloors,
        manualFloorEntry: true 
    })
    setCurrentWingFloors(JSON.parse(JSON.stringify(wing.floors)))
    setShowWingModal(true)
  }

  const handleAddOrUpdateFloorRow = () => {
    if (!floorInput.floorName) {
      error("Floor Name is required")
      return
    }
    const newFloorData = { ...floorInput }
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

  const handleSaveWing = () => {
    if (!wingForm.wingName) {
      error("Wing Name is required")
      return
    }
    if (currentWingFloors.length === 0) {
      error("Please add at least one floor configuration")
      return
    }
    const totalProps = currentWingFloors.reduce((sum, floor) => sum + (parseInt(floor.quantity) || 0), 0)
    
    const wingData = {
      wingId: wingForm.wingId || uuidv4(),
      wingName: wingForm.wingName,
      noOfFloors: wingForm.noOfFloors,
      noOfProperties: totalProps,
      floors: currentWingFloors
    }

    if (wingForm.wingId) {
        setWings(wings.map(w => w.wingId === wingForm.wingId ? wingData : w))
        success("Wing updated successfully")
    } else {
        setWings([...wings, wingData])
        success("Wing saved successfully")
    }
    
    setShowWingModal(false)
  }

  const handleDeleteWing = (id) => setWings(wings.filter(w => w.wingId !== id))

  // --- NAVIGATION & VALIDATION ---

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

  const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 0))

  // --- OTHER HANDLERS ---

  const handleAddBank = () => {
    if (!bankForm.bankName || !bankForm.branchName || !bankForm.contactPerson || !bankForm.contactNumber || !bankForm.accountNo) {
      error("Please fill all bank fields")
      return
    }
    setBanks([...banks, { ...bankForm, bankDetailId: uuidv4() }])
    setBankForm({ 
        bankName: "", branchName: "", contactPerson: "", 
        contactNumber: "", ifsc: "", accountNo: "", accountType: "SAVINGS" 
    })
    setShowBankModal(false)
    success("Bank added successfully")
  }

  const handleAddCustomAmenity = () => {
    if (!customAmenity.trim()) { error("Please enter an amenity name"); return }
    if (amenities.includes(customAmenity)) { error("Amenity already exists"); return }
    setAmenities([...amenities, customAmenity])
    setCustomAmenity("")
    success("Amenity added successfully")
  }

  const handleAddDocument = () => {
    if (!docForm.title) { error("Please enter document title"); return }
    if (!docForm.file) { error("Please select a file"); return }
    setDocuments([...documents, { ...docForm, documentId: uuidv4() }])
    setDocForm({ title: "", type: "FloorPlan", file: null })
    setShowDocModal(false)
    success("Document added successfully")
  }

  const handleAddDisbursement = () => {
    if (!disbursementForm.title || !disbursementForm.percentage) { error("Please fill all disbursement fields"); return }
    const totalPercentage = disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0) + Number.parseFloat(disbursementForm.percentage)
    if (totalPercentage > 100) { error("Total disbursement percentage cannot exceed 100%"); return }
    setDisbursements([...disbursements, { ...disbursementForm, disbursementId: uuidv4() }])
    setDisbursementForm({ title: "", description: "", percentage: "" })
    success("Disbursement added successfully")
  }

  const handlePreviewDocument = (file) => {
    setPreviewFile(file)
    setShowPreviewModal(true)
  }

  // --- SUBMISSION LOGIC ---

  const handleSubmit = async () => {
    const totalPercentage = disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0)
    if (totalPercentage !== 100) { error("Total disbursement percentage must equal 100%"); return }
    if (wings.length === 0) { error("Please add at least one wing"); return }
    if (banks.length === 0) { error("Please add at least one bank"); return }

    // --- FIX: Reuse the Main LetterHead for Disbursement Banks ---
    const mainLetterHeadDoc = documents.find((d) => d.type === "LetterHead")
    const mainLetterHeadFile = mainLetterHeadDoc ? mainLetterHeadDoc.file : null

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
        wings: wings.map((wing) => ({
          wingName: wing.wingName,
          noOfFloors: Number(wing.noOfFloors),
          noOfProperties: Number(wing.noOfProperties),
          floors: wing.floors.map(f => ({
             floorNo: (f.floorNo !== "" && !isNaN(f.floorNo)) ? Number(f.floorNo) : 0,
             floorName: f.floorName,
             propertyType: f.propertyType,
             property: f.property,
             area: String(f.area || "0"),
             quantity: Number(f.quantity || 0)
          }))
        })),
        projectApprovedBanksInfo: banks.map((bank) => ({
          bankName: bank.bankName,
          branchName: bank.branchName,
          contactPerson: bank.contactPerson,
          contactNumber: bank.contactNumber,
        })),
        
        // --- Mapped Correctly with Hardcoded File ---
        disbursementBanksDetail: banks.map((bank) => ({
          accountName: bank.bankName,
          bankName: bank.bankName,
          branchName: bank.branchName,
          ifsc: bank.ifsc || "",
          accountType: bank.accountType || "SAVINGS",
          accountNo: bank.accountNo || "0000000000",
          disbursementLetterHead: mainLetterHeadFile, // <--- REUSING MAIN FILE
        })),
        
        amenities: amenities.map((a) => ({ amenityName: a })),
        documents: documents.map((doc) => ({
          documentType: doc.type,
          documentTitle: doc.title,
          document: doc.file,
        })),
        disbursements: disbursements.map((d) => ({
          disbursementTitle: d.title,
          description: d.description || "",
          percentage: Number.parseFloat(d.percentage),
        })),
        letterHeadFile: mainLetterHeadFile,
      }

      await projectService.createProject(projectData)
      success("Project registered successfully!")
      navigate("/projects")
    } catch (err) {
      console.error(err)
      error(err.message || "Failed to create project.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    currentStep, steps, isSubmitting,
    handleNext, handlePrev, handleSubmit,
    
    // Basic Info
    basicInfo, setBasicInfo,

    // Wings
    wings, handleOpenAddWing, handleDeleteWing, handleEditWing,
    showWingModal, setShowWingModal, handleSaveWing,
    wingForm, setWingForm, currentWingFloors, 
    floorInput, setFloorInput, editingFloorIndex,
    handleAddOrUpdateFloorRow, handleEditFloorRow, handleDeleteFloorRow,

    // Banks
    banks, setBanks, showBankModal, setShowBankModal, 
    bankForm, setBankForm, handleAddBank,

    // Amenities & Docs
    amenities, setAmenities, customAmenity, setCustomAmenity, handleAddCustomAmenity,
    documents, setDocuments, showDocModal, setShowDocModal, 
    docForm, setDocForm, handleAddDocument, handlePreviewDocument,

    // Disbursements
    disbursements, setDisbursements, showDisbursementModal, setShowDisbursementModal,
    disbursementForm, setDisbursementForm, handleAddDisbursement,

    // Preview
    showPreviewModal, setShowPreviewModal, previewFile
  }
}
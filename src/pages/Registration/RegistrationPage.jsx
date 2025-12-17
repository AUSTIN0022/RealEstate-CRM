import { AppLayout } from "../../components/layout/AppLayout"
import { Stepper } from "../../components/ui/Stepper"
import { Card } from "../../components/ui/Card"
import { Button } from "../../components/ui/Button"
import { useRegistrationForm } from "./hooks/useRegistrationForm"

// Steps
import StepBasicInfo from "./steps/StepBasicInfo"
import StepWings from "./steps/StepWings"
import StepBanks from "./steps/StepBanks"
import StepAmenities from "./steps/StepAmenities"
import StepDisbursements from "./steps/StepDisbursements"
import StepReview from "./steps/StepReview"

// Modals
import WingModal from "./modals/WingModal"
import BankModal from "./modals/BankModal"
import DocumentModal from "./modals/DocumentModal"
import DisbursementModal from "./modals/DisbursementModal"
import PreviewModal from "./modals/PreviewModal"

export default function RegistrationPage() {
  const {
    currentStep, steps, isSubmitting,
    handleNext, handlePrev, handleSubmit,
    
    // Basic Info
    basicInfo, setBasicInfo,

    // Wings
    wings, handleOpenAddWing, handleDeleteWing, handleEditWing, // <--- Destructured here
    showWingModal, setShowWingModal, handleSaveWing,
    wingForm, setWingForm, currentWingFloors, 
    floorInput, setFloorInput, editingFloorIndex,
    handleAddOrUpdateFloorRow, handleEditFloorRow, handleDeleteFloorRow,

    // Banks
    banks, setBanks, showBankModal, setShowBankModal, 
    bankForm, setBankForm, handleAddBank,

    // Amenities
    amenities, setAmenities, customAmenity, setCustomAmenity, handleAddCustomAmenity,
    documents, setDocuments, showDocModal, setShowDocModal, 
    docForm, setDocForm, handleAddDocument, handlePreviewDocument,

    // letter Head
    letterHead, setLetterHead,
    // Disbursements
    disbursements, setDisbursements, showDisbursementModal, setShowDisbursementModal,
    disbursementForm, setDisbursementForm, handleAddDisbursement,

    // Preview
    showPreviewModal, setShowPreviewModal, previewFile
  } = useRegistrationForm()

  const renderStep = () => {
    switch (currentStep) {
      case 0: return <StepBasicInfo basicInfo={basicInfo} setBasicInfo={setBasicInfo} />
      case 1: return (
        <StepWings 
            wings={wings} 
            onAddWing={handleOpenAddWing} 
            onDeleteWing={handleDeleteWing} 
            onEditWing={handleEditWing} // <--- Passed here
        />
      )
      case 2: return <StepBanks banks={banks} setBanks={setBanks} onOpenModal={() => setShowBankModal(true)} />
      case 3: return (
        <StepAmenities 
            amenities={amenities} setAmenities={setAmenities}
            customAmenity={customAmenity} setCustomAmenity={setCustomAmenity} onAddCustomAmenity={handleAddCustomAmenity}
            documents={documents} setDocuments={setDocuments} onOpenDocModal={() => setShowDocModal(true)} onPreviewDoc={handlePreviewDocument}
            letterHead={letterHead}
            setLetterHead={setLetterHead}
        />
      )
      case 4: return <StepDisbursements disbursements={disbursements} setDisbursements={setDisbursements} onOpenModal={() => setShowDisbursementModal(true)} />
      case 5: return (
        <StepReview 
            basicInfo={basicInfo} wings={wings} banks={banks} 
            amenities={amenities} documents={documents} disbursements={disbursements} 
            onPreviewDoc={handlePreviewDocument} 
        />
      )
      default: return null
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
          {renderStep()}
        </Card>

        {/* Navigation Buttons */}
        <div className="fixed md:relative bottom-0 md:bottom-auto left-0 right-0 md:left-auto md:right-auto bg-white md:bg-transparent border-t md:border-t-0 border-gray-200 p-4 md:p-0 flex flex-row gap-3 md:gap-3 md:justify-between max-w-4xl mx-auto md:max-w-none z-10">
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
        <div className="h-16 md:h-0" />

        {/* Modals */}
        <WingModal 
            isOpen={showWingModal} onClose={() => setShowWingModal(false)} onSave={handleSaveWing}
            wingForm={wingForm} setWingForm={setWingForm}
            floorInput={floorInput} setFloorInput={setFloorInput}
            currentWingFloors={currentWingFloors} editingFloorIndex={editingFloorIndex}
            onAddFloor={handleAddOrUpdateFloorRow} onEditFloor={handleEditFloorRow} onDeleteFloor={handleDeleteFloorRow}
        />

        <BankModal 
            isOpen={showBankModal} onClose={() => setShowBankModal(false)} 
            bankForm={bankForm} setBankForm={setBankForm} onAdd={handleAddBank} 
        />

        <DocumentModal 
            isOpen={showDocModal} onClose={() => setShowDocModal(false)} 
            docForm={docForm} setDocForm={setDocForm} onAdd={handleAddDocument} 
        />

        <DisbursementModal 
            isOpen={showDisbursementModal} onClose={() => setShowDisbursementModal(false)} 
            form={disbursementForm} setForm={setDisbursementForm} onAdd={handleAddDisbursement} 
        />

        <PreviewModal 
            isOpen={showPreviewModal} onClose={() => setShowPreviewModal(false)} file={previewFile} 
        />
      </div>
    </AppLayout>
  )
}
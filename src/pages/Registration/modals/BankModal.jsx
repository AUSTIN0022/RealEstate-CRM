import { Modal } from "../../../components/ui/Modal"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"

export default function BankModal({ isOpen, onClose, bankForm, setBankForm, onAdd }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Bank">
      <FormInput label="Bank Name" value={bankForm.bankName} onChange={(e) => setBankForm({ ...bankForm, bankName: e.target.value })} />
      <FormInput label="Branch Name" value={bankForm.branchName} onChange={(e) => setBankForm({ ...bankForm, branchName: e.target.value })} />
      <FormInput label="Contact Person" value={bankForm.contactPerson} onChange={(e) => setBankForm({ ...bankForm, contactPerson: e.target.value })} />
      <FormInput label="Contact Number" value={bankForm.contactNumber} onChange={(e) => setBankForm({ ...bankForm, contactNumber: e.target.value })} />
      <FormInput label="IFSC Code" value={bankForm.ifsc} onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value })} />
      <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-4">
        <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">Cancel</Button>
        <Button onClick={onAdd} variant="primary" className="w-full sm:w-auto">Add Bank</Button>
      </div>
    </Modal>
  )
}
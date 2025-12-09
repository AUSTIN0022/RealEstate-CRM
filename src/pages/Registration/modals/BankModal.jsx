import { Modal } from "../../../components/ui/Modal"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"

export default function BankModal({ isOpen, onClose, bankForm, setBankForm, onAdd }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Bank">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        
        {/* --- NEW FIELDS --- */}
        <FormInput 
            label="Account Number" 
            value={bankForm.accountNo} 
            onChange={(e) => setBankForm({ ...bankForm, accountNo: e.target.value })} 
        />
        
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Account Type</label>
            <select
                value={bankForm.accountType}
                onChange={(e) => setBankForm({ ...bankForm, accountType: e.target.value })}
                className="w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
                <option value="SAVINGS">Savings</option>
                <option value="CURRENT">Current</option>
                <option value="ESCROW">Escrow</option>
            </select>
        </div>
        {/* ------------------ */}

        <FormInput 
            label="IFSC Code" 
            value={bankForm.ifsc} 
            onChange={(e) => setBankForm({ ...bankForm, ifsc: e.target.value })} 
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

      <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-6">
        <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">Cancel</Button>
        <Button onClick={onAdd} variant="primary" className="w-full sm:w-auto">Add Bank</Button>
      </div>
    </Modal>
  )
}
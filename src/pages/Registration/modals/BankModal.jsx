import { Modal } from "../../../components/ui/Modal"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"
import { useToast } from "../../../components/ui/Toast"


export default function BankModal({ isOpen, onClose, bankForm, setBankForm, onAdd }) {
    const { error: toastError } = useToast()

    const handleAdd = () => {
        // Validate required fields
        if (
            !bankForm.bankName ||
            !bankForm.branchName ||
            !bankForm.accountNo ||
            !bankForm.ifsc ||
            !bankForm.contactPerson ||
            !bankForm.contactNumber
        ) {
            toastError("All fields are required")
            return
        }

        // Validate Account Number length
        if (bankForm.accountNo.length < 10) {
            toastError("Account Number must be at least 10 digits")
            return
        }

        // Validate Contact Number length
        if (bankForm.contactNumber.length !== 10) {
            toastError("Contact Number must be 10 digits")
            return
        }

        onAdd()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Bank">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormInput
                    label="Bank Name"
                    value={bankForm.bankName}
                    onChange={(e) => {
                        if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                            setBankForm({ ...bankForm, bankName: e.target.value })
                        }
                    }}
                    required
                />
                <FormInput
                    label="Branch Name"
                    value={bankForm.branchName}
                    onChange={(e) => {
                        if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                            setBankForm({ ...bankForm, branchName: e.target.value })
                        }
                    }}
                    required
                />

                {/* --- NEW FIELDS --- */}
                <FormInput
                    label="Account Number"
                    value={bankForm.accountNo}
                    onChange={(e) => {
                        const val = e.target.value
                        if (/^\d*$/.test(val) && val.length <= 16) {
                            setBankForm({ ...bankForm, accountNo: val })
                        }
                    }}
                    required
                />

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Account Type <span className="text-red-500">*</span></label>
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
                    onChange={(e) => {
                        const val = e.target.value.toUpperCase()
                        if (/^[A-Z0-9]*$/.test(val)) {
                            setBankForm({ ...bankForm, ifsc: val })
                        }
                    }}
                    required
                />
                <FormInput
                    label="Contact Person"
                    value={bankForm.contactPerson}
                    onChange={(e) => {
                        if (/^[a-zA-Z\s]*$/.test(e.target.value)) {
                            setBankForm({ ...bankForm, contactPerson: e.target.value })
                        }
                    }}
                    required
                />
                <FormInput
                    label="Contact Number"
                    value={bankForm.contactNumber}
                    onChange={(e) => {
                        const val = e.target.value
                        if (/^\d*$/.test(val) && val.length <= 10) {
                            setBankForm({ ...bankForm, contactNumber: val })
                        }
                    }}
                    required
                />
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-6">
                <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">Cancel</Button>
                <Button onClick={handleAdd} variant="primary" className="w-full sm:w-auto">Add Bank</Button>
            </div>
        </Modal>
    )
}
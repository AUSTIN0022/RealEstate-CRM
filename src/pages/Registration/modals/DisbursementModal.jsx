import { Modal } from "../../../components/ui/Modal"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"

export default function DisbursementModal({ isOpen, onClose, form, setForm, onAdd }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Disbursement">
      <FormInput label="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      <FormInput label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
      <FormInput label="Percentage" type="number" value={form.percentage} onChange={(e) => setForm({ ...form, percentage: e.target.value })} />
      <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-4">
        <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">Cancel</Button>
        <Button onClick={onAdd} variant="primary" className="w-full sm:w-auto">Add Disbursement</Button>
      </div>
    </Modal>
  )
}
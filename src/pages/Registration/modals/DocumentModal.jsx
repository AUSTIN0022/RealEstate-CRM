import { Modal } from "../../../components/ui/Modal"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"
import { FormSelect } from "../../../components/ui/FormSelect"
import { useToast } from "../../../components/ui/Toast"

export default function DocumentModal({ isOpen, onClose, docForm, setDocForm, onAdd }) {
  const { error } = useToast()

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const allowed = [".pdf", ".doc", ".docx", ".jpg", ".jpeg", ".png"]
      const ext = "." + file.name.split(".").pop().toLowerCase()
      if (!allowed.includes(ext)) {
        error(`Invalid file type.`)
        e.target.value = ""
        return
      }
      setDocForm({ ...docForm, file })
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Document">
      <FormInput label="Document Title" value={docForm.title} onChange={(e) => setDocForm({ ...docForm, title: e.target.value })} />
      <FormSelect
        label="Document Type"
        value={docForm.type}
        onChange={(e) => setDocForm({ ...docForm, type: e.target.value })}
        options={[{ value: "FloorPlan", label: "Floor Plan" }, { value: "BasementPlan", label: "Basement Plan" }]}
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
        <input type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
        <p className="text-xs text-gray-500 mt-1">Supported: PDF, DOC, Images</p>
        {docForm.file && <p className="text-xs text-green-600 mt-1">Selected: {docForm.file.name}</p>}
      </div>
      <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-4">
        <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">Cancel</Button>
        <Button onClick={onAdd} variant="primary" className="w-full sm:w-auto">Add Document</Button>
      </div>
    </Modal>
  )
}
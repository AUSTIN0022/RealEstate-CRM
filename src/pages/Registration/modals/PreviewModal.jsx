import { Modal } from "../../../components/ui/Modal"

export default function PreviewModal({ isOpen, onClose, file }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Document Preview" size="lg">
      {file && (
        <div className="w-full h-96 md:h-[600px] bg-gray-50 rounded-lg overflow-auto">
          {file.type.startsWith("image/") ? (
            <img src={URL.createObjectURL(file) || "/placeholder.svg"} alt="Preview" className="w-full h-full object-contain" />
          ) : file.type === "application/pdf" ? (
            <iframe src={URL.createObjectURL(file)} className="w-full h-full" title="PDF Preview" />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500 text-center">Preview not available<br /><span className="text-sm">File: {file.name}</span></p>
            </div>
          )}
        </div>
      )}
    </Modal>
  )
}
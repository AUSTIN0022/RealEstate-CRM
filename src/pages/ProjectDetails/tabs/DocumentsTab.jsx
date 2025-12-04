import { useState } from "react"
import { Card } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"
import { Modal } from "../../../components/ui/Modal"
import { useToast } from "../../../components/ui/Toast"
import { Plus, FileText, Download, Eye, Trash2 } from "lucide-react"
import { projectService } from "../../../services/projectService"
import { DOCUMENT_TYPE } from "../../../utils/constants"

export default function DocumentsTab({ documents, projectId, onRefresh }) {
  const { success, error: toastError } = useToast()
  
  const [isAddingDocument, setIsAddingDocument] = useState(false)
  const [documentForm, setDocumentForm] = useState({
    documentType: "",
    documentTitle: "",
    file: null,
  })
  
  const [previewModal, setPreviewModal] = useState({ isOpen: false, doc: null, fileUrl: null })

  const handleCreateDocument = async () => {
    if (!documentForm.file || !documentForm.documentTitle || !documentForm.documentType) {
      toastError("Please fill all fields and select a file")
      return
    }
    try {
      await projectService.createDocument(projectId, documentForm)
      success("Document uploaded successfully")
      setIsAddingDocument(false)
      setDocumentForm({ documentType: "", documentTitle: "", file: null })
      if (onRefresh) onRefresh()
    } catch (err) {
      toastError("Failed to upload document")
    }
  }

  const handleDeleteDocument = async (id) => {
    if (!window.confirm("Delete this document?")) return
    try {
      await projectService.deleteDocument(id)
      success("Document deleted")
      if (onRefresh) onRefresh()
    } catch (err) {
      toastError("Failed to delete document")
    }
  }

  const handlePreviewDocument = async (doc) => {
    try {
      // 1. Get the Signed URL from backend
      const signedUrl = await projectService.getDocumentSignedUrl(doc.documentURL)
      
      // 2. Determine file type from the documentURL extension
      const fileType = doc.documentURL?.split(".").pop()?.split("?")[0]?.toLowerCase() || "pdf"

      setPreviewModal({
        isOpen: true,
        doc: doc,
        fileUrl: signedUrl,
        fileType: fileType,
      })
    } catch (err) {
      console.error(err)
      toastError("Failed to load preview")
    }
  }

  const handleDownloadDocument = async (doc) => {
    try {
      // 1. Get the Signed URL
      const signedUrl = await projectService.getDocumentSignedUrl(doc.documentURL)
      
      // 2. Open in new tab (S3 Signed URLs trigger browser download/view behavior)
      const link = document.createElement('a')
      link.href = signedUrl
      link.target = "_blank"
      link.rel = "noopener noreferrer"
      // Note: 'download' attribute often ignored for cross-origin (S3) links
      link.download = doc.documentTitle || "document"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

    } catch (e) {
      toastError("Download failed")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Documents</h3>
        <Button onClick={() => setIsAddingDocument(true)}>
          <Plus size={18} className="mr-2" /> Upload Document
        </Button>
      </div>

      {isAddingDocument && (
        <Card className="mb-4 bg-gray-50">
          <h4 className="font-semibold mb-3">Upload New Document</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm mb-1 block">Document Type</label>
              <select
                className="w-full border rounded p-2 text-sm bg-white"
                value={documentForm.documentType}
                onChange={(e) =>
                  setDocumentForm({ ...documentForm, documentType: e.target.value })
                }
              >
                <option value="">Select Document Type</option>
                {Object.keys(DOCUMENT_TYPE).map((key) => (
                  <option key={key} value={DOCUMENT_TYPE[key]}>
                    {DOCUMENT_TYPE[key]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm mb-1 block">Title</label>
              <FormInput
                placeholder="e.g. Area Chart"
                value={documentForm.documentTitle}
                onChange={(e) =>
                  setDocumentForm({ ...documentForm, documentTitle: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm mb-1 block">File</label>
              <input
                type="file"
                className="w-full border rounded p-2 bg-white text-sm"
                onChange={(e) =>
                  setDocumentForm({ ...documentForm, file: e.target.files[0] })
                }
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsAddingDocument(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDocument}>Upload</Button>
          </div>
        </Card>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Title
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents && documents.length > 0 ? (
              documents.map((doc, idx) => (
                <tr key={doc.documentId || idx}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" /> {doc.documentType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{doc.documentTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                    <button
                      onClick={() => handlePreviewDocument(doc)}
                      className="text-purple-600 hover:text-purple-900 inline-flex items-center gap-1"
                      title="Preview"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(doc)}
                      className="text-blue-600 hover:text-blue-900 inline-flex items-center gap-1"
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteDocument(doc.documentId)}
                      className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                  No documents uploaded.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={previewModal.isOpen}
        onClose={() => setPreviewModal({ isOpen: false, doc: null, fileUrl: null })}
        title={`Preview: ${previewModal.doc?.documentTitle || "Document"}`}
        size="3xl"
      >
        <div className="flex flex-col items-center justify-center min-h-96 bg-gray-50 rounded-lg">
          {previewModal.fileType === "pdf" ? (
            <iframe
              src={previewModal.fileUrl}
              className="w-full h-96 border-0"
              title="PDF Preview"
            />
          ) : ["jpg", "jpeg", "png", "gif", "webp"].includes(previewModal.fileType) ? (
            <img
              src={previewModal.fileUrl || "/placeholder.svg"}
              alt="Document preview"
              className="max-w-full max-h-96 object-contain"
            />
          ) : (
            <div className="text-center">
              <FileText size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Preview not available for this file type</p>
              <Button
                className="mt-4"
                onClick={() => handleDownloadDocument(previewModal.doc)}
              >
                Download Instead
              </Button>
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
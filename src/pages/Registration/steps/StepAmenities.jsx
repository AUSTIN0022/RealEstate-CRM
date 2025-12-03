import { Button } from "../../../components/ui/Button"
import { Plus, Eye, Trash2 } from "lucide-react"

export default function StepAmenities({ 
  amenities, setAmenities, 
  customAmenity, setCustomAmenity, onAddCustomAmenity,
  documents, setDocuments, onOpenDocModal, onPreviewDoc
}) {
  const predefined = ["Gym", "Pool", "Garden", "Parking", "Security", "Club House"]

  return (
    <div className="space-y-4">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Amenities & Documents</h2>
      {/* Amenities Section */}
      <div>
        <label className="block text-sm md:text-base font-medium text-gray-700 mb-2">Amenities</label>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2 mb-4">
            {predefined.map((item) => (
              <button
                key={item}
                onClick={() => setAmenities(prev => prev.includes(item) ? prev.filter(a => a !== item) : [...prev, item])}
                className={`px-3 py-1 rounded-full text-sm md:text-base font-medium transition ${
                  amenities.includes(item) ? "bg-indigo-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          <div className="border-t pt-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">Add Custom Amenity</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && onAddCustomAmenity()}
                placeholder="Enter amenity name"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
              />
              <Button onClick={onAddCustomAmenity} variant="primary" size="sm" className="w-full sm:w-auto">
                <Plus size={18} /> Add
              </Button>
            </div>
          </div>
          {amenities.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
              {amenities.map((item) => (
                <div key={item} className="flex items-center gap-2 px-3 py-1 bg-indigo-100 rounded-full">
                  <span className="text-sm text-indigo-900">{item}</span>
                  <button onClick={() => setAmenities(amenities.filter(a => a !== item))} className="text-indigo-600 hover:text-indigo-900 font-bold">×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Documents Section */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-4">
          <label className="block text-sm md:text-base font-medium text-gray-700">Documents</label>
          <Button onClick={onOpenDocModal} variant="primary" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
            <Plus size={18} /> Add Document
          </Button>
        </div>
        {documents.length > 0 ? (
          <div className="space-y-2">
            {documents.map((doc) => (
              <div key={doc.documentId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border border-gray-200 rounded-lg gap-2">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm md:text-base">{doc.title}</p>
                  <div className="flex flex-col sm:flex-row sm:gap-4 text-xs md:text-sm text-gray-600 mt-1">
                    <p>{doc.type}</p>
                    <p>{doc.file.name} ({(doc.file.size / 1024 / 1024).toFixed(2)} MB)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => onPreviewDoc(doc.file)} className="text-indigo-600 hover:text-indigo-700 p-1"><Eye size={18} /></button>
                  <button onClick={() => setDocuments(documents.filter(d => d.documentId !== doc.documentId))} className="text-red-600 hover:text-red-700 p-1"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-8 text-sm md:text-base">No documents added yet</p>
        )}
      </div>
    </div>
  )
}
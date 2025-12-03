import { useState } from "react"
import { Card } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"
import { useToast } from "../../../components/ui/Toast"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { projectService } from "../../../services/projectService"

export default function AmenitiesTab({ amenities, projectId, onRefresh }) {
  const { success, error: toastError } = useToast()
  
  const [isAddingAmenity, setIsAddingAmenity] = useState(false)
  const [editingAmenityId, setEditingAmenityId] = useState(null)
  const [amenityForm, setAmenityForm] = useState({ amenityName: "" })

  const handleSaveAmenity = async () => {
    try {
      if (!amenityForm.amenityName) { toastError("Please enter amenity name"); return }

      if (editingAmenityId) {
        await projectService.updateAmenity(editingAmenityId, amenityForm)
        success("Amenity updated")
      } else {
        await projectService.createAmenity(projectId, amenityForm)
        success("Amenity added")
      }
      setIsAddingAmenity(false)
      setEditingAmenityId(null)
      setAmenityForm({ amenityName: "" })
      if (onRefresh) onRefresh()
    } catch (err) {
      toastError("Failed to save amenity")
    }
  }

  const handleDeleteAmenity = async (id) => {
    if (!window.confirm("Delete this amenity?")) return
    try {
      await projectService.deleteAmenity(id)
      success("Amenity deleted")
      if (onRefresh) onRefresh()
    } catch (err) {
      toastError("Failed to delete amenity")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Project Amenities</h3>
        <Button
          onClick={() => {
            setEditingAmenityId(null)
            setAmenityForm({ amenityName: "" })
            setIsAddingAmenity(true)
          }}
        >
          <Plus size={18} className="mr-2" /> Add Amenity
        </Button>
      </div>

      {isAddingAmenity && (
        <Card className="mb-4 bg-green-50 border-green-100">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1 w-full">
              <label className="text-sm font-medium mb-1 block">Amenity Name</label>
              <FormInput
                value={amenityForm.amenityName}
                onChange={(e) =>
                  setAmenityForm({ ...amenityForm, amenityName: e.target.value })
                }
                placeholder="e.g. Swimming Pool, Gym"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button className="flex-1 sm:flex-none" onClick={handleSaveAmenity}>
                Save
              </Button>
              <Button
                variant="ghost"
                className="flex-1 sm:flex-none"
                onClick={() => setIsAddingAmenity(false)}
              >
                <X size={18} />
              </Button>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {amenities && amenities.length > 0 ? (
          amenities.map((amenity) => (
            <div
              key={amenity.id || amenity.amenityId}
              className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="font-medium text-gray-800">{amenity.amenityName}</span>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingAmenityId(amenity.id || amenity.amenityId)
                    setAmenityForm({ amenityName: amenity.amenityName })
                    setIsAddingAmenity(true)
                  }}
                  className="p-1 text-gray-500 hover:text-blue-600"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDeleteAmenity(amenity.id || amenity.amenityId)}
                  className="p-1 text-gray-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            No amenities listed.
          </div>
        )}
      </div>
    </div>
  )
}
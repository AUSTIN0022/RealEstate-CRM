import { Button } from "../../../components/ui/Button"
import { Plus, Trash2, Edit } from "lucide-react"

export default function StepWings({ wings, onAddWing, onDeleteWing, onEditWing }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Wing Information</h2>
        <Button onClick={onAddWing} variant="primary" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
          <Plus size={18} /> Add Wing
        </Button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
        <p className="text-sm text-gray-600 mb-2">Add wing name, no. of floors, and configure property units per floor.</p>
        {wings.length > 0 ? (
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th className="px-4 py-3 border-b">Wing Name</th>
                            <th className="px-4 py-3 border-b">No. Of Floors</th>
                            <th className="px-4 py-3 border-b">Total Property</th>
                            <th className="px-4 py-3 border-b text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {wings.map((wing) => (
                            <tr key={wing.wingId} className="border-b hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium">{wing.wingName}</td>
                                <td className="px-4 py-3">{wing.noOfFloors}</td>
                                <td className="px-4 py-3">{wing.noOfProperties}</td>
                                <td className="px-4 py-3 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button 
                                            onClick={() => onEditWing(wing)} 
                                            className="text-green-600 hover:text-green-800 p-1"
                                            title="Edit Wing"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button 
                                            onClick={() => onDeleteWing(wing.wingId)} 
                                            className="text-red-500 hover:text-red-700 p-1"
                                            title="Delete Wing"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        ) : (
            <div className="text-center py-6 bg-white border border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">No wings added yet.</p>
            </div>
        )}
      </div>
    </div>
  )
}
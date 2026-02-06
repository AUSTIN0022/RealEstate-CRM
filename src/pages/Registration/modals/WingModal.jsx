import { Modal } from "../../../components/ui/Modal"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"
import { Plus, Save, Edit, Trash2 } from "lucide-react"

export default function WingModal({
    isOpen, onClose, onSave,
    wingForm, setWingForm,
    floorInput, setFloorInput,
    currentWingFloors,
    editingFloorIndex,
    onAddFloor, onEditFloor, onDeleteFloor
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Fill Wing Information" size="xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="col-span-1">
                    <FormInput
                        label="Wing Name"
                        value={wingForm.wingName}
                        onChange={(e) => setWingForm({ ...wingForm, wingName: e.target.value })}
                        placeholder="e.g. Wing A"
                    />
                </div>
                <div className="col-span-1">
                    <FormInput
                        label="No. Of Floors"
                        type="number"
                        min="0"
                        onKeyDown={(e) => {
                            if (e.key === '-' || e.key === 'e') {
                                e.preventDefault();
                            }
                        }}
                        value={wingForm.noOfFloors}
                        onChange={(e) => {
                            const val = e.target.value;
                            if (val === "" || (parseInt(val) >= 0 && !val.includes('-'))) {
                                setWingForm({ ...wingForm, noOfFloors: val })
                            }
                        }}
                    />
                </div>
                <div className="col-span-1 flex items-center pt-6">
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={wingForm.manualFloorEntry}
                            onChange={(e) => setWingForm({ ...wingForm, manualFloorEntry: e.target.checked })}
                            className="form-checkbox h-4 w-4 text-indigo-600 rounded border-gray-300"
                        />
                        <span className="text-gray-700 font-medium">Manual Floor Entry</span>
                    </label>
                </div>
            </div>

            <hr className="my-4 border-gray-200" />

            {/* Floor Input Section */}
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mb-4">
                <div className="grid grid-cols-2 md:grid-cols-12 gap-2 items-end">
                    <div className="col-span-2 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Floor No/Name</label>
                        <input
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={floorInput.floorName}
                            onChange={(e) => setFloorInput({ ...floorInput, floorName: e.target.value })}
                            placeholder="Ground"
                        />
                    </div>
                    <div className="col-span-2 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                        <select
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                            value={floorInput.propertyType}
                            onChange={(e) => setFloorInput({ ...floorInput, propertyType: e.target.value })}
                        >
                            <option value="">Choose...</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Industrial">Industrial</option>
                        </select>
                    </div>
                    <div className="col-span-2 md:col-span-3">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Property</label>
                        <select
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none bg-white"
                            value={floorInput.property}
                            onChange={(e) => setFloorInput({ ...floorInput, property: e.target.value })}
                        >
                            <option value="">Choose...</option>
                            <option value="1 BHK">1 BHK</option>
                            <option value="2 BHK">2 BHK</option>
                            <option value="3 BHK">3 BHK</option>
                            <option value="4 BHK">4 BHK</option>
                            <option value="Offices">Offices</option>
                            <option value="Shops">Shops</option>
                        </select>
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Area</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={floorInput.area}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || (parseFloat(val) >= 0 && !val.includes('-'))) {
                                    setFloorInput({ ...floorInput, area: val })
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e') {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Area"
                        />
                    </div>
                    <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Qty</label>
                        <input
                            type="number"
                            min="1"
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-indigo-500 outline-none"
                            value={floorInput.quantity}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val === "" || (parseInt(val) >= 0 && !val.includes('-'))) {
                                    setFloorInput({ ...floorInput, quantity: val })
                                }
                            }}
                            onKeyDown={(e) => {
                                if (e.key === '-' || e.key === 'e') {
                                    e.preventDefault();
                                }
                            }}
                            placeholder="Qty"
                        />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <Button onClick={onAddFloor} size="sm" variant="primary" className="w-full h-[34px] flex items-center justify-center">
                            {editingFloorIndex >= 0 ? <Save size={16} /> : <Plus size={16} />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Table of Floors */}
            <div className="overflow-x-auto border border-gray-200 rounded-lg max-h-64 overflow-y-auto">
                <table className="w-full text-sm text-left border-collapse">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100 sticky top-0">
                        <tr>
                            <th className="px-3 py-2 border-b text-center w-12">SN</th>
                            <th className="px-3 py-2 border-b">Floor Name</th>
                            <th className="px-3 py-2 border-b">Property Type</th>
                            <th className="px-3 py-2 border-b">Property</th>
                            <th className="px-3 py-2 border-b">Area</th>
                            <th className="px-3 py-2 border-b text-center">Quantity</th>
                            <th className="px-3 py-2 border-b text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {currentWingFloors.map((floor, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-3 py-2 text-center text-gray-500">{index + 1}</td>
                                <td className="px-3 py-2">{floor.floorName}</td>
                                <td className="px-3 py-2">{floor.propertyType}</td>
                                <td className="px-3 py-2">{floor.property}</td>
                                <td className="px-3 py-2">{floor.area}</td>
                                <td className="px-3 py-2 text-center">{floor.quantity}</td>
                                <td className="px-3 py-2 flex justify-center gap-2">
                                    <button onClick={() => onEditFloor(index)} className="text-green-600 hover:text-green-800 p-1">
                                        <Edit size={16} />
                                    </button>
                                    <button onClick={() => onDeleteFloor(index)} className="text-red-500 hover:text-red-700 p-1">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {currentWingFloors.length === 0 && (
                            <tr>
                                <td colSpan="7" className="text-center py-4 text-gray-500 text-xs">
                                    No floors added yet.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center gap-2 mt-4 bg-gray-100 p-2 rounded text-sm text-gray-700 font-medium">
                <span>Total Properties: </span>
                <span>{currentWingFloors.reduce((sum, f) => sum + (parseInt(f.quantity) || 0), 0)}</span>
            </div>

            <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end mt-6">
                <Button onClick={onClose} variant="secondary" className="w-full sm:w-auto">Cancel</Button>
                <Button onClick={onSave} variant="primary" className="w-full sm:w-auto">
                    <Plus size={18} className="mr-1" /> Add Wing
                </Button>
            </div>
        </Modal>
    )
}
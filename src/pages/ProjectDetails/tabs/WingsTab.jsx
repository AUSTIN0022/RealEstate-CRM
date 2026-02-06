import { useState, useEffect } from "react"
import { Card } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { Modal } from "../../../components/ui/Modal"
import { useToast } from "../../../components/ui/Toast"
import { Plus, Building2, Eye, Edit, Trash2 } from "lucide-react"
import { projectService } from "../../../services/projectService"

// Adjusted path to reach the Registration folder
import WingModal from "../../Registration/modals/WingModal"

export default function WingsTab({ project, projectId, onRefresh }) {
    const { success, error: toastError } = useToast()

    // Modal States
    const [wingModalOpen, setWingModalOpen] = useState(false)
    const [viewWingModalOpen, setViewWingModalOpen] = useState(false)
    const [selectedWing, setSelectedWing] = useState(null)

    // Wing Form State
    const [wingForm, setWingForm] = useState({
        wingId: null,
        wingName: "",
        noOfFloors: "",
        manualFloorEntry: false,
    })

    // Floors State
    const [currentWingFloors, setCurrentWingFloors] = useState([])
    const [floorInput, setFloorInput] = useState({
        floorNo: "", floorName: "", propertyType: "", property: "", area: "1", quantity: "1"
    })
    const [editingFloorIndex, setEditingFloorIndex] = useState(-1)

    // 1. Auto-generate floors
    // 1. Auto-generate floors
    useEffect(() => {
        if (wingModalOpen && !wingForm.manualFloorEntry && wingForm.noOfFloors !== "") {
            const count = parseInt(wingForm.noOfFloors) || 0
            // We want floors from 0 to count (inclusive), so total floors = count + 1
            const requiredLength = count + 1

            setCurrentWingFloors(prev => {
                if (prev.length === requiredLength) return prev;

                if (prev.length > requiredLength) {
                    return prev.slice(0, requiredLength);
                } else {
                    const newFloors = [...prev];
                    for (let i = prev.length; i < requiredLength; i++) {
                        newFloors.push({
                            floorNo: i.toString(),
                            floorName: i === 0 ? "Ground Floor" : `Floor ${i}`,
                            propertyType: "Residential",
                            property: "2 BHK",
                            area: "1",
                            quantity: "1"
                        })
                    }
                    return newFloors;
                }
            })
        }
    }, [wingForm.noOfFloors, wingForm.manualFloorEntry, wingModalOpen])

    // 2. Handlers
    const openAddWingModal = () => {
        setWingForm({ wingId: null, wingName: "", noOfFloors: "", manualFloorEntry: false })
        setCurrentWingFloors([])
        setFloorInput({ floorNo: "", floorName: "", propertyType: "", property: "", area: "1", quantity: "1" })
        setEditingFloorIndex(-1)
        setWingModalOpen(true)
    }

    const openEditWingModal = (wing) => {
        setWingForm({
            wingId: wing.id || wing.wingId,
            wingName: wing.wingName,
            noOfFloors: wing.noOfFloors,
            manualFloorEntry: true // Set true to show the table immediately
        })
        setCurrentWingFloors(wing.floors ? JSON.parse(JSON.stringify(wing.floors)) : [])
        setWingModalOpen(true)
    }

    const handleAddOrUpdateFloorRow = () => {
        if (!floorInput.floorName) { toastError("Floor Name is required"); return }

        const newFloorData = { ...floorInput }
        if (newFloorData.floorNo === "" || newFloorData.floorNo === undefined) {
            newFloorData.floorNo = editingFloorIndex >= 0
                ? currentWingFloors[editingFloorIndex].floorNo
                : currentWingFloors.length.toString()
        }

        if (editingFloorIndex >= 0) {
            const updatedFloors = [...currentWingFloors]
            updatedFloors[editingFloorIndex] = newFloorData
            setCurrentWingFloors(updatedFloors)
            setEditingFloorIndex(-1)
            success("Floor updated")
        } else {
            setCurrentWingFloors([...currentWingFloors, newFloorData])
        }
        setFloorInput({ floorNo: "", floorName: "", propertyType: "", property: "", area: "1", quantity: "1" })
    }

    const handleEditFloorRow = (index) => {
        setFloorInput(currentWingFloors[index])
        setEditingFloorIndex(index)
    }

    const handleDeleteFloorRow = (index) => {
        const updated = currentWingFloors.filter((_, i) => i !== index)
        setCurrentWingFloors(updated)
        if (editingFloorIndex === index) {
            setEditingFloorIndex(-1)
            setFloorInput({ floorNo: "", floorName: "", propertyType: "", property: "", area: "1", quantity: "1" })
        }
    }

    const handleSaveWing = async () => {
        if (!wingForm.wingName) { toastError("Wing Name is required"); return }
        if (currentWingFloors.length === 0) { toastError("Please add at least one floor"); return }

        try {
            const totalProps = currentWingFloors.reduce((sum, floor) => sum + (parseInt(floor.quantity) || 0), 0)

            const payload = {
                wingName: wingForm.wingName,
                noOfFloors: parseInt(wingForm.noOfFloors) || 0,
                noOfProperties: totalProps,
                floors: currentWingFloors.map(f => ({
                    ...f,
                    floorNo: parseInt(f.floorNo) || 0,
                    quantity: parseInt(f.quantity) || 0
                }))
            }

            if (wingForm.wingId) {
                await projectService.updateWing(wingForm.wingId, payload)
                success("Wing updated successfully")
            } else {
                await projectService.createWing(projectId, payload)
                success("Wing created successfully")
            }

            setWingModalOpen(false)
            onRefresh()
        } catch (err) {
            console.error(err)
            toastError("Failed to save wing")
        }
    }

    const handleDeleteWing = async (id) => {
        if (!window.confirm("Delete this wing? All associated properties will be deleted.")) return
        try {
            await projectService.deleteWing(id)
            success("Wing deleted")
            onRefresh()
        } catch (err) {
            toastError("Failed to delete wing")
        }
    }

    const openViewWingModal = (wing) => {
        setSelectedWing(wing)
        setViewWingModalOpen(true)
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Wings Configuration</h3>
                <Button onClick={openAddWingModal} className="w-full sm:w-auto">
                    <Plus size={18} className="mr-2" /> Add Wing
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.wings?.map((wing) => (
                    <Card
                        key={wing.id || wing.wingId}
                        className="hover:shadow-md transition-shadow relative"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <Building2 size={20} className="text-blue-600" /> {wing.wingName}
                                </h4>
                                <p className="text-sm text-gray-600 mt-2">
                                    <span className="font-semibold">{wing.noOfFloors}</span> Floors
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-semibold">{wing.noOfProperties}</span> Total
                                    Properties
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openViewWingModal(wing)}
                                    className="p-1.5 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded"
                                    title="View Details"
                                >
                                    <Eye size={18} />
                                </button>
                                <button
                                    onClick={() => openEditWingModal(wing)}
                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit Wing"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDeleteWing(wing.id || wing.wingId)}
                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                                    title="Delete Wing"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
                {(!project.wings || project.wings.length === 0) && (
                    <div className="col-span-full text-center py-10 bg-gray-50 rounded-lg border border-dashed text-gray-500">
                        No wings added yet. Click "Add Wing" to get started.
                    </div>
                )}
            </div>

            <WingModal
                isOpen={wingModalOpen}
                onClose={() => setWingModalOpen(false)}
                onSave={handleSaveWing}
                wingForm={wingForm} setWingForm={setWingForm}
                floorInput={floorInput} setFloorInput={setFloorInput}
                currentWingFloors={currentWingFloors} editingFloorIndex={editingFloorIndex}
                onAddFloor={handleAddOrUpdateFloorRow} onEditFloor={handleEditFloorRow} onDeleteFloor={handleDeleteFloorRow}
            />

            <Modal
                isOpen={viewWingModalOpen}
                onClose={() => setViewWingModalOpen(false)}
                title={`Details: ${selectedWing?.wingName || "Wing"}`}
                size="lg"
            >
                {selectedWing ? (
                    <div className="space-y-4">
                        <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3 mx-2">
                                <p className="text-xs text-gray-500 uppercase">Floors</p>
                                <p className="text-md font-semibold">{selectedWing.noOfFloors}</p>
                            </div>
                            <div className="flex items-center gap-3 mx-2">
                                <p className="text-xs text-gray-500 uppercase">Properties</p>
                                <p className="text-md font-semibold">{selectedWing.noOfProperties}</p>
                            </div>
                        </div>

                        {selectedWing.floors && selectedWing.floors.length > 0 ? (
                            <div className="max-h-60 overflow-y-auto border rounded">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-100 sticky top-0">
                                        <tr>
                                            <th className="p-2 border-b">Floor</th>
                                            <th className="p-2 border-b">Type</th>
                                            <th className="p-2 border-b">Property</th>
                                            <th className="p-2 border-b">Area</th>
                                            <th className="p-2 border-b">Qty</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {selectedWing.floors.map((f, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="p-2">{f.floorName}</td>
                                                <td className="p-2">{f.propertyType}</td>
                                                <td className="p-2">{f.property}</td>
                                                <td className="p-2">{f.area}</td>
                                                <td className="p-2">{f.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 text-center">No floor details available.</p>
                        )}
                    </div>
                ) : null}
            </Modal>
        </div>
    )
}
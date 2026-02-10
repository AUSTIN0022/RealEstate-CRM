import { useState } from "react"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput" // Ensure this is imported
import { useToast } from "../../../components/ui/Toast"
import { Edit, Plus, Trash2, Save, X } from "lucide-react"
import { projectService } from "../../../services/projectService"
import { useAuth } from "../../../contexts/AuthContext"

export default function PaymentStagesTab({ disbursements, projectId, onRefresh }) {
    const { user } = useAuth()
    const [isEditingDisbursements, setIsEditingDisbursements] = useState(false)
    const [disbursementForm, setDisbursementForm] = useState([])
    const [saving, setSaving] = useState(false)
    const { success, error: toastError } = useToast()

    // Initialize form with current data
    const handleEditClick = () => {
        setDisbursementForm(
            disbursements && disbursements.length > 0
                ? disbursements
                : [{ disbursementTitle: "", description: "", percentage: "" }]
        )
        setIsEditingDisbursements(true)
    }

    // Handle Input Change
    const handleStageChange = (index, field, value) => {
        const updated = [...disbursementForm]
        updated[index][field] = value
        setDisbursementForm(updated)
    }

    // Add New Row
    const handleAddStage = () => {
        setDisbursementForm([
            ...disbursementForm,
            { disbursementTitle: "", description: "", percentage: "" },
        ])
    }

    // Remove Row
    const handleRemoveStage = (index) => {
        const updated = disbursementForm.filter((_, i) => i !== index)
        setDisbursementForm(updated)
    }

    // Save Data
    const handleSave = async () => {
        const totalPercentage = disbursementForm.reduce(
            (sum, item) => sum + (parseFloat(item.percentage) || 0),
            0
        )

        if (totalPercentage !== 100) {
            toastError(`Total percentage must constitute 100%. Current total: ${totalPercentage}%`)
            return
        }

        setSaving(true)
        try {
            console.log("Sending Disbursement Data:", disbursementForm)

            await projectService.updateDisbursements(projectId, disbursementForm)

            success("Payment stages updated")
            setIsEditingDisbursements(false)
            if (onRefresh) onRefresh()
        } catch (err) {
            console.error(err)
            toastError("Failed to update stages")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Payment Stages</h3>

                {/* Toggle Buttons */}
                {user?.role === "ADMIN" && (
                    !isEditingDisbursements ? (
                        <Button onClick={handleEditClick} size="sm" variant="outline">
                            <Edit size={16} className="mr-2" /> Edit Stages
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsEditingDisbursements(false)}
                            >
                                <X size={16} className="mr-2" /> Cancel
                            </Button>
                            <Button variant="primary" size="sm" onClick={handleSave} loading={saving}>
                                <Save size={16} className="mr-2" /> Save
                            </Button>
                        </div>
                    )
                )}
            </div>

            {isEditingDisbursements ? (
                /* --- EDIT MODE FORM --- */
                <div className="space-y-4">
                    {disbursementForm.map((stage, idx) => (
                        <div key={idx} className="flex flex-col md:flex-row gap-4 items-end border p-4 rounded-lg bg-gray-50">
                            <div className="flex-1 w-full">
                                <label className="text-xs font-medium text-gray-500">Stage Title</label>
                                <FormInput
                                    placeholder="e.g. Plinth Level"
                                    value={stage.disbursementTitle}
                                    onChange={(e) => handleStageChange(idx, "disbursementTitle", e.target.value)}
                                />
                            </div>
                            <div className="flex-[2] w-full">
                                <label className="text-xs font-medium text-gray-500">Description</label>
                                <FormInput
                                    placeholder="Details..."
                                    value={stage.description}
                                    onChange={(e) => handleStageChange(idx, "description", e.target.value)}
                                />
                            </div>
                            <div className="w-full md:w-32">
                                <label className="text-xs font-medium text-gray-500">Percentage (%)</label>
                                <FormInput
                                    type="number"
                                    placeholder="10"
                                    value={stage.percentage}
                                    onChange={(e) => handleStageChange(idx, "percentage", e.target.value)}
                                />
                            </div>
                            <Button
                                variant="danger"
                                size="icon"
                                className="mb-1"
                                onClick={() => handleRemoveStage(idx)}
                            >
                                <Trash2 size={18} />
                            </Button>
                        </div>
                    ))}

                    <Button variant="outline" className="w-full border-dashed" onClick={handleAddStage}>
                        <Plus size={16} className="mr-2" /> Add Stage
                    </Button>
                </div>
            ) : (
                /* --- VIEW MODE TABLE --- */
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stage</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Percentage</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {disbursements && disbursements.length > 0 ? (
                                disbursements.map((d, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                            {d.disbursementTitle}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{d.description}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right font-bold text-blue-600">
                                            {d.percentage}%
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                                        No payment stages defined.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
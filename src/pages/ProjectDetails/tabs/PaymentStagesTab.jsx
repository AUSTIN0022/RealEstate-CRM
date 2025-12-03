import { useState } from "react"
import { Button } from "../../../components/ui/Button"
import { Edit } from "lucide-react"
// Note: Actual update logic wasn't fully present in original file beyond opening edit state
// But we preserve the display and the toggle button

export default function PaymentStagesTab({ disbursements, projectId, onRefresh }) {
  const [isEditingDisbursements, setIsEditingDisbursements] = useState(false)
  const [disbursementForm, setDisbursementForm] = useState([])

  // Logic to handle editing would go here (similar to other tabs)
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Payment Stages</h3>
        {!isEditingDisbursements && (
          <Button
            onClick={() => {
              setDisbursementForm(
                disbursements.length
                  ? disbursements
                  : [{ disbursementTitle: "", description: "", percentage: "" }],
              )
              setIsEditingDisbursements(true)
            }}
          >
            <Edit size={18} className="mr-2" /> Edit Stages
          </Button>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                Percentage
              </th>
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
    </div>
  )
}
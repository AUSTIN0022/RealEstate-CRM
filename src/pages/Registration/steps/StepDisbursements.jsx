import { Button } from "../../../components/ui/Button"
import { Table } from "../../../components/ui/Table"
import { Plus } from "lucide-react"

export default function StepDisbursements({ disbursements, setDisbursements, onOpenModal }) {
  const total = disbursements.reduce((sum, d) => sum + Number.parseFloat(d.percentage), 0)
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Disbursements</h2>
        <Button onClick={onOpenModal} variant="primary" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
          <Plus size={18} /> Add Disbursement
        </Button>
      </div>
      {disbursements.length > 0 ? (
        <>
          <div className="overflow-x-auto -mx-4 md:mx-0">
            <div className="inline-block min-w-full px-4 md:px-0">
              <Table
                columns={[{ key: "title", label: "Title" }, { key: "description", label: "Description" }, { key: "percentage", label: "Percentage" }]}
                data={disbursements}
                actions={(row) => [{ label: "Delete", onClick: () => setDisbursements(disbursements.filter((d) => d.disbursementId !== row.disbursementId)) }]}
              />
            </div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm md:text-base font-medium text-blue-900">Total: {total}%</p>
          </div>
        </>
      ) : (
        <p className="text-gray-600 text-center py-8 text-sm md:text-base">No disbursements added yet</p>
      )}
    </div>
  )
}
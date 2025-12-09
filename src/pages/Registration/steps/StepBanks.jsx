import { Button } from "../../../components/ui/Button"
import { Table } from "../../../components/ui/Table"
import { Plus } from "lucide-react"

export default function StepBanks({ banks, setBanks, onOpenModal }) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-900">Bank Information</h2>
        <Button onClick={onOpenModal} variant="primary" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
          <Plus size={18} /> Add Bank
        </Button>
      </div>
      {banks.length > 0 ? (
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <div className="inline-block min-w-full px-4 md:px-0">
            <Table
              columns={[
                { key: "bankName", label: "Bank Name" },
                { key: "branchName", label: "Branch" },
                { key: "accountNo", label: "Account No" }, // Added
                { key: "accountType", label: "Type" },     // Added
                { key: "contactPerson", label: "Contact Person" },
                { key: "contactNumber", label: "Contact Number" },
              ]}
              data={banks}
              actions={(row) => [{ label: "Delete", onClick: () => setBanks(banks.filter((b) => b.bankDetailId !== row.bankDetailId)) }]}
            />
          </div>
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8 text-sm md:text-base">No banks added yet</p>
      )}
    </div>
  )
}
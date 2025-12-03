import { Card } from "../../../components/ui/Card"
import { Table } from "../../../components/ui/Table"
import { Badge } from "../../../components/ui/Badge"

export default function EnquiriesTab({ enquiries }) {
  return (
    <Card>
      {enquiries && enquiries.length > 0 ? (
        <div className="overflow-x-auto">
          <Table
            columns={[
              {
                key: "clientName",
                label: "Client Name",
                render: (val) => <p className="font-medium text-gray-900">{val}</p>,
              },
              {
                key: "budget",
                label: "Budget",
                render: (val) => <p className="text-gray-700">{val}</p>,
              },
              {
                key: "status",
                label: "Status",
                render: (val) => <Badge status={val}>{val}</Badge>,
              },
            ]}
            data={enquiries}
          />
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">No enquiries for this project</div>
      )}
    </Card>
  )
}
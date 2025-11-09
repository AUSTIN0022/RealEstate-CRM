import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { AppLayout } from "../components/layout/AppLayout"
import { Card } from "../components/ui/Card"
import { Tabs } from "../components/ui/Tabs"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { ArrowLeft, Loader2 } from "lucide-react"
import { clientService } from "../services/clientService"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"
import { useToast } from "../components/ui/Toast"

export default function ClientProfilePage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { error: showError } = useToast()

  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enquiries] = useState([])
  const [bookings] = useState([])

  useEffect(() => {
    const fetchClientDetails = async () => {
      try {
        setLoading(true)
        const clientData = await clientService.getClientById(clientId)
        setClient(clientData)
      } catch (err) {
        console.error("[v0] Failed to fetch client details:", err)
        showError("Failed to load client details")
      } finally {
        setLoading(false)
      }
    }

    if (clientId) {
      fetchClientDetails()
    }
  }, [clientId])

  if (loading) {
    return (
      <AppLayout>
        <SkeletonLoader type="profile" count={5} />
      </AppLayout>
    )
  }

  if (!client) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Client not found</p>
          <Button onClick={() => navigate("/clients")} className="mt-4">
            Back to Clients
          </Button>
        </div>
      </AppLayout>
    )
  }

  const tabs = [
    {
      label: "Overview",
      content: (
        <Card>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            <div>
              <p className="text-xs md:text-sm text-gray-600">Email</p>
              <p className="text-base md:text-lg font-semibold text-gray-900 mt-1 break-all">{client.email}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Mobile</p>
              <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{client.mobileNumber}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">City</p>
              <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{client.city}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Occupation</p>
              <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{client.occupation}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Company</p>
              <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{client.company || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs md:text-sm text-gray-600">Address</p>
              <p className="text-base md:text-lg font-semibold text-gray-900 mt-1">{client.address || "N/A"}</p>
            </div>
          </div>
        </Card>
      ),
    },
    {
      label: "Enquiries",
      content: (
        <Card>
          {enquiries.length > 0 ? (
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <div className="inline-block min-w-full px-3 md:px-0">
                <Table
                  columns={[
                    { key: "budget", label: "Budget" },
                    { key: "reference", label: "Reference" },
                    { key: "status", label: "Status" },
                  ]}
                  data={enquiries}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8 text-sm">No enquiries</p>
          )}
        </Card>
      ),
    },
    {
      label: "Bookings",
      content: (
        <Card>
          {bookings.length > 0 ? (
            <div className="overflow-x-auto -mx-3 md:mx-0">
              <div className="inline-block min-w-full px-3 md:px-0">
                <Table
                  columns={[
                    { key: "bookingAmount", label: "Booking Amount" },
                    { key: "agreementAmount", label: "Agreement Amount" },
                    { key: "bookingDate", label: "Booking Date" },
                  ]}
                  data={bookings}
                />
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-center py-8 text-sm">No bookings</p>
          )}
        </Card>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-4 md:space-y-6">
        <div className="flex items-start gap-3 md:gap-4">
          <button
            onClick={() => navigate("/clients")}
            className="p-1 md:p-2 hover:bg-gray-100 rounded-lg flex-shrink-0 mt-1"
          >
            <ArrowLeft size={20} className="text-gray-600 md:w-6 md:h-6" />
          </button>
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 truncate">{client.clientName}</h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base truncate">{client.email}</p>
          </div>
        </div>

        <Tabs tabs={tabs} />
      </div>
    </AppLayout>
  )
}

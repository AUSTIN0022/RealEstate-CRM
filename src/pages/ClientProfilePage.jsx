"use client"

import { useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useData } from "../contexts/DataContext"
import { AppLayout } from "../components/layout/AppLayout"
import { Card } from "../components/ui/Card"
import { Tabs } from "../components/ui/Tabs"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { ArrowLeft } from "lucide-react"

export default function ClientProfilePage() {
  const { clientId } = useParams()
  const navigate = useNavigate()
  const { data } = useData()

  const client = useMemo(() => {
    return data.clients.find((c) => c.clientId === clientId && !c.isDeleted)
  }, [data.clients, clientId])

  const enquiries = useMemo(() => {
    return data.enquiries.filter((e) => e.clientId === clientId && !e.isDeleted)
  }, [data.enquiries, clientId])

  const bookings = useMemo(() => {
    return data.bookings.filter((b) => b.clientId === clientId && !b.isDeleted)
  }, [data.bookings, clientId])

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
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{client.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Mobile</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{client.mobileNumber}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">City</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{client.city}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Occupation</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{client.occupation}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Company</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{client.company}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">PAN</p>
              <p className="text-lg font-semibold text-gray-900 mt-1">{client.panNo}</p>
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
            <Table
              columns={[
                { key: "budget", label: "Budget" },
                { key: "reference", label: "Reference" },
                { key: "status", label: "Status" },
              ]}
              data={enquiries}
            />
          ) : (
            <p className="text-gray-600 text-center py-8">No enquiries</p>
          )}
        </Card>
      ),
    },
    {
      label: "Bookings",
      content: (
        <Card>
          {bookings.length > 0 ? (
            <Table
              columns={[
                { key: "bookingAmount", label: "Booking Amount" },
                { key: "agreementAmount", label: "Agreement Amount" },
                { key: "bookingDate", label: "Booking Date" },
              ]}
              data={bookings}
            />
          ) : (
            <p className="text-gray-600 text-center py-8">No bookings</p>
          )}
        </Card>
      ),
    },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/clients")} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{client.clientName}</h1>
            <p className="text-gray-600 mt-1">{client.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <Tabs tabs={tabs} />
      </div>
    </AppLayout>
  )
}

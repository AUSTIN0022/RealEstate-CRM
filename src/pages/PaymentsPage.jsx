"use client"

import { useState, useMemo } from "react"
import { useData } from "../contexts/DataContext"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"
import { Tabs } from "../components/ui/Tabs"
import { Table } from "../components/ui/Table"
import { Modal, } from "../components/ui/Modal"
import { Card } from "../components/ui/Card"
import { Button  } from "../components/ui/Button"
import { FormInput } from "../components/ui/FormInput"
import { FormSelect } from "../components/ui/FormSelect"
import { Drawer } from "../components/ui/Drawer"
import { Badge } from "../components/ui/Badge"

import { Plus } from "lucide-react"
import { v4 as uuidv4 } from "uuid"
import { formatCurrency } from "../utils/helpers"

export default function PaymentsPage() {
  const { data, addClientDisbursement } = useData()
  const { success, error } = useToast()
  const [showModal, setShowModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState("")

  const [form, setForm] = useState({
    clientId: "",
    propertyId: "",
    disbursementId: "",
    paymentType: "FullPayment",
    amount: "",
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMethod: "",
  })

  const projects = useMemo(() => {
    return data.projects.filter((p) => !p.isDeleted)
  }, [data.projects])

  const disbursements = useMemo(() => {
    if (!selectedProject) return []
    return data.disbursements.filter((d) => d.projectId === selectedProject && !d.isDeleted)
  }, [data.disbursements, selectedProject])

  const bookings = useMemo(() => {
    if (!selectedProject) return []
    return data.bookings.filter((b) => b.projectId === selectedProject && !b.isDeleted)
  }, [data.bookings, selectedProject])

  const clientDisbursements = useMemo(() => {
    if (!selectedProject) return []
    return data.clientDisbursements.filter((cd) => cd.projectId === selectedProject && !cd.isDeleted)
  }, [data.clientDisbursements, selectedProject])

  const handleRecordPayment = () => {
    if (!form.clientId || !form.propertyId || !form.disbursementId || !form.amount) {
      error("Please fill all required fields")
      return
    }

    const disbursement = data.disbursements.find((d) => d.disbursementId === form.disbursementId)
    const booking = data.bookings.find((b) => b.propertyId === form.propertyId)

    if (!disbursement || !booking) {
      error("Invalid disbursement or booking")
      return
    }

    const disbursementValue = (Number.parseFloat(booking.agreementAmount) * disbursement.percentage) / 100
    if (Number.parseFloat(form.amount) > disbursementValue) {
      error(`Amount cannot exceed ${formatCurrency(disbursementValue)}`)
      return
    }

    const clientDisbursement = {
        clientDisbursementId: uuidv4(), // ✅ unique ID for this record
        projectId: selectedProject,
        clientId: form.clientId,
        propertyId: form.propertyId,
        bookingId: booking.bookingId,
        disbursementId: form.disbursementId, // ✅ actual reference
        percentageValue: disbursementValue,
        paidAmount: form.amount,
        paidDate: form.paymentDate,
        paymentType: form.paymentType,
        paymentMethod: form.paymentMethod,
        partialPaymentId: form.paymentType === "PartialPayment" ? `PP-${uuidv4().slice(0, 8)}` : null,
        demandLetterPdfUrl: null,
        isDeleted: false,
    }


    addClientDisbursement(clientDisbursement)
    success("Payment recorded successfully")
    setForm({
      clientId: "",
      propertyId: "",
      disbursementId: "",
      paymentType: "FullPayment",
      amount: "",
      paymentDate: new Date().toISOString().split("T")[0],
      paymentMethod: "",
    })
    setShowModal(false)
  }

  const getClientName = (clientId) => {
    return data.clients.find((c) => c.clientId === clientId)?.clientName || "Unknown"
  }

  const getUnitNumber = (propertyId) => {
    return data.flats.find((f) => f.propertyId === propertyId)?.unitNumber || "Unknown"
  }

  const getDisbursementTitle = (disbursementId) => {
    return data.disbursements.find((d) => d.disbursementId === disbursementId)?.disbursementTitle || "Unknown"
  }

  const disbursementsTab = (
    <Card>
      <div className="space-y-6">
        {disbursements.map((d) => {
          const relatedPayments = clientDisbursements.filter((cd) => cd.disbursementId === d.disbursementId)
          return (
            <div key={d.disbursementId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{d.disbursementTitle}</h3>
                  <p className="text-sm text-gray-600">{d.description}</p>
                </div>
                <span className="text-lg font-bold text-indigo-600">{d.percentage}%</span>
              </div>

              {relatedPayments.length > 0 ? (
                <Table
                  columns={[
                    { key: "clientId", label: "Client", render: (val) => getClientName(val) },
                    { key: "propertyId", label: "Unit", render: (val) => getUnitNumber(val) },
                    { key: "paidAmount", label: "Amount", render: (val) => formatCurrency(val) },
                    { key: "paidDate", label: "Date" },
                    { key: "paymentType", label: "Type" },
                  ]}
                  data={relatedPayments}
                />
              ) : (
                <p className="text-gray-600 text-sm">No payments recorded</p>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )

  const clientPaymentsTab = (
    <Card>
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const client = data.clients.find((c) => c.clientId === booking.clientId)
            const unit = data.flats.find((f) => f.propertyId === booking.propertyId)
            const bookingPayments = clientDisbursements.filter((cd) => cd.bookingId === booking.bookingId)

            return (
              <div key={booking.bookingId} className="border border-gray-200 rounded-lg p-4">
                <div className="mb-3">
                  <p className="font-semibold text-gray-900">{client?.clientName}</p>
                  <p className="text-sm text-gray-600">{unit?.unitNumber}</p>
                </div>

                {bookingPayments.length > 0 ? (
                  <Table
                    columns={[
                      { key: "disbursementId", label: "Disbursement", render: (val) => getDisbursementTitle(val) },
                      { key: "paidAmount", label: "Amount", render: (val) => formatCurrency(val) },
                      { key: "paidDate", label: "Date" },
                      { key: "paymentType", label: "Type" },
                    ]}
                    data={bookingPayments}
                  />
                ) : (
                  <p className="text-gray-600 text-sm">No payments recorded</p>
                )}
              </div>
            )
          })}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-8">No bookings for this project</p>
      )}
    </Card>
  )

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
            <p className="text-gray-600 mt-1">Manage disbursements and payments</p>
          </div>
          <Button onClick={() => setShowModal(true)} variant="primary">
            <Plus size={20} />
            Record Payment
          </Button>
        </div>

        {/* Project Filter */}
        <div>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p.projectId} value={p.projectId}>
                {p.projectName}
              </option>
            ))}
          </select>
        </div>

        {/* Tabs */}
        {selectedProject && (
          <Tabs
            tabs={[
              { label: "Disbursements", content: disbursementsTab },
              { label: "Client Payments", content: clientPaymentsTab },
            ]}
          />
        )}

        {/* Record Payment Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Record Payment" size="lg">
          <div className="space-y-4">
            <FormSelect
              label="Project"
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              options={projects.map((p) => ({ value: p.projectId, label: p.projectName }))}
              required
            />

            {selectedProject && (
              <>
                <FormSelect
                  label="Client"
                  value={form.clientId}
                  onChange={(e) => setForm({ ...form, clientId: e.target.value })}
                  options={bookings.map((b) => {
                    const client = data.clients.find((c) => c.clientId === b.clientId)
                    return { value: b.clientId, label: client?.clientName }
                  })}
                  required
                />

                <FormSelect
                  label="Unit"
                  value={form.propertyId}
                  onChange={(e) => setForm({ ...form, propertyId: e.target.value })}
                  options={bookings
                    .filter((b) => b.clientId === form.clientId)
                    .map((b) => {
                      const unit = data.flats.find((f) => f.propertyId === b.propertyId)
                      return { value: b.propertyId, label: unit?.unitNumber }
                    })}
                  required
                />

                <FormSelect
                  label="Disbursement"
                  value={form.disbursementId}
                  onChange={(e) => setForm({ ...form, disbursementId: e.target.value })}
                  options={disbursements.map((d) => ({ value: d.disbursementId, label: d.disbursementTitle }))}
                  required
                />

                <FormSelect
                  label="Payment Type"
                  value={form.paymentType}
                  onChange={(e) => setForm({ ...form, paymentType: e.target.value })}
                  options={[
                    { value: "FullPayment", label: "Full Payment" },
                    { value: "PartialPayment", label: "Partial Payment" },
                  ]}
                />

                <FormInput
                  label="Amount"
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  required
                />

                <FormInput
                  label="Payment Date"
                  type="date"
                  value={form.paymentDate}
                  onChange={(e) => setForm({ ...form, paymentDate: e.target.value })}
                />

                <FormInput
                  label="Payment Method"
                  value={form.paymentMethod}
                  onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
                  placeholder="e.g., NEFT, Cheque, Cash"
                />
              </>
            )}

            <div className="flex gap-2 justify-end pt-4">
              <Button onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button onClick={handleRecordPayment} variant="primary">
                Record Payment
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </AppLayout>
  )
}

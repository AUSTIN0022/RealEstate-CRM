import { useState, useMemo } from "react"
import { useData } from "../contexts/DataContext"
import { useToast } from "../components/ui/Toast"
import { AppLayout } from "../components/layout/AppLayout"

import { Card } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { FormInput } from "../components/ui/FormInput"
import { FormSelect } from "../components/ui/FormSelect"
import { Drawer } from "../components/ui/Drawer"
import { Badge } from "../components/ui/Badge"
import { Modal, ModalSection, ModalSummaryCard } from "../components/ui/Modal"

import { v4 as uuidv4 } from "uuid"
import { FLAT_STATUS } from "../utils/constants"
import { formatCurrency } from "../utils/helpers"

import { Building2, User, CreditCard, FileText } from "lucide-react"

export default function BookingsPage() {
  const { data, addBooking, updateFlat, updateEnquiry, addClient } = useData()
  const { success, error } = useToast()
  
  // State for main page filters
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedWing, setSelectedWing] = useState("")
  const [selectedUnit, setSelectedUnit] = useState(null)
  const [showDrawer, setShowDrawer] = useState(false)
  const [activeTab, setActiveTab] = useState("book")
  
  // State for Add Booking Modal
  const [showAddBookingModal, setShowAddBookingModal] = useState(false)
  const [createNewClient, setCreateNewClient] = useState(false)
  const [modalSelectedProject, setModalSelectedProject] = useState("")
  const [modalSelectedWing, setModalSelectedWing] = useState("")
  const [selectedFlatForBooking, setSelectedFlatForBooking] = useState(null)

  // Booking form
  const [bookingForm, setBookingForm] = useState({
    clientId: "",
    bookingAmount: "",
    agreementAmount: "",
    bookingDate: new Date().toISOString().split("T")[0],
    chequeNo: "",
    gstPercentage: "18",
    enquiryId: "",
  })

  // New client form
  const [newClientForm, setNewClientForm] = useState({
    clientName: "",
    email: "",
    mobileNumber: "",
  })

  // Registration form
  const [registrationForm, setRegistrationForm] = useState({
    registrationDate: new Date().toISOString().split("T")[0],
  })

  // Cancellation form
  const [cancellationForm, setCancellationForm] = useState({
    reason: "",
  })

  const projects = useMemo(() => {
    return data.projects.filter((p) => !p.isDeleted)
  }, [data.projects])

  const wings = useMemo(() => {
    if (!selectedProject) return []
    return data.wings.filter((w) => w.projectId === selectedProject && !w.isDeleted)
  }, [data.wings, selectedProject])

  const floors = useMemo(() => {
    if (!selectedWing) return []
    return data.floors.filter((f) => f.wingId === selectedWing && !f.isDeleted)
  }, [data.floors, selectedWing])

  const flats = useMemo(() => {
    if (!selectedWing) return []
    return data.flats.filter((f) => f.wingId === selectedWing && !f.isDeleted)
  }, [data.flats, selectedWing])

  // Modal specific wings based on modalSelectedProject
  const modalWings = useMemo(() => {
    if (!modalSelectedProject) return []
    return data.wings.filter((w) => w.projectId === modalSelectedProject && !w.isDeleted)
  }, [data.wings, modalSelectedProject])

  // Modal specific flats based on modalSelectedWing
  const modalFlats = useMemo(() => {
    if (!modalSelectedWing) return []
    return data.flats.filter((f) => f.wingId === modalSelectedWing && !f.isDeleted)
  }, [data.flats, modalSelectedWing])

  const clients = useMemo(() => {
    return data.clients.filter((c) => !c.isDeleted)
  }, [data.clients])

  const enquiries = useMemo(() => {
    return data.enquiries.filter((e) => !e.isDeleted && e.status === "ONGOING")
  }, [data.enquiries])

  // Add Booking from modal handler
  const handleAddBookingFromModal = () => {
    if (createNewClient) {
      if (!newClientForm.clientName || !newClientForm.mobileNumber || !newClientForm.email) {
        error("Please fill all client details")
        return
      }
      if (!/^\d{10}$/.test(newClientForm.mobileNumber)) {
        error("Mobile number must be 10 digits")
        return
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newClientForm.email)) {
        error("Invalid email format")
        return
      }
    }

    if (!bookingForm.clientId && !createNewClient) {
      error("Please select or create a client")
      return
    }

    if (!selectedFlatForBooking) {
      error("Please select a flat")
      return
    }

    if (!bookingForm.bookingAmount || !bookingForm.agreementAmount) {
      error("Please fill booking and agreement amounts")
      return
    }

    let clientId = bookingForm.clientId

    // Create new client if needed
    if (createNewClient) {
      const newClient = {
        clientId: uuidv4(),
        clientName: newClientForm.clientName,
        email: newClientForm.email,
        mobileNumber: newClientForm.mobileNumber,
        dob: "",
        city: "",
        address: "",
        occupation: "",
        company: "",
        panNo: "",
        aadharNo: "",
        createdDate: new Date().toISOString().split("T")[0],
        isDeleted: false,
      }
      const createdClient = addClient(newClient)
      clientId = createdClient.clientId
    }

    const booking = {
      bookingId: uuidv4(),
      projectId: modalSelectedProject,
      clientId: clientId,
      propertyId: selectedFlatForBooking.propertyId,
      enquiryId: bookingForm.enquiryId || null,
      bookingAmount: bookingForm.bookingAmount,
      agreementAmount: bookingForm.agreementAmount,
      bookingDate: bookingForm.bookingDate,
      chequeNo: bookingForm.chequeNo,
      gstPercentage: Number.parseFloat(bookingForm.gstPercentage),
      isRegistered: false,
      isCancelled: false,
      isDeleted: false,
    }

    addBooking(booking)
    updateFlat(selectedFlatForBooking.propertyId, { status: FLAT_STATUS.BOOKED })

    if (bookingForm.enquiryId) {
      updateEnquiry(bookingForm.enquiryId, { status: "COMPLETED" })
    }

    success("Booking created successfully!")
    setShowAddBookingModal(false)
    resetAddBookingForm()
  }

  // Reset function for Add Booking modal
  const resetAddBookingForm = () => {
    setBookingForm({
      clientId: "",
      bookingAmount: "",
      agreementAmount: "",
      bookingDate: new Date().toISOString().split("T")[0],
      chequeNo: "",
      gstPercentage: "18",
      enquiryId: "",
    })
    setNewClientForm({
      clientName: "",
      email: "",
      mobileNumber: "",
    })
    setSelectedFlatForBooking(null)
    setCreateNewClient(false)
    setModalSelectedProject("")
    setModalSelectedWing("")
  }

  const handleBookUnit = () => {
    if (!bookingForm.clientId || !bookingForm.bookingAmount || !bookingForm.agreementAmount) {
      error("Please fill all required fields")
      return
    }

    const booking = {
      bookingId: uuidv4(),
      projectId: selectedProject,
      clientId: bookingForm.clientId,
      propertyId: selectedUnit.propertyId,
      enquiryId: bookingForm.enquiryId || null,
      bookingAmount: bookingForm.bookingAmount,
      agreementAmount: bookingForm.agreementAmount,
      bookingDate: bookingForm.bookingDate,
      chequeNo: bookingForm.chequeNo,
      gstPercentage: Number.parseFloat(bookingForm.gstPercentage),
      isRegistered: false,
      isCancelled: false,
      isDeleted: false,
    }

    addBooking(booking)
    updateFlat(selectedUnit.propertyId, { status: FLAT_STATUS.BOOKED })

    if (bookingForm.enquiryId) {
      updateEnquiry(bookingForm.enquiryId, { status: "COMPLETED" })
    }

    success("Unit booked successfully!")
    setShowDrawer(false)
    resetForms()
  }

  const handleRegisterUnit = () => {
    const booking = data.bookings.find((b) => b.propertyId === selectedUnit.propertyId && !b.isDeleted)
    if (!booking) {
      error("No booking found for this unit")
      return
    }

    updateFlat(selectedUnit.propertyId, { status: FLAT_STATUS.REGISTERED })
    success("Unit registered successfully!")
    setShowDrawer(false)
    resetForms()
  }

  const handleCancelBooking = () => {
    if (!cancellationForm.reason.trim()) {
      error("Please provide a cancellation reason")
      return
    }

    updateFlat(selectedUnit.propertyId, { status: FLAT_STATUS.VACANT })
    success("Booking cancelled successfully!")
    setShowDrawer(false)
    resetForms()
  }

  const resetForms = () => {
    setBookingForm({
      clientId: "",
      bookingAmount: "",
      agreementAmount: "",
      bookingDate: new Date().toISOString().split("T")[0],
      chequeNo: "",
      gstPercentage: "18",
      enquiryId: "",
    })
    setRegistrationForm({ registrationDate: new Date().toISOString().split("T")[0] })
    setCancellationForm({ reason: "" })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case FLAT_STATUS.VACANT:
        return "bg-green-100 hover:bg-green-200"
      case FLAT_STATUS.BOOKED:
        return "bg-blue-100 hover:bg-blue-200"
      case FLAT_STATUS.REGISTERED:
        return "bg-red-100 hover:bg-red-200"
      default:
        return "bg-gray-100 hover:bg-gray-200"
    }
  }

  const getStatusTextColor = (status) => {
    switch (status) {
      case FLAT_STATUS.VACANT:
        return "text-green-800"
      case FLAT_STATUS.BOOKED:
        return "text-blue-800"
      case FLAT_STATUS.REGISTERED:
        return "text-red-800"
      default:
        return "text-gray-800"
    }
  }

  const getClientName = (clientId) => {
    return data.clients.find((c) => c.clientId === clientId)?.clientName || "Unknown"
  }

  const getBookingForUnit = (propertyId) => {
    return data.bookings.find((b) => b.propertyId === propertyId && !b.isDeleted)
  }

  // Calculate summary items for modal
  const summaryItems = [
    {
      label: "Booking Amount:",
      value: bookingForm.bookingAmount ? `₹${Number(bookingForm.bookingAmount).toLocaleString('en-IN')}` : '—'
    },
    {
      label: "Agreement Amount:",
      value: bookingForm.agreementAmount ? `₹${Number(bookingForm.agreementAmount).toLocaleString('en-IN')}` : '—'
    },
    ...(bookingForm.gstPercentage && bookingForm.agreementAmount ? [{
      label: `GST (${bookingForm.gstPercentage}%):`,
      value: `₹${((Number(bookingForm.agreementAmount) * Number(bookingForm.gstPercentage)) / 100).toLocaleString('en-IN')}`,
      highlight: true,
      divider: true
    }] : [])
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600 mt-1">Manage unit bookings and registrations</p>
          </div>
          <Button onClick={() => setShowAddBookingModal(true)} variant="primary" className="flex items-center gap-2">
            <span>+</span> Add Booking
          </Button>
        </div>

        {/* Layout: Sidebar + Main */}
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-1/4 space-y-4">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Filters</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                  <select
                    value={selectedProject}
                    onChange={(e) => {
                      setSelectedProject(e.target.value)
                      setSelectedWing("")
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.projectId} value={p.projectId}>
                        {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProject && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Wing</label>
                    <select
                      value={selectedWing}
                      onChange={(e) => setSelectedWing(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none"
                    >
                      <option value="">Select Wing</option>
                      {wings.map((w) => (
                        <option key={w.wingId} value={w.wingId}>
                          {w.wingName}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Status Legend */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Status Legend</p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm text-gray-600">Vacant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm text-gray-600">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm text-gray-600">Registered</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Area */}
          <div className="flex-1 space-y-4">
            {selectedWing ? (
              <>
                {floors.map((floor) => {
                  const floorFlats = flats.filter((f) => f.floorId === floor.floorId)
                  const bookedCount = floorFlats.filter((f) => f.status === FLAT_STATUS.BOOKED).length
                  const totalCount = floorFlats.length

                  return (
                    <Card key={floor.floorId}>
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">{floor.floorName} Floor</h3>
                        <span className="text-sm text-gray-600">
                          {bookedCount}/{totalCount} booked
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-3">
                        {floorFlats.map((flat) => (
                          <button
                            key={flat.propertyId}
                            onClick={() => {
                              setSelectedUnit(flat)
                              setShowDrawer(true)
                            }}
                            className={`p-4 rounded-lg border-2 border-gray-200 transition cursor-pointer ${getStatusColor(flat.status)}`}
                          >
                            <p className={`font-bold text-lg ${getStatusTextColor(flat.status)}`}>{flat.unitNumber}</p>
                            <p className="text-xs text-gray-600 mt-1">{flat.area} sqft</p>
                            <p className="text-xs text-gray-600">{flat.bhk}</p>
                            <Badge status={flat.status} className="mt-2 text-xs">
                              {flat.status}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </Card>
                  )
                })}
              </>
            ) : (
              <Card>
                <div className="text-center py-12">
                  <p className="text-gray-600">Select a project and wing to view units</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Unit Action Drawer */}
        <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} title={selectedUnit?.unitNumber} width="w-96">
          {selectedUnit && (
            <div className="space-y-6">
              {/* Unit Info */}
              <div>
                <p className="text-sm text-gray-600">Area</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUnit.area} sqft</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="text-lg font-semibold text-gray-900">{selectedUnit.bhk}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge status={selectedUnit.status} className="mt-2">
                  {selectedUnit.status}
                </Badge>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("book")}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                      activeTab === "book"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Book Unit
                  </button>
                  {selectedUnit.status === FLAT_STATUS.BOOKED && (
                    <>
                      <button
                        onClick={() => setActiveTab("register")}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                          activeTab === "register"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Register
                      </button>
                      <button
                        onClick={() => setActiveTab("cancel")}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition ${
                          activeTab === "cancel"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "book" && selectedUnit.status === FLAT_STATUS.VACANT && (
                <div className="space-y-4">
                  <FormSelect
                    label="Client"
                    value={bookingForm.clientId}
                    onChange={(e) => setBookingForm({ ...bookingForm, clientId: e.target.value })}
                    options={clients.map((c) => ({ value: c.clientId, label: c.clientName }))}
                    required
                  />

                  <FormSelect
                    label="Link Enquiry (Optional)"
                    value={bookingForm.enquiryId}
                    onChange={(e) => setBookingForm({ ...bookingForm, enquiryId: e.target.value })}
                    options={enquiries.map((e) => {
                      const client = data.clients.find((c) => c.clientId === e.clientId)
                      return { value: e.enquiryId, label: `${client?.clientName} - ${e.budget}` }
                    })}
                  />

                  <FormInput
                    label="Booking Amount"
                    type="number"
                    value={bookingForm.bookingAmount}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingAmount: e.target.value })}
                    required
                  />

                  <FormInput
                    label="Agreement Amount"
                    type="number"
                    value={bookingForm.agreementAmount}
                    onChange={(e) => setBookingForm({ ...bookingForm, agreementAmount: e.target.value })}
                    required
                  />

                  <FormInput
                    label="Booking Date"
                    type="date"
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                  />

                  <FormInput
                    label="Cheque No"
                    value={bookingForm.chequeNo}
                    onChange={(e) => setBookingForm({ ...bookingForm, chequeNo: e.target.value })}
                  />

                  <FormInput
                    label="GST Percentage"
                    type="number"
                    value={bookingForm.gstPercentage}
                    onChange={(e) => setBookingForm({ ...bookingForm, gstPercentage: e.target.value })}
                  />

                  <Button onClick={handleBookUnit} variant="primary" className="w-full">
                    Book Unit
                  </Button>
                </div>
              )}

              {activeTab === "register" && selectedUnit.status === FLAT_STATUS.BOOKED && (
                <div className="space-y-4">
                  {(() => {
                    const booking = getBookingForUnit(selectedUnit.propertyId)
                    const client = booking ? data.clients.find((c) => c.clientId === booking.clientId) : null
                    return (
                      <>
                        <div>
                          <p className="text-sm text-gray-600">Client</p>
                          <p className="text-lg font-semibold text-gray-900">{client?.clientName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Booking Amount</p>
                          <p className="text-lg font-semibold text-gray-900">
                            {formatCurrency(booking?.bookingAmount)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Booking Date</p>
                          <p className="text-lg font-semibold text-gray-900">{booking?.bookingDate}</p>
                        </div>
                      </>
                    )
                  })()}

                  <FormInput
                    label="Registration Date"
                    type="date"
                    value={registrationForm.registrationDate}
                    onChange={(e) => setRegistrationForm({ registrationDate: e.target.value })}
                  />

                  <Button onClick={handleRegisterUnit} variant="success" className="w-full">
                    Register Property
                  </Button>
                </div>
              )}

              {activeTab === "cancel" && selectedUnit.status === FLAT_STATUS.BOOKED && (
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      This action will cancel the booking and mark the unit as vacant.
                    </p>
                  </div>

                  <FormInput
                    label="Cancellation Reason"
                    as="textarea"
                    value={cancellationForm.reason}
                    onChange={(e) => setCancellationForm({ reason: e.target.value })}
                    placeholder="Enter reason for cancellation..."
                    required
                  />

                  <Button onClick={handleCancelBooking} variant="danger" className="w-full">
                    Cancel Booking
                  </Button>
                </div>
              )}
            </div>
          )}
        </Drawer>

        {/* Add Booking Modal - Using Modal Component */}
        <Modal
          isOpen={showAddBookingModal}
          onClose={() => {
            setShowAddBookingModal(false)
            resetAddBookingForm()
          }}
          title="Create New Booking"
          headerIcon={FileText}
          size="5xl"
          variant="form"
          twoColumn={true}
          columnGap="lg"
          leftColumn={
            <>
              {/* Property Details Section */}
              <ModalSection title="Property Details" icon={Building2}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={modalSelectedProject}
                    onChange={(e) => {
                      setModalSelectedProject(e.target.value)
                      setModalSelectedWing("")
                      setSelectedFlatForBooking(null)
                    }}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                  >
                    <option value="">Select Project</option>
                    {projects.map((p) => (
                      <option key={p.projectId} value={p.projectId}>
                        {p.projectName}
                      </option>
                    ))}
                  </select>
                </div>

                {modalSelectedProject && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Wing <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={modalSelectedWing}
                        onChange={(e) => {
                          setModalSelectedWing(e.target.value)
                          setSelectedFlatForBooking(null)
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                      >
                        <option value="">Wing</option>
                        {modalWings.map((w) => (
                          <option key={w.wingId} value={w.wingId}>
                            {w.wingName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Flat <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedFlatForBooking?.propertyId || ""}
                        onChange={(e) => {
                          const flat = modalFlats.find((f) => f.propertyId === e.target.value)
                          setSelectedFlatForBooking(flat)
                        }}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                      >
                        <option value="">Unit</option>
                        {modalFlats
                          .filter((f) => f.status === FLAT_STATUS.VACANT)
                          .map((f) => (
                            <option key={f.propertyId} value={f.propertyId}>
                              {f.unitNumber} - {f.bhk}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                )}
              </ModalSection>

              {/* Client Information Section */}
              <ModalSection title="Client Information" icon={User}>
                {!createNewClient ? (
                  <div className="space-y-3">
                    <select
                      value={bookingForm.clientId}
                      onChange={(e) => setBookingForm({ ...bookingForm, clientId: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                    >
                      <option value="">Select Client</option>
                      {clients.map((c) => (
                        <option key={c.clientId} value={c.clientId}>
                          {c.clientName} - {c.mobileNumber}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => {
                        setCreateNewClient(true)
                        setBookingForm({ ...bookingForm, clientId: "" })
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                    >
                      <span className="text-lg">+</span> Create New Client
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 p-4 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border border-indigo-100">
                    <input
                      type="text"
                      value={newClientForm.clientName}
                      onChange={(e) => setNewClientForm({ ...newClientForm, clientName: e.target.value })}
                      placeholder="Client Name"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                    />
                    <input
                      type="tel"
                      value={newClientForm.mobileNumber}
                      onChange={(e) => setNewClientForm({ ...newClientForm, mobileNumber: e.target.value })}
                      placeholder="Mobile Number"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                    />
                    <input
                      type="email"
                      value={newClientForm.email}
                      onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                      placeholder="Email Address"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-white"
                    />
                    <button
                      onClick={() => setCreateNewClient(false)}
                      className="text-sm text-gray-600 hover:text-gray-700 font-medium flex items-center gap-1"
                    >
                      ← Use Existing Client
                    </button>
                  </div>
                )}
              </ModalSection>
            </>
          }
          rightColumn={
            <>
              {/* Financial Details Section */}
              <ModalSection title="Financial Details" icon={CreditCard}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Booking Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bookingForm.bookingAmount}
                      onChange={(e) => setBookingForm({ ...bookingForm, bookingAmount: e.target.value })}
                      placeholder="50,000"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Agreement Amount <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={bookingForm.agreementAmount}
                      onChange={(e) => setBookingForm({ ...bookingForm, agreementAmount: e.target.value })}
                      placeholder="50,00,000"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Booking Date</label>
                    <input
                      type="date"
                      value={bookingForm.bookingDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cheque Number</label>
                    <input
                      type="text"
                      value={bookingForm.chequeNo}
                      onChange={(e) => setBookingForm({ ...bookingForm, chequeNo: e.target.value })}
                      placeholder="CH123456"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GST Percentage</label>
                    <input
                      type="number"
                      value={bookingForm.gstPercentage}
                      onChange={(e) => setBookingForm({ ...bookingForm, gstPercentage: e.target.value })}
                      placeholder="18"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Link Enquiry</label>
                    <select
                      value={bookingForm.enquiryId}
                      onChange={(e) => setBookingForm({ ...bookingForm, enquiryId: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all bg-white"
                    >
                      <option value="">Optional</option>
                      {enquiries.map((e) => {
                        const client = data.clients.find((c) => c.clientId === e.clientId)
                        return (
                          <option key={e.enquiryId} value={e.enquiryId}>
                            {client?.clientName} - {e.budget}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>

                {/* Summary Card */}
                <ModalSummaryCard title="Booking Summary" items={summaryItems} className="mt-6" />
              </ModalSection>
            </>
          }
          footer={
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowAddBookingModal(false)
                  resetAddBookingForm()
                }}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddBookingFromModal}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white font-semibold rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-500/30"
              >
                Create Booking
              </button>
            </div>
          }
        />
      </div>
    </AppLayout>
  )
}
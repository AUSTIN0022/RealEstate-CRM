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

import { 
  Building2, User, CreditCard, FileText, LayoutGrid,
  Layers, CheckCircle2, Bookmark, BadgeCheck // <-- New icons added
} from "lucide-react"

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

  // --- Memoized Data ---

  const projects = useMemo(() => {
    return data.projects
      .filter((p) => !p.isDeleted)
      .map((p) => ({ value: p.projectId, label: p.projectName }))
  }, [data.projects])

  const wings = useMemo(() => {
    if (!selectedProject) return []
    return data.wings
      .filter((w) => w.projectId === selectedProject && !w.isDeleted)
      .map((w) => ({ value: w.wingId, label: w.wingName }))
  }, [data.wings, selectedProject])

  const floors = useMemo(() => {
    if (!selectedWing) return []
    // Sort floors by name (e.g., "Ground", "1st", "2nd")
    return data.floors
      .filter((f) => f.wingId === selectedWing && !f.isDeleted)
      .sort((a, b) => {
        const aNum = parseInt(a.floorName)
        const bNum = parseInt(b.floorName)
        if (a.floorName.toLowerCase().includes("ground")) return -1
        if (b.floorName.toLowerCase().includes("ground")) return 1
        return aNum - bNum
      })
  }, [data.floors, selectedWing])

  const flats = useMemo(() => {
    if (!selectedWing) return []
    return data.flats.filter((f) => f.wingId === selectedWing && !f.isDeleted)
  }, [data.flats, selectedWing])

  // Modal specific wings (memoized for modal)
  const modalWings = useMemo(() => {
    if (!modalSelectedProject) return []
    return data.wings
      .filter((w) => w.projectId === modalSelectedProject && !w.isDeleted)
      .map((w) => ({ value: w.wingId, label: w.wingName }))
  }, [data.wings, modalSelectedProject])

  // Modal specific flats (memoized for modal)
  const modalFlats = useMemo(() => {
    if (!modalSelectedWing) return []
    return data.flats
      .filter((f) => f.wingId === modalSelectedWing && !f.isDeleted)
      .map((f) => ({ 
        value: f.propertyId, 
        label: `${f.unitNumber} - ${f.bhk}`,
        disabled: f.status !== FLAT_STATUS.VACANT
      }))
  }, [data.flats, modalSelectedWing])

  const clients = useMemo(() => {
    return data.clients
      .filter((c) => !c.isDeleted)
      .map((c) => ({ value: c.clientId, label: `${c.clientName} - ${c.mobileNumber}` }))
  }, [data.clients])

  const enquiries = useMemo(() => {
    return data.enquiries
      .filter((e) => !e.isDeleted && e.status === "ONGOING")
      .map((e) => {
        const client = data.clients.find((c) => c.clientId === e.clientId)
        return { value: e.enquiryId, label: `${client?.clientName || 'N/A'} - ${e.budget}` }
      })
  }, [data.enquiries, data.clients])
  
  // Modal: Projects (formatted for FormSelect)
  const modalProjects = useMemo(() => {
    return data.projects
      .filter((p) => !p.isDeleted)
      .map((p) => ({ value: p.projectId, label: p.projectName }))
  }, [data.projects])

  // --- NEW: Memoized Wing Stats ---
  const wingStats = useMemo(() => {
    if (!selectedWing) {
      return { floorCount: 0, vacantCount: 0, bookedCount: 0, registeredCount: 0 }
    }
  
    const vacantCount = flats.filter(f => f.status === FLAT_STATUS.VACANT).length
    const bookedCount = flats.filter(f => f.status === FLAT_STATUS.BOOKED).length
    const registeredCount = flats.filter(f => f.status === FLAT_STATUS.REGISTERED).length
    const floorCount = floors.length
  
    return { floorCount, vacantCount, bookedCount, registeredCount }
  }, [flats, floors, selectedWing])


  // --- Event Handlers ---

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
        createdDate: new Date().toISOString().split("T[0]"),
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

  // --- Styling Helpers ---

  /**
   * Returns a modern, elegant set of classes for the unit card based on status.
   * This replaces the old getStatusColor and getStatusTextColor.
   */
  const getUnitCardStyles = (status) => {
    switch (status) {
      case FLAT_STATUS.VACANT:
        return "bg-green-50 text-green-900 border-green-200/80 hover:bg-green-100 hover:border-green-300 hover:shadow-green-500/10"
      case FLAT_STATUS.BOOKED:
        return "bg-blue-50 text-blue-900 border-blue-200/80 hover:bg-blue-100 hover:border-blue-300 hover:shadow-blue-500/10"
      case FLAT_STATUS.REGISTERED:
        return "bg-red-50 text-red-900 border-red-200/80 hover:bg-red-100 hover:border-red-300 hover:shadow-red-500/10"
      default:
        return "bg-gray-50 text-gray-900 border-gray-200/80 hover:bg-gray-100 hover:border-gray-300"
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
            <p className="text-gray-600 mt-1">Manage unit bookings and registrations</p>
          </div>
          <Button onClick={() => setShowAddBookingModal(true)} variant="primary" className="flex items-center justify-center gap-2 w-full sm:w-auto">
            <span>+</span> Add Booking
          </Button>
        </div>

        {/* --- NEW: STATS CARDS --- */}
        {selectedWing && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Floors */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm">
              <div className="p-2 bg-gray-100 rounded-full">
                <Layers className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Floors</p>
                <p className="text-2xl font-bold text-gray-900">{wingStats.floorCount}</p>
              </div>
            </div>
            
            {/* Card 2: Vacant */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm">
              <div className="p-2 bg-green-100 rounded-full">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Vacant Units</p>
                <p className="text-2xl font-bold text-green-700">{wingStats.vacantCount}</p>
              </div>
            </div>
            
            {/* Card 3: Booked */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm">
              <div className="p-2 bg-blue-100 rounded-full">
                <Bookmark className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Booked Units</p>
                <p className="text-2xl font-bold text-blue-700">{wingStats.bookedCount}</p>
              </div>
            </div>
            
            {/* Card 4: Registered */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 shadow-sm">
              <div className="p-2 bg-red-100 rounded-full">
                <BadgeCheck className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Registered Units</p>
                <p className="text-2xl font-bold text-red-700">{wingStats.registeredCount}</p>
              </div>
            </div>
          </div>
        )}
        {/* --- END STATS CARDS --- */}


        {/* Layout: Sidebar + Main (Responsive) */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 lg:max-w-xs">
            <Card className="p-5 space-y-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>

              <div className="space-y-4">
                <FormSelect
                  label="Project"
                  value={selectedProject}
                  onChange={(e) => {
                    setSelectedProject(e.target.value)
                    setSelectedWing("")
                  }}
                  options={projects}
                  placeholder="Select Project"
                />

                {selectedProject && (
                  <FormSelect
                    label="Wing"
                    value={selectedWing}
                    onChange={(e) => setSelectedWing(e.target.value)}
                    options={wings}
                    placeholder="Select Wing"
                  />
                )}

                {/* Status Legend */}
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">Status Legend</p>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded border border-green-600"></div>
                      <span className="text-sm text-gray-600">Vacant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded border border-blue-600"></div>
                      <span className="text-sm text-gray-600">Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded border border-red-600"></div>
                      <span className="text-sm text-gray-600">Registered</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Area */}
          <div className="flex-1 space-y-5">
            {selectedWing ? (
              <>
                {floors.map((floor) => {
                  const floorFlats = flats.filter((f) => f.floorId === floor.floorId)
                  const bookedCount = floorFlats.filter(
                    (f) => f.status === FLAT_STATUS.BOOKED || f.status === FLAT_STATUS.REGISTERED
                  ).length
                  const totalCount = floorFlats.length

                  if (totalCount === 0) return null // Don't render floor if no flats

                  return (
                    <Card key={floor.floorId} className="p-5" as="section">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 text-lg">{floor.floorName} Floor</h3>
                        <span className="text-sm text-gray-600 font-medium">
                          {bookedCount} / {totalCount} booked
                        </span>
                      </div>

                      {/* Responsive Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                        {floorFlats.map((flat) => (
                          <button
                            key={flat.propertyId}
                            onClick={() => {
                              setSelectedUnit(flat)
                              setActiveTab(flat.status === FLAT_STATUS.VACANT ? 'book' : 'register') // Default to logical tab
                              setShowDrawer(true)
                            }}
                            className={`p-4 rounded-lg border transition-all cursor-pointer shadow-sm hover:shadow-md ${getUnitCardStyles(
                              flat.status
                            )}`}
                          >
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-lg">{flat.unitNumber}</p>
                              <Badge status={flat.status} className="text-xs">
                                {flat.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">{flat.area} sqft</p>
                            <p className="text-sm text-gray-700">{flat.bhk}</p>
                          </button>
                        ))}
                      </div>
                    </Card>
                  )
                })}
              </>
            ) : (
              <Card>
                <div className="text-center py-20 px-6 flex flex-col items-center">
                  <LayoutGrid className="w-12 h-12 text-gray-300" />
                  <p className="text-gray-600 font-semibold mt-4 text-lg">Select a Project and Wing</p>
                  <p className="text-gray-500 text-sm mt-1">Once selected, all available units will be displayed here.</p>
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Unit Action Drawer */}
        <Drawer isOpen={showDrawer} onClose={() => setShowDrawer(false)} title={`Unit Details: ${selectedUnit?.unitNumber}`} width="w-full sm:w-96">
          {selectedUnit && (
            <div className="space-y-6">
              {/* Unit Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Area</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedUnit.area} sqft</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedUnit.bhk}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Status</p>
                <Badge status={selectedUnit.status} className="mt-2 text-sm px-3 py-1">
                  {selectedUnit.status}
                </Badge>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex gap-4 -mb-px">
                  {selectedUnit.status === FLAT_STATUS.VACANT && (
                    <button
                      onClick={() => setActiveTab("book")}
                      className={`px-1 py-3 font-medium text-sm border-b-2 transition ${
                        activeTab === "book"
                          ? "border-indigo-600 text-indigo-600"
                          : "border-transparent text-gray-600 hover:text-gray-900"
                      }`}
                    >
                      Book Unit
                    </button>
                  )}
                  {selectedUnit.status === FLAT_STATUS.BOOKED && (
                    <>
                      <button
                        onClick={() => setActiveTab("register")}
                        className={`px-1 py-3 font-medium text-sm border-b-2 transition ${
                          activeTab === "register"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Register
                      </button>
                      <button
                        onClick={() => setActiveTab("cancel")}
                        className={`px-1 py-3 font-medium text-sm border-b-2 transition ${
                          activeTab === "cancel"
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {selectedUnit.status === FLAT_STATUS.REGISTERED && (
                    <div className="py-3">
                       <p className="text-sm text-gray-700">This unit is registered.</p>
                    </div>
                  )}
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === "book" && selectedUnit.status === FLAT_STATUS.VACANT && (
                <form onSubmit={(e) => { e.preventDefault(); handleBookUnit(); }} className="space-y-4">
                  <FormSelect
                    label="Client"
                    value={bookingForm.clientId}
                    onChange={(e) => setBookingForm({ ...bookingForm, clientId: e.target.value })}
                    options={clients}
                    placeholder="Select a client"
                    required
                  />

                  <FormSelect
                    label="Link Enquiry (Optional)"
                    value={bookingForm.enquiryId}
                    onChange={(e) => setBookingForm({ ...bookingForm, enquiryId: e.target.value })}
                    options={enquiries}
                    placeholder="Select an enquiry"
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

                  <Button type="submit" variant="primary" className="w-full">
                    Book Unit
                  </Button>
                </form>
              )}

              {activeTab === "register" && selectedUnit.status === FLAT_STATUS.BOOKED && (
                <form onSubmit={(e) => { e.preventDefault(); handleRegisterUnit(); }} className="space-y-5">
                  {(() => {
                    const booking = getBookingForUnit(selectedUnit.propertyId)
                    const client = booking ? data.clients.find((c) => c.clientId === booking.clientId) : null
                    return (
                      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <p className="text-sm text-gray-600">Client</p>
                          <p className="text-lg font-semibold text-gray-900">{client?.label || "Unknown"}</p>
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
                      </div>
                    )
                  })()}

                  <FormInput
                    label="Registration Date"
                    type="date"
                    value={registrationForm.registrationDate}
                    onChange={(e) => setRegistrationForm({ registrationDate: e.target.value })}
                    required
                  />

                  <Button type="submit" variant="success" className="w-full">
                    Register Property
                  </Button>
                </form>
              )}

              {activeTab === "cancel" && selectedUnit.status === FLAT_STATUS.BOOKED && (
                <form onSubmit={(e) => { e.preventDefault(); handleCancelBooking(); }} className="space-y-4">
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-700">
                      This action will cancel the booking and mark the unit as vacant. This cannot be undone.
                    </p>
                  </div>

                  <FormInput
                    label="Cancellation Reason"
                    as="textarea"
                    rows={4}
                    value={cancellationForm.reason}
                    onChange={(e) => setCancellationForm({ reason: e.target.value })}
                    placeholder="Enter reason for cancellation..."
                    required
                  />

                  <Button type="submit" variant="danger" className="w-full">
                    Confirm Cancellation
                  </Button>
                </form>
              )}
            </div>
          )}
        </Drawer>

        {/* Add Booking Modal */}
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
                <FormSelect
                  label="Project"
                  required
                  value={modalSelectedProject}
                  onChange={(e) => {
                    setModalSelectedProject(e.target.value)
                    setModalSelectedWing("")
                    setSelectedFlatForBooking(null)
                  }}
                  options={modalProjects}
                  placeholder="Select Project"
                />

                {modalSelectedProject && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <FormSelect
                      label="Wing"
                      required
                      value={modalSelectedWing}
                      onChange={(e) => {
                        setModalSelectedWing(e.target.value)
                        setSelectedFlatForBooking(null)
                      }}
                      options={modalWings}
                      placeholder="Select Wing"
                    />
                    <FormSelect
                      label="Flat"
                      required
                      value={selectedFlatForBooking?.propertyId || ""}
                      onChange={(e) => {
                        const flat = data.flats.find((f) => f.propertyId === e.target.value) // Find from original data
                        setSelectedFlatForBooking(flat)
                      }}
                      options={modalFlats}
                      placeholder="Select Unit"
                    />
                  </div>
                )}
              </ModalSection>

              {/* Client Information Section */}
              <ModalSection title="Client Information" icon={User}>
                {!createNewClient ? (
                  <div className="space-y-3">
                    <FormSelect
                      label="Client"
                      required
                      value={bookingForm.clientId}
                      onChange={(e) => setBookingForm({ ...bookingForm, clientId: e.target.value })}
                      options={clients}
                      placeholder="Select Client"
                    />

                    
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Booking Amount"
                    type="number"
                    value={bookingForm.bookingAmount}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingAmount: e.target.value })}
                    placeholder="50,000"
                    required
                  />
                  <FormInput
                    label="Agreement Amount"
                    type="number"
                    value={bookingForm.agreementAmount}
                    onChange={(e) => setBookingForm({ ...bookingForm, agreementAmount: e.target.value })}
                    placeholder="50,00,000"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="Booking Date"
                    type="date"
                    value={bookingForm.bookingDate}
                    onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                  />
                  <FormInput
                    label="Cheque Number"
                    value={bookingForm.chequeNo}
                    onChange={(e) => setBookingForm({ ...bookingForm, chequeNo: e.target.value })}
                    placeholder="CH123456"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormInput
                    label="GST Percentage"
                    type="number"
                    value={bookingForm.gstPercentage}
                    onChange={(e) => setBookingForm({ ...bookingForm, gstPercentage: e.target.value })}
                    placeholder="18"
                  />
                  <FormSelect
                    label="Link Enquiry"
                    value={bookingForm.enquiryId}
                    onChange={(e) => setBookingForm({ ...bookingForm, enquiryId: e.target.value })}
                    options={enquiries}
                    placeholder="Optional"
                  />
                </div>

                {/* Summary Card */}
                <ModalSummaryCard title="Booking Summary" items={summaryItems} className="mt-6" />
              </ModalSection>
            </>
          }
          footer={
            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full">
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
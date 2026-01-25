import React, { useState, useEffect, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
    ArrowLeft, Mail, Phone, MapPin, Briefcase, Building,
    History, MessageSquare, Plus, Send, Loader2, Calendar, FileText
} from "lucide-react"

// Layout & UI Components
import { AppLayout } from "../components/layout/AppLayout"
import { Card } from "../components/ui/Card"
import { Tabs } from "../components/ui/Tabs"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
// Removed Drawer
import { Timeline } from "../components/ui/Timeline"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"
import { useToast } from "../components/ui/Toast"
import { Modal, TwoColumnModal, ModalSection } from "../components/ui/Modal" // Added TwoColumnModal, ModalSection
import { FormInput } from "../components/ui/FormInput"
import { FormSelect } from "../components/ui/FormSelect"
import { FormTextarea } from "../components/ui/FormTextarea"

// Services
import { clientService } from "../services/clientService"
import { enquiryService } from "../services/enquiryService"
import { followUpService } from "../services/followUpService"
import { projectService } from "../services/projectService"

// Constants
const FOLLOWUP_EVENT_TAGS = {
    CALL: "Client Called",
    SITE_VISIT_SCHEDULED: "Site Visit Scheduled",
    SITE_VISIT_DONE: "Site Visit Completed",
    PROPOSAL: "Proposal Sent",
    NEGOTIATION: "Negotiation in Progress",
    RESCHEDULED: "Follow-up Rescheduled",
    CLOSED: "Deal Closed",
    FIRST: "First FollowUp"
}

export default function ClientProfilePage() {
    const { clientId } = useParams()
    const navigate = useNavigate()
    const { success: showSuccess, error: showError } = useToast()

    // --- Main Page State ---
    const [client, setClient] = useState(null)
    const [enquiries, setEnquiries] = useState([])
    const [bookings, setBookings] = useState([])
    const [followUpThreads, setFollowUpThreads] = useState([])

    const [loadingClient, setLoadingClient] = useState(true)
    const [loadingTimeline, setLoadingTimeline] = useState(false)

    // --- Timeline Modal State (Replaced Drawer State) ---
    const [showTimelineModal, setShowTimelineModal] = useState(false)
    const [targetFollowUpId, setTargetFollowUpId] = useState("")
    const [submittingNode, setSubmittingNode] = useState(false)

    // Node Form State
    const [nodeForm, setNodeForm] = useState({
        body: "",
        eventTag: FOLLOWUP_EVENT_TAGS.CALL,
        followUpDateTime: ""
    })

    // --- New Enquiry Modal State ---
    const [showModal, setShowModal] = useState(false)
    const [projects, setProjects] = useState([])
    const [propertyOptions, setPropertyOptions] = useState(null)
    const [optionsLoading, setOptionsLoading] = useState(false)
    const [submittingEnquiry, setSubmittingEnquiry] = useState(false)

    // Simplified Form (No Client Data)
    const initialEnquiryForm = {
        projectId: "",
        propertyType: "",
        property: "",
        area: "",
        budget: "",
        reference: "",
        referenceName: "",
        status: "ONGOING", // Default status
        remark: ""
    }
    const [enquiryForm, setEnquiryForm] = useState(initialEnquiryForm)


    // --- 1. Fetch Client Data ---
    useEffect(() => {
        const fetchClientData = async () => {
            try {
                setLoadingClient(true)
                const clientData = await clientService.getClientById(clientId)
                setClient(clientData)

                // Fetch Enquiries
                const clientEnquiries = await enquiryService.getClientEnquiries(clientId)
                setEnquiries(clientEnquiries || [])

                // Fetch Projects List (for the modal)
                const projectsData = await projectService.getProjects()
                setProjects(projectsData || [])

            } catch (err) {
                console.error("Failed to load client profile:", err)
                showError("Failed to load client details")
            } finally {
                setLoadingClient(false)
            }
        }

        if (clientId) fetchClientData()
    }, [clientId])


    // --- 2. Fetch Timeline Data ---
    const fetchTimelineData = async () => {
        if (enquiries.length === 0) return

        try {
            setLoadingTimeline(true)
            const promises = enquiries.map(async (enq) => {
                try {
                    const data = await followUpService.getEnquiryFollowUps(enq.enquiryId)
                    if (data && data.followUpId) {
                        // Merge project name and client details from API response for the drawer/modal
                        return {
                            ...data,
                            projectName: enq.projectName,
                            // Ensure clientName/mobile are available for the header
                            clientName: data.clientName || client.clientName,
                            mobileNumber: data.mobileNumber || client.mobileNumber
                        }
                    }
                    return null
                } catch (err) {
                    return null
                }
            })

            const results = await Promise.all(promises)
            const validThreads = results.filter(item => item !== null)
            setFollowUpThreads(validThreads)

            if (validThreads.length > 0 && !targetFollowUpId) {
                setTargetFollowUpId(validThreads[0].followUpId)
            }

        } catch (err) {
            console.error("Failed to load timeline:", err)
        } finally {
            setLoadingTimeline(false)
        }
    }

    useEffect(() => {
        if (enquiries.length > 0) fetchTimelineData()
    }, [enquiries])

    // Get currently selected thread object for the UI
    const selectedFollowUp = useMemo(() => {
        return followUpThreads.find(t => t.followUpId === targetFollowUpId) || null
    }, [followUpThreads, targetFollowUpId])


    // --- 3. Property Cascading Logic ---
    const availablePropertyTypes = useMemo(() => {
        if (!propertyOptions?.propertyTypes) return []
        return propertyOptions.propertyTypes.map(pt => ({ value: pt.propertyType, label: pt.propertyType }))
    }, [propertyOptions])

    const availableProperties = useMemo(() => {
        if (!propertyOptions?.propertyTypes || !enquiryForm.propertyType) return []
        const typeObj = propertyOptions.propertyTypes.find(pt => pt.propertyType === enquiryForm.propertyType)
        return typeObj ? typeObj.properties.map(p => ({ value: p.property, label: p.property })) : []
    }, [propertyOptions, enquiryForm.propertyType])

    const availableAreas = useMemo(() => {
        if (!propertyOptions?.propertyTypes || !enquiryForm.propertyType || !enquiryForm.property) return []
        const typeObj = propertyOptions.propertyTypes.find(pt => pt.propertyType === enquiryForm.propertyType)
        const propObj = typeObj?.properties.find(p => p.property === enquiryForm.property)
        return propObj ? propObj.areas.map(a => ({ value: a.area, label: `${a.area} sq ft` })) : []
    }, [propertyOptions, enquiryForm.propertyType, enquiryForm.property])


    // --- 4. Handlers ---

    const handleOpenTimeline = () => { // Renamed from handleOpenDrawer
        fetchTimelineData()
        setShowTimelineModal(true) // Updated state variable
    }

    const handleAddNote = async () => {
        if (!targetFollowUpId) {
            showError("No active enquiry thread found.")
            return
        }
        if (!nodeForm.body) {
            showError("Please enter a note.")
            return
        }

        try {
            setSubmittingNode(true)
            await followUpService.addFollowUpNode(targetFollowUpId, {
                body: nodeForm.body,
                tag: nodeForm.eventTag,
                followUpNextDate: nodeForm.followUpDateTime || undefined
            })
            showSuccess("Note added successfully")
            await fetchTimelineData()
            setNodeForm(prev => ({ ...prev, body: "", followUpDateTime: "" }))
        } catch (err) {
            showError("Failed to add note")
        } finally {
            setSubmittingNode(false)
        }
    }

    const openNewEnquiryModal = () => {
        setEnquiryForm(initialEnquiryForm) // Reset form
        setShowModal(true)
    }

    const handleProjectChange = async (e) => {
        const newProjectId = e.target.value
        setEnquiryForm(prev => ({
            ...prev,
            projectId: newProjectId,
            propertyType: "",
            property: "",
            area: ""
        }))

        if (newProjectId) {
            try {
                setOptionsLoading(true)
                const options = await enquiryService.getPropertyOptions(newProjectId)
                setPropertyOptions(options)
            } catch (err) {
                showError("Failed to load property options")
            } finally {
                setOptionsLoading(false)
            }
        } else {
            setPropertyOptions(null)
        }
    }

    const handleAddEnquiry = async () => {
        if (!enquiryForm.projectId || !enquiryForm.budget) {
            showError("Please fill in required fields (Project, Budget)")
            return
        }

        try {
            setSubmittingEnquiry(true)

            // Construct payload strictly as requested
            // Backend seems to require client details even for existing client enquiry creation
            const payload = {
                // Enquiry details
                projectId: enquiryForm.projectId,
                propertyType: enquiryForm.propertyType,
                property: enquiryForm.property,
                area: Number(enquiryForm.area),
                budget: Number(enquiryForm.budget),
                reference: enquiryForm.reference,
                referenceName: enquiryForm.referenceName,

                // Client required details (merged from existing client state)
                clientName: client.clientName,
                mobileNumber: client.mobileNumber,
                email: client.email,
                occupation: client.occupation,
                company: client.company || "N/A", // Provide fallback if missing to satisfy "not blank"
                city: client.city,
                landlineNumber: client.landlineNumber || "N/A", // Provide fallback if missing
                address: client.address
            }

            // Updated Service Call: createClientEnquiry(clientId, data)
            await enquiryService.createClientEnquiry(clientId, payload)

            showSuccess("Enquiry created successfully")
            setShowModal(false)

            // Refresh list
            const updatedEnquiries = await enquiryService.getClientEnquiries(clientId)
            setEnquiries(updatedEnquiries || [])

        } catch (err) {
            console.error("Failed to create enquiry", err)
            showError("Failed to create enquiry")
        } finally {
            setSubmittingEnquiry(false)
        }
    }

    // --- Render Helpers ---

    // Transform nodes for Timeline Component
    const timelineEvents = useMemo(() => {
        if (!selectedFollowUp) return []

        const events = (selectedFollowUp.followUpNodes || []).map(node => {
            const dateObj = new Date(node.followUpDateTime)
            return {
                groupDate: dateObj.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
                title: node.tag || "Update",
                timestamp: dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
                description: node.body,
                agent: node.agentName || "System",
                // rawDate for sorting
                rawDate: dateObj
            }
        })
        // Sort Newest First (b - a)
        return events.sort((a, b) => b.rawDate - a.rawDate)
    }, [selectedFollowUp])

    const scrollToAddNote = () => {
        const element = document.getElementById('add-note-section');
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not Scheduled";
        // Ensure consistent date formatting across the file
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
    };


    if (loadingClient) {
        return (
            <AppLayout>
                <SkeletonLoader type="profile" count={5} />
            </AppLayout>
        )
    }

    if (!client) return null;

    const tabs = [
        {
            label: "Overview",
            content: (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-4 text-gray-800">Contact Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Mail size={18} /></div>
                                    <div><p className="text-xs text-gray-500 font-medium uppercase">Email</p><p className="text-gray-900 break-all">{client.email}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-green-50 rounded-lg text-green-600"><Phone size={18} /></div>
                                    <div><p className="text-xs text-gray-500 font-medium uppercase">Mobile</p><p className="text-gray-900">{client.mobileNumber}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-purple-50 rounded-lg text-purple-600"><MapPin size={18} /></div>
                                    <div><p className="text-xs text-gray-500 font-medium uppercase">City</p><p className="text-gray-900">{client.city}</p></div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-gray-50 rounded-lg text-gray-600"><MapPin size={18} /></div>
                                    <div><p className="text-xs text-gray-500 font-medium uppercase">Address</p><p className="text-gray-900">{client.address || "N/A"}</p></div>
                                </div>
                            </div>
                        </Card>
                    </div>


                </div>
            ),
        },
        {
            label: `Enquiries (${enquiries.length})`,
            content: (
                <Card>
                    {enquiries.length > 0 ? (
                        <Table
                            columns={[
                                { key: "projectName", label: "Project" },
                                { key: "budget", label: "Budget" },
                                {
                                    key: "status",
                                    label: "Status",
                                    render: (status) => {
                                        const statusColors = {
                                            "ONGOING": "bg-blue-100 text-blue-800",
                                            "COMPLETED": "bg-green-100 text-green-800",
                                            "CANCELLED": "bg-red-100 text-red-800",
                                            "PENDING": "bg-yellow-100 text-yellow-800",
                                            "HOT_LEAD": "bg-yellow-100 text-yellow-800",
                                            "WARM_LEAD": "bg-yellow-100 text-yellow-800",
                                            "COLD_LEAD": "bg-yellow-100 text-yellow-800",
                                        }
                                        return (
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "bg-gray-100 text-gray-800"}`}>
                                                {status}
                                            </span>
                                        )
                                    }
                                },
                            ]}
                            data={enquiries}
                        />
                    ) : (
                        <div className="text-center py-12 text-gray-500">
                            <p>No enquiries found.</p>
                            <Button onClick={openNewEnquiryModal} variant="outline" className="mt-2">Create First Enquiry</Button>
                        </div>
                    )}
                </Card>
            ),
        },
        {
            label: `Bookings (${bookings.length})`,
            content: (
                <Card>
                    <div className="text-center py-12 text-gray-500">No active bookings.</div>
                </Card>
            ),
        }
    ]

    return (
        <AppLayout>
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="p-2 hover:bg-gray-100 rounded-full" onClick={() => navigate("/clients")}>
                            <ArrowLeft size={24} className="text-gray-600" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{client.clientName}</h1>
                            <div className="flex items-center gap-3 text-gray-500 mt-1">
                                <span className="flex items-center gap-1 text-sm"><MapPin size={14} /> {client.city}</span>
                                <span className="h-1 w-1 bg-gray-300 rounded-full"></span>
                                <span className="flex items-center gap-1 text-sm"><Briefcase size={14} /> {client.occupation || "N/A"}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button onClick={handleOpenTimeline} className="flex items-center gap-2">
                            <History size={16} /> View Timeline
                        </Button>
                        <Button variant="outline" className="flex items-center gap-2" onClick={openNewEnquiryModal}>
                            <Plus size={16} /> New Enquiry
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs tabs={tabs} />

            {/* --- Add Enquiry Modal (No Client Info) --- */}
            <Modal
                isOpen={showModal}
                onClose={() => { if (!submittingEnquiry) setShowModal(false) }}
                title="Add New Enquiry"
                size="4xl"
                variant="form"
                scrollBehavior="outside"
                // Using Single Column layout for property only since client info is removed
                twoColumn={false}
                showSectionDividers={true}

                // Children acts as the content body when twoColumn is false/undefined or custom
                children={
                    <div className="space-y-8">
                        {/* Property Section */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <Building className="w-4 h-4 text-purple-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">Property Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <FormSelect
                                        label="Project"
                                        value={enquiryForm.projectId}
                                        onChange={handleProjectChange}
                                        options={projects.map((p) => ({ value: p.projectId, label: p.projectName }))}
                                        required
                                    />
                                </div>
                                <FormSelect
                                    label="Property Type"
                                    value={enquiryForm.propertyType}
                                    onChange={(e) => setEnquiryForm({ ...enquiryForm, propertyType: e.target.value, property: "", area: "" })}
                                    options={availablePropertyTypes}
                                    required
                                    disabled={!enquiryForm.projectId || optionsLoading}
                                    placeholder={optionsLoading ? "Loading..." : "Select Type"}
                                />
                                <FormSelect
                                    label="Property"
                                    value={enquiryForm.property}
                                    onChange={(e) => setEnquiryForm({ ...enquiryForm, property: e.target.value, area: "" })}
                                    options={availableProperties}
                                    placeholder="Select Property"
                                    required
                                    disabled={!enquiryForm.propertyType}
                                />
                                <FormSelect
                                    label="Area (sq ft)"
                                    value={enquiryForm.area}
                                    onChange={(e) => setEnquiryForm({ ...enquiryForm, area: e.target.value })}
                                    options={availableAreas}
                                    required
                                    disabled={!enquiryForm.property}
                                />
                            </div>
                        </div>

                        {/* Enquiry Details */}
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-4 h-4 text-amber-600" />
                                </div>
                                <h3 className="text-base font-semibold text-gray-900">Enquiry Details</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <FormInput label="Budget" value={enquiryForm.budget} onChange={(e) => setEnquiryForm({ ...enquiryForm, budget: e.target.value })} required />
                                </div>
                                <FormInput label="Reference Source" value={enquiryForm.reference} onChange={(e) => setEnquiryForm({ ...enquiryForm, reference: e.target.value })} />
                                <FormInput label="Reference Name" value={enquiryForm.referenceName} onChange={(e) => setEnquiryForm({ ...enquiryForm, referenceName: e.target.value })} />
                                <div className="col-span-2">
                                    <FormTextarea label="Remark" value={enquiryForm.remark} onChange={(e) => setEnquiryForm({ ...enquiryForm, remark: e.target.value })} rows={3} placeholder="Add any additional notes..." />
                                </div>
                            </div>
                        </div>
                    </div>
                }
                footer={
                    <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                        <button
                            onClick={() => setShowModal(false)}
                            disabled={submittingEnquiry}
                            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAddEnquiry}
                            disabled={submittingEnquiry}
                            className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            {submittingEnquiry ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Create Enquiry"}
                        </button>
                    </div>
                }
            />

            {/* --- Timeline Modal (Replaces Drawer) --- */}
            <TwoColumnModal
                isOpen={showTimelineModal}
                onClose={() => setShowTimelineModal(false)}
                title="Follow-Up Timeline"
                columnGap="lg"
                leftContent={
                    selectedFollowUp && (
                        <div className="flex flex-col h-full">

                            {/* 1. Grouping Div for Context Selector and Client Details */}
                            <div className="flex flex-col">
                                {/* Context Selector (Preserved) */}
                                {followUpThreads.length > 1 && (
                                    <div className="mb-4">
                                        <label className="text-xs text-gray-500 font-medium mb-1 block">Select Enquiry Context</label>
                                        <select
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                            value={targetFollowUpId}
                                            onChange={(e) => setTargetFollowUpId(e.target.value)}
                                        >
                                            {followUpThreads.map(t => (
                                                <option key={t.followUpId} value={t.followUpId}>
                                                    {t.projectName || `Enquiry ${t.enquiryId.substr(0, 8)}...`}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}

                                {/* Client Details Card (Top Card) */}
                                <div className="mb-1 bg-gray-50 px-3 py-2 rounded-xl border border-gray-100 flex items-center justify-between">
                                    <div>
                                        <p className="text-md font-bold text-gray-900">{selectedFollowUp.clientName}</p>

                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} className="text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">{selectedFollowUp.mobileNumber}</span>
                                    </div>
                                </div>

                            </div>

                            {/* 2. Scrollable Timeline Body */}
                            <div className="flex-1 overflow-y-auto pr-2 max-h-[calc(90vh-350px)]">
                                <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-20 py-2">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={20} className="text-purple-600" />
                                        <h3 className="font-semibold text-gray-900">Activity Timeline</h3>
                                    </div>
                                    {/* Plus Button for Mobile Scrolling */}
                                    <button
                                        onClick={scrollToAddNote}
                                        className="md:hidden flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
                                        aria-label="Add Note"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>

                                <Timeline events={timelineEvents} />
                            </div>
                        </div>
                    )
                }
                rightContent={
                    selectedFollowUp && (
                        <div className="space-y-6 px-2 overflow-y-auto max-h-[calc(90vh-200px)]">

                            <ModalSection title="Follow-Up Details" icon={Calendar} iconColor="text-indigo-600">
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm md:text-md text-gray-600 mb-1">Follow-Up Date</p>
                                        <p className="text-sm md:text-base font-semibold text-gray-900">
                                            {formatDate(selectedFollowUp.followUpNextDate)}
                                        </p>
                                    </div>
                                </div>
                            </ModalSection>

                            {/* Add Note Section with ID for scrolling */}
                            <div id="add-note-section">
                                <ModalSection title="Add New Note" icon={FileText} iconColor="text-green-600">
                                    <div className="space-y-3">
                                        <FormInput
                                            value={nodeForm.body}
                                            onChange={(e) => setNodeForm({ ...nodeForm, body: e.target.value })}
                                            placeholder="Enter your note..."
                                        />
                                        <FormSelect
                                            label="Event Tag"
                                            value={nodeForm.eventTag}
                                            onChange={(e) => setNodeForm({ ...nodeForm, eventTag: e.target.value })}
                                            options={Object.values(FOLLOWUP_EVENT_TAGS).map(tag => ({
                                                value: tag,
                                                label: tag,
                                            }))}
                                            required
                                        />
                                        <FormInput
                                            type="datetime-local"
                                            label="Next Follow Up Date (optional)"
                                            value={nodeForm.followUpDateTime}
                                            onChange={(e) => setNodeForm({ ...nodeForm, followUpDateTime: e.target.value })}
                                        />

                                        <Button onClick={handleAddNote} disabled={submittingNode} className="w-full justify-center">
                                            {submittingNode ? "Saving..." : "Add Note"}
                                        </Button>
                                    </div>
                                </ModalSection>
                            </div>
                        </div>
                    )
                }
            />
        </AppLayout>
    )
}
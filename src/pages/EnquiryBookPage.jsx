import { useState, useEffect, useMemo } from "react"
import { AppLayout } from "../components/layout/AppLayout"
import { useToast } from "../components/ui/Toast"
import { Card } from "../components/ui/Card"
import { Table } from "../components/ui/Table"
import { Button } from "../components/ui/Button"
import { Badge } from "../components/ui/Badge"
import { Modal } from "../components/ui/Modal"
import { FormInput } from "../components/ui/FormInput"
import { FormSelect } from "../components/ui/FormSelect"

import { Plus, Search, Filter, Loader2 } from "lucide-react" // Added Loader2
import { enquiryService } from "../services/enquiryService"
import { projectService } from "../services/projectService"
import { validateEmail, validatePhone } from "../utils/helpers"
import { SkeletonLoader } from "../components/ui/SkeletonLoader"

export default function EnquiryBookPage() {
    const { success, error } = useToast()
    const [enquiries, setEnquiries] = useState([])
    const [projects, setProjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [filters, setFilters] = useState({ project: "", status: "" })
    const [editingId, setEditingId] = useState(null)

    const [selectedEnquiry, setSelectedEnquiry] = useState(null)

    const [propertyOptions, setPropertyOptions] = useState(null)
    const [optionsLoading, setOptionsLoading] = useState(false)

    // --- NEW: Submitting state for loader ---
    const [submitting, setSubmitting] = useState(false)
    const [errors, setErrors] = useState({})

    const [form, setForm] = useState({
        clientName: "",
        mobileNumber: "",
        landlineNumber: "",
        email: "",
        city: "",
        address: "",
        occupation: "",
        company: "",
        projectId: "",
        propertyType: "",
        property: "",
        area: "",
        budget: "",
        reference: "",
        referenceName: "",
        remark: "",
        status: "ONGOING",
    })

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [enquiriesData, projectsData] = await Promise.all([
                    enquiryService.getAllEnquiries(),
                    projectService.getProjects(),
                ])
                setEnquiries(enquiriesData)
                setProjects(projectsData)
            } catch (err) {
                console.error("Failed to fetch data:", err)
                error(err.message || "Failed to load data")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const filteredEnquiries = useMemo(() => {
        let result = enquiries

        if (filters.project) {
            result = result.filter((e) => e.projectId === filters.project)
        }
        if (filters.status) {
            result = result.filter((e) => e.status === filters.status)
        }
        if (searchTerm) {
            result = result.filter(
                (e) =>
                    e.clientName.toLowerCase().includes(searchTerm.toLowerCase()) || e.budget.toString().includes(searchTerm),
            )
        }

        return result
    }, [enquiries, filters, searchTerm])

    const fetchPropertyOptions = async (projectId) => {
        if (!projectId) {
            setPropertyOptions(null)
            return
        }
        try {
            setOptionsLoading(true)
            const data = await enquiryService.getPropertyOptions(projectId)
            setPropertyOptions(data)
        } catch (err) {
            console.error("Failed to fetch property options", err)
            error("Failed to load property details")
        } finally {
            setOptionsLoading(false)
        }
    }

    const availablePropertyTypes = useMemo(() => {
        if (!propertyOptions?.propertyTypes) return []
        return propertyOptions.propertyTypes.map(pt => ({
            value: pt.propertyType,
            label: pt.propertyType
        }))
    }, [propertyOptions])

    const availableProperties = useMemo(() => {
        if (!propertyOptions?.propertyTypes || !form.propertyType) return []

        const selectedTypeData = propertyOptions.propertyTypes.find(
            pt => pt.propertyType === form.propertyType
        )

        if (!selectedTypeData) return []

        return selectedTypeData.properties.map(p => ({
            value: p.property,
            label: p.property || "Standard Unit"
        }))
    }, [propertyOptions, form.propertyType])

    const availableAreas = useMemo(() => {
        if (!propertyOptions?.propertyTypes || !form.propertyType || !form.property === undefined) return []

        const selectedTypeData = propertyOptions.propertyTypes.find(
            pt => pt.propertyType === form.propertyType
        )
        if (!selectedTypeData) return []

        const selectedPropertyData = selectedTypeData.properties.find(
            p => p.property === form.property
        )
        if (!selectedPropertyData) return []

        return selectedPropertyData.areas.map(a => ({
            value: a.area,
            label: `${a.area} sq ft (${a.propertiesAvailable} avail)`
        }))
    }, [propertyOptions, form.propertyType, form.property])


    const handleProjectChange = (e) => {
        const newProjectId = e.target.value
        setForm(prev => ({
            ...prev,
            projectId: newProjectId,
            propertyType: "",
            property: "",
            area: ""
        }))

        fetchPropertyOptions(newProjectId)
    }

    const handlePropertyTypeChange = (e) => {
        setForm(prev => ({
            ...prev,
            propertyType: e.target.value,
            property: "",
            area: ""
        }))
    }

    const handlePropertyChange = (e) => {
        setForm(prev => ({
            ...prev,
            property: e.target.value,
            area: ""
        }))
    }

    const handleMobileChange = (e) => {
        const value = e.target.value.replace(/\D/g, "")
        if (value.length <= 10) {
            setForm((prev) => ({ ...prev, mobileNumber: value }))
            if (value.length === 10 && errors.mobileNumber) {
                setErrors((prev) => ({ ...prev, mobileNumber: "" }))
            }
        }
    }

    const handleLandlineChange = (e) => {
        const value = e.target.value.replace(/\D/g, "")
        if (value.length <= 10) {
            setForm((prev) => ({ ...prev, landlineNumber: value }))
            if (value.length >= 3 && errors.landlineNumber) {
                setErrors((prev) => ({ ...prev, landlineNumber: "" }))
            }
        }
    }

    const handleBlur = (field) => {
        if (field === "email") {
            if (form.email && !validateEmail(form.email)) {
                setErrors((prev) => ({ ...prev, email: "Invalid email format" }))
            } else {
                setErrors((prev) => ({ ...prev, email: "" }))
            }
        }
        if (field === "mobileNumber") {
            if (form.mobileNumber && !validatePhone(form.mobileNumber)) {
                setErrors((prev) => ({ ...prev, mobileNumber: "Mobile number must be 10 digits" }))
            } else {
                setErrors((prev) => ({ ...prev, mobileNumber: "" }))
            }
        }
        if (field === "landlineNumber") {
            if (form.landlineNumber && (form.landlineNumber.length < 3 || form.landlineNumber.length > 10)) {
                setErrors((prev) => ({ ...prev, landlineNumber: "Landline must be between 3 and 10 digits" }))
            } else {
                setErrors((prev) => ({ ...prev, landlineNumber: "" }))
            }
        }
        if (field === "clientName") {
            if (!form.clientName || form.clientName.length < 3) {
                setErrors((prev) => ({ ...prev, clientName: "Client Name must be at least 3 characters" }))
            } else {
                setErrors((prev) => ({ ...prev, clientName: "" }))
            }
        }
        if (field === "address") {
            if (!form.address) {
                setErrors((prev) => ({ ...prev, address: "Address is required" }))
            } else if (form.address.length > 100) {
                setErrors((prev) => ({ ...prev, address: "Address cannot exceed 100 characters" }))
            } else {
                setErrors((prev) => ({ ...prev, address: "" }))
            }
        }
        if (field === "city") {
            if (!form.city) {
                setErrors((prev) => ({ ...prev, city: "City is required" }))
            } else if (form.city.length > 50) {
                setErrors((prev) => ({ ...prev, city: "City name too long" }))
            } else {
                setErrors((prev) => ({ ...prev, city: "" }))
            }
        }
        if (field === "occupation") {
            if (!form.occupation) {
                setErrors((prev) => ({ ...prev, occupation: "Occupation is required" }))
            } else {
                setErrors((prev) => ({ ...prev, occupation: "" }))
            }
        }
        if (field === "company") {
            if (!form.company) {
                setErrors((prev) => ({ ...prev, company: "Company is required" }))
            } else {
                setErrors((prev) => ({ ...prev, company: "" }))
            }
        }
        if (field === "budget") {
            if (form.budget && Number(form.budget) <= 0) {
                setErrors((prev) => ({ ...prev, budget: "Budget must be greater than zero" }))
            } else {
                setErrors((prev) => ({ ...prev, budget: "" }))
            }
        }
        if (field === "reference") {
            if (!form.reference) {
                setErrors((prev) => ({ ...prev, reference: "Reference is required" }))
            } else {
                setErrors((prev) => ({ ...prev, reference: "" }))
            }
        }
        if (field === "referenceName") {
            if (!form.referenceName) {
                setErrors((prev) => ({ ...prev, referenceName: "Reference Name is required" }))
            } else {
                setErrors((prev) => ({ ...prev, referenceName: "" }))
            }
        }
    }

    const handleAddEnquiry = async () => {
        // Run full validation on submit
        const newErrors = {}
        if (!form.clientName || form.clientName.length < 3) newErrors.clientName = "Client Name must be at least 3 characters"
        if (!form.email || !validateEmail(form.email)) newErrors.email = "Invalid email format"
        if (!form.mobileNumber || !validatePhone(form.mobileNumber)) newErrors.mobileNumber = "Mobile number must be 10 digits"

        // Landline optional
        if (form.landlineNumber && (form.landlineNumber.length < 3 || form.landlineNumber.length > 10)) {
            newErrors.landlineNumber = "Landline must be between 3 and 10 digits"
        }

        // City required
        if (!form.city) newErrors.city = "City is required"
        else if (form.city.length > 50) newErrors.city = "City name too long"

        // Address required
        if (!form.address) newErrors.address = "Address is required"
        else if (form.address.length > 100) newErrors.address = "Address cannot exceed 100 characters"

        // Occupation required
        if (!form.occupation) newErrors.occupation = "Occupation is required"

        // Company required
        if (!form.company) newErrors.company = "Company is required"

        if (form.budget && Number(form.budget) <= 0) newErrors.budget = "Budget must be greater than zero"

        // Reference required
        if (!form.reference) newErrors.reference = "Reference is required"

        // Reference Name required
        if (!form.referenceName) newErrors.referenceName = "Reference Name is required"

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            error("Please fix the errors in the form")
            return
        }

        if (!form.projectId || !form.propertyType || !form.area || !form.budget) {
            error("Please fill all required property fields")
            return
        }

        try {
            // --- START LOADING ---
            setSubmitting(true)

            if (editingId) {
                await enquiryService.updateEnquiry(editingId, form)
                const updated = enquiries.map((e) => (e.enquiryId === editingId ? { ...e, ...form } : e))
                setEnquiries(updated)
                success("Enquiry updated successfully")
            } else {
                const response = await enquiryService.createEnquiry(form)
                setEnquiries([...enquiries, response])
                success("Enquiry created successfully")
            }

            resetForm()
            setShowModal(false)
        } catch (err) {
            console.error("Failed to save enquiry:", err)
            error(err.message || "Failed to save enquiry")
        } finally {
            // --- STOP LOADING ---
            setSubmitting(false)
        }
    }

    const resetForm = () => {
        setForm({
            clientName: "",
            mobileNumber: "",
            landlineNumber: "",
            email: "",
            city: "",
            address: "",
            occupation: "",
            company: "",
            projectId: "",
            propertyType: "",
            property: "",
            area: "",
            budget: "",
            reference: "",
            referenceName: "",
            remark: "",
            status: "ONGOING",
        })
        setEditingId(null)
        setPropertyOptions(null)
    }

    // ... (Columns definition remains the same)
    const columns = [
        {
            key: "clientName",
            label: "Client Name",
            render: (val) => <p className="text-sm truncate">{val}</p>,
        },
        {
            key: "projectName",
            label: "Project",
            render: (val) => <p className="text-sm truncate">{val}</p>,
        },
        {
            key: "property",
            label: "Property Type",
            render: (val) => <p className="text-sm">{val}</p>,
        },
        { key: "budget", label: "Budget", render: (val) => <p className="text-sm font-medium">₹{val}</p> },
        {
            key: "status",
            label: "Status",
            render: (val) => <Badge status={val}>{val}</Badge>,
        },
    ]

    if (loading) {
        return (
            <AppLayout>
                <SkeletonLoader type={"table"} count={5} />
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <div className="space-y-4 md:space-y-6">
                {/* ... (Header and Filters remain the same) ... */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Enquiry Book</h1>
                        <p className="text-gray-600 mt-1 text-sm md:text-base">Manage all client enquiries</p>
                    </div>
                    <Button
                        onClick={() => setShowModal(true)}
                        variant="primary"
                        className="flex-shrink-0 p-2 sm:px-4 sm:py-2 rounded-full sm:rounded-xl text-sm md:text-base"
                    >
                        <Plus size={18} />
                        <span className="hidden sm:inline sm:ml-2">Add Enquiry</span>
                    </Button>
                </div>

                <div className="flex flex-row gap-2 md:gap-4">
                    <div className="flex-1 relative min-w-0">
                        <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by client or budget..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm"
                        />
                    </div>

                    <select
                        value={filters.project}
                        onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                        className="hidden sm:block px-3 md:px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm sm:flex-none"
                    >
                        <option value="">All Projects</option>
                        {projects.map((p) => (
                            <option key={p.projectId} value={p.projectId}>
                                {p.projectName}
                            </option>
                        ))}
                    </select>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="hidden sm:block px-3 md:px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm sm:flex-none"
                    >
                        <option value="">All Status</option>
                        <option value="ONGOING">Ongoing</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="BOOKED">Booked</option>
                        <option value="HOT_LEAD">Hot Lead</option>
                        <option value="WARM_LEAD">Warm Lead</option>
                        <option value="COLD_LEAD">Cold Lead</option>
                    </select>

                    <Button
                        onClick={() => setShowFilterModal(true)}
                        variant="outline"
                        className="sm:hidden p-2 rounded-xl border-gray-300"
                    >
                        <Filter size={18} className="text-gray-600" />
                    </Button>
                </div>

                <Card>
                    <div className="overflow-x-auto overflow-y-visible -mx-4 md:mx-0">
                        <div className="inline-block min-w-full px-4 md:px-0">
                            <Table
                                columns={columns}
                                data={filteredEnquiries}
                                actions={(row) => [
                                    {
                                        label: "View Details",
                                        onClick: async () => {
                                            setSelectedEnquiry(row)
                                            setForm(row)
                                            setEditingId(row.enquiryId)
                                            if (row.projectId) {
                                                await fetchPropertyOptions(row.projectId)
                                            }
                                            setShowModal(true)
                                        },
                                    },
                                ]}
                            />
                        </div>
                    </div>
                </Card>

                <Modal
                    isOpen={showModal}
                    onClose={() => {
                        if (!submitting) {
                            setShowModal(false)
                            resetForm()
                        }
                    }}
                    title={editingId ? "Edit Enquiry" : "Add New Enquiry"}
                    type={editingId ? "info" : "default"}
                    size="5xl"
                    variant="form"
                    scrollBehavior="outside"
                    twoColumn={true}
                    columnGap="lg"
                    showSectionDividers={false}
                    leftColumn={
                        <div className="space-y-6">
                            {/* ... (Client Information Section remains same) ... */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900">Client Information</h3>
                                </div>

                                <div className="space-y-4">
                                    <FormInput
                                        label="Client Name"
                                        value={form.clientName}
                                        onChange={(e) => {
                                            setForm({ ...form, clientName: e.target.value })
                                            if (errors.clientName) setErrors({ ...errors, clientName: "" })
                                        }}
                                        onBlur={() => handleBlur("clientName")}
                                        error={errors.clientName}
                                        required
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput
                                            label="Email"
                                            type="email"
                                            value={form.email}
                                            onChange={(e) => {
                                                setForm({ ...form, email: e.target.value })
                                                if (errors.email) setErrors({ ...errors, email: "" })
                                            }}
                                            onBlur={() => handleBlur("email")}
                                            error={errors.email}
                                            required
                                        />
                                        <FormInput
                                            label="Mobile"
                                            value={form.mobileNumber}
                                            onChange={handleMobileChange}
                                            onBlur={() => handleBlur("mobileNumber")}
                                            error={errors.mobileNumber}
                                            required
                                            maxLength={10}
                                        />
                                    </div>
                                    <FormInput
                                        label="Landline"
                                        value={form.landlineNumber}
                                        onChange={handleLandlineChange}
                                        onBlur={() => handleBlur("landlineNumber")}
                                        error={errors.landlineNumber}
                                        placeholder="Min 3 digits"
                                    />
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput
                                            label="City"
                                            value={form.city}
                                            onChange={(e) => {
                                                setForm({ ...form, city: e.target.value })
                                                if (errors.city) setErrors({ ...errors, city: "" })
                                            }}
                                            onBlur={() => handleBlur("city")}
                                            error={errors.city}
                                            required
                                        />
                                        <FormInput
                                            label="Address"
                                            value={form.address}
                                            onChange={(e) => {
                                                setForm({ ...form, address: e.target.value })
                                                if (errors.address) setErrors({ ...errors, address: "" })
                                            }}
                                            onBlur={() => handleBlur("address")}
                                            error={errors.address}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput
                                            label="Occupation"
                                            value={form.occupation}
                                            onChange={(e) => {
                                                setForm({ ...form, occupation: e.target.value })
                                                if (errors.occupation) setErrors({ ...errors, occupation: "" })
                                            }}
                                            onBlur={() => handleBlur("occupation")}
                                            error={errors.occupation}
                                            required
                                        />
                                        <FormInput
                                            label="Company"
                                            value={form.company}
                                            onChange={(e) => {
                                                setForm({ ...form, company: e.target.value })
                                                if (errors.company) setErrors({ ...errors, company: "" })
                                            }}
                                            onBlur={() => handleBlur("company")}
                                            error={errors.company}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>


                        </div>
                    }
                    rightColumn={
                        <div className="space-y-6">
                            {/* Property Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900">Property Details</h3>
                                </div>

                                <div className="space-y-4">
                                    <FormSelect
                                        label="Project"
                                        value={form.projectId}
                                        onChange={handleProjectChange}
                                        options={projects.map((p) => ({ value: p.projectId, label: p.projectName }))}
                                        required
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormSelect
                                            label="Property Type"
                                            value={form.propertyType}
                                            onChange={handlePropertyTypeChange}
                                            options={availablePropertyTypes}
                                            required
                                            disabled={!form.projectId || optionsLoading}
                                            placeholder={optionsLoading ? "Loading..." : "Select Type"}
                                        />

                                        <FormSelect
                                            label="Property"
                                            value={form.property}
                                            onChange={handlePropertyChange}
                                            options={availableProperties}
                                            placeholder="Select Property"
                                            required
                                            disabled={!form.propertyType}
                                        />
                                    </div>

                                    <FormSelect
                                        label="Area (sq ft)"
                                        value={form.area}
                                        onChange={(e) => setForm({ ...form, area: e.target.value })}
                                        options={availableAreas}
                                        required
                                        disabled={!form.property}
                                    />
                                </div>
                            </div>

                            {/* Enquiry Details Section */}
                            <div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                        <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-base font-semibold text-gray-900">Enquiry Details</h3>
                                </div>

                                <div className="space-y-4">
                                    <FormInput
                                        label="Budget"
                                        type="number"
                                        value={form.budget}
                                        onChange={(e) => {
                                            setForm({ ...form, budget: e.target.value })
                                            if (errors.budget) setErrors({ ...errors, budget: "" })
                                        }}
                                        onKeyDown={(e) => {
                                            // Prevent e, E, +, -
                                            if (["e", "E", "+", "-"].includes(e.key)) {
                                                e.preventDefault()
                                            }
                                        }}
                                        onBlur={() => handleBlur("budget")}
                                        error={errors.budget}
                                        required
                                        min="0"
                                    />

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormInput
                                            label="Reference"
                                            value={form.reference}
                                            onChange={(e) => {
                                                setForm({ ...form, reference: e.target.value })
                                                if (errors.reference) setErrors({ ...errors, reference: "" })
                                            }}
                                            onBlur={() => handleBlur("reference")}
                                            error={errors.reference}
                                            required
                                        />
                                        <FormInput
                                            label="Reference Name"
                                            value={form.referenceName}
                                            onChange={(e) => {
                                                setForm({ ...form, referenceName: e.target.value })
                                                if (errors.referenceName) setErrors({ ...errors, referenceName: "" })
                                            }}
                                            onBlur={() => handleBlur("referenceName")}
                                            error={errors.referenceName}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                    // --- MODIFIED FOOTER WITH LOADER ---
                    footer={
                        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    resetForm()
                                }}
                                disabled={submitting}
                                className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddEnquiry}
                                disabled={submitting}
                                className="px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        {editingId ? "Update" : "Create"} Enquiry
                                    </>
                                )}
                            </button>
                        </div>
                    }
                />

                {/* ... (Filter Modal remains the same) ... */}
                <Modal
                    isOpen={showFilterModal}
                    onClose={() => setShowFilterModal(false)}
                    title="Filter Enquiries"
                >
                    <div className="space-y-4">
                        <FormSelect
                            label="Project"
                            value={filters.project}
                            onChange={(e) => setFilters({ ...filters, project: e.target.value })}
                            options={[
                                { value: "", label: "All Projects" },
                                ...projects.map((p) => ({ value: p.projectId, label: p.projectName })),
                            ]}
                        />
                        <FormSelect
                            label="Status"
                            value={filters.status}
                            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                            options={[
                                { value: "", label: "All Status" },
                                { value: "ONGOING", label: "Ongoing" },
                                { value: "CANCELLED", label: "Cancelled" },
                                { value: "BOOKED", label: "Booked" },
                            ]}
                        />
                    </div>
                    <div className="flex flex-col-reverse sm:flex-row gap-2 justify-end pt-4">
                        <Button
                            onClick={() => {
                                setFilters({ project: "", status: "" })
                                setShowFilterModal(false)
                            }}
                            variant="secondary"
                            className="w-full sm:w-auto"
                        >
                            Clear Filters
                        </Button>
                        <Button
                            onClick={() => setShowFilterModal(false)}
                            variant="primary"
                            className="w-full sm:w-auto"
                        >
                            Apply
                        </Button>
                    </div>
                </Modal>

            </div>
        </AppLayout>
    )
}
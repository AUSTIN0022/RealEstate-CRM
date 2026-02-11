import { useState } from "react"
import { Card } from "../../../components/ui/Card"
import { Button } from "../../../components/ui/Button"
import { FormInput } from "../../../components/ui/FormInput"
import { useToast } from "../../../components/ui/Toast"
import { Edit, Building2, Home, Users, XCircle, Calendar, TrendingUp, CheckCircle } from "lucide-react"
import { formatDate } from "../../../utils/helpers"
import { projectService } from "../../../services/projectService"
import { useAuth } from "../../../contexts/AuthContext"

export default function OverviewTab({ project, projectId, onUpdate }) {
    const { user } = useAuth()
    const { success, error: toastError } = useToast()
    const [isEditingBasic, setIsEditingBasic] = useState(false)

    const [basicForm, setBasicForm] = useState({
        projectName: project.projectName,
        projectAddress: project.projectAddress,
        startDate: project.startDate?.split("T")[0],
        completionDate: project.completionDate?.split("T")[0],
        mahareraNo: project.mahareraNo,
        progress: project.progress,
    })

    const handleUpdateBasicInfo = async () => {
        const idToUse = projectId || project.id || project._id
        try {
            await projectService.updateProject(idToUse, basicForm)
            success("Project info updated")
            setIsEditingBasic(false)
            if (onUpdate) onUpdate()
        } catch (err) {
            toastError("Update failed")
        }
    }

    // Calculate statistics
    const stats = [
        {
            label: "Total Properties",
            value: project.totalProperties || 0,
            icon: Home,
            color: "bg-blue-500",
            bgLight: "bg-blue-50",
            textColor: "text-blue-600",
        },
        {
            label: "Properties Booked",
            value: project.propertiesBooked || 0,
            icon: CheckCircle,
            color: "bg-green-500",
            bgLight: "bg-green-50",
            textColor: "text-green-600",
        },
        {
            label: "Available Properties",
            value: project.propertiesAvailable || 0,
            icon: Building2,
            color: "bg-purple-500",
            bgLight: "bg-purple-50",
            textColor: "text-purple-600",
        },
        {
            label: "Total Enquiries",
            value: project.totalEnquiries || 0,
            icon: Users,
            color: "bg-orange-500",
            bgLight: "bg-orange-50",
            textColor: "text-orange-600",
        },
    ]

    // Calculate booking rate
    const bookingRate = project.totalProperties > 0
        ? Math.round((project.propertiesBooked / project.totalProperties) * 100)
        : 0

    // Calculate enquiry conversion
    const activeEnquiries = (project.totalEnquiries || 0) - (project.cancelledEnquiries || 0)
    const conversionRate = activeEnquiries > 0
        ? Math.round((project.propertiesBooked / activeEnquiries) * 100)
        : 0

    // Get status badge color
    const getStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'UPCOMING':
                return 'bg-blue-100 text-blue-800'
            case 'ONGOING':
                return 'bg-yellow-100 text-yellow-800'
            case 'COMPLETED':
                return 'bg-green-100 text-green-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    return (
        <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => (
                    <Card key={index} className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                            <div className={`${stat.bgLight} p-3 rounded-xl`}>
                                <stat.icon className={`${stat.textColor} w-6 h-6`} />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Progress & Performance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Project Progress */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-indigo-50 p-2 rounded-lg">
                            <TrendingUp className="text-indigo-600 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Project Progress</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900">{project.progress}%</span>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {project.status || 'N/A'}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${project.progress}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Overall project completion status
                        </p>
                    </div>
                </Card>

                {/* Booking Rate */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-green-50 p-2 rounded-lg">
                            <CheckCircle className="text-green-600 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Booking Rate</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900">{bookingRate}%</span>
                            <span className="text-sm text-gray-500">
                                {project.propertiesBooked}/{project.totalProperties}
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-green-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${bookingRate}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Properties sold vs total inventory
                        </p>
                    </div>
                </Card>

                {/* Enquiry Performance */}
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-orange-50 p-2 rounded-lg">
                            <Users className="text-orange-600 w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">Conversion Rate</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-2xl font-bold text-gray-900">{conversionRate}%</span>
                            <span className="text-sm text-gray-500">
                                {activeEnquiries} active
                            </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className="bg-orange-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min(conversionRate, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                            Bookings from active enquiries
                        </p>
                    </div>
                </Card>
            </div>

            {/* Enquiry Breakdown */}
            {project.totalEnquiries > 0 && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Enquiry Summary</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                            <Users className="text-blue-600 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-600">Total Enquiries</p>
                                <p className="text-2xl font-bold text-gray-900">{project.totalEnquiries}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                            <CheckCircle className="text-green-600 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-600">Active Enquiries</p>
                                <p className="text-2xl font-bold text-gray-900">{activeEnquiries}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-red-50 rounded-lg">
                            <XCircle className="text-red-600 w-8 h-8" />
                            <div>
                                <p className="text-sm text-gray-600">Cancelled</p>
                                <p className="text-2xl font-bold text-gray-900">{project.cancelledEnquiries || 0}</p>
                            </div>
                        </div>
                    </div>
                </Card>
            )}

            {/* Wings Overview */}
            {project.wings && project.wings.length > 0 && (
                <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Wings Overview</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.wings.map((wing) => {
                            const wingVacant = wing.floors?.reduce((total, floor) => {
                                return total + (floor.flats?.filter(f => f.status === 'Vacant').length || 0)
                            }, 0) || 0

                            const wingBooked = wing.floors?.reduce((total, floor) => {
                                return total + (floor.flats?.filter(f => f.status === 'Booked').length || 0)
                            }, 0) || 0

                            const wingTotal = wing.noOfProperties || 0
                            const wingOccupancy = wingTotal > 0 ? Math.round((wingBooked / wingTotal) * 100) : 0

                            return (
                                <div key={wing.wingId} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="font-semibold text-gray-900">{wing.wingName}</h4>
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">{wing.noOfFloors} Floors</span>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Total Units:</span>
                                            <span className="font-medium">{wingTotal}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Booked:</span>
                                            <span className="font-medium text-green-600">{wingBooked}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Available:</span>
                                            <span className="font-medium text-blue-600">{wingVacant}</span>
                                        </div>
                                        <div className="mt-3">
                                            <div className="flex justify-between text-xs text-gray-600 mb-1">
                                                <span>Occupancy</span>
                                                <span>{wingOccupancy}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                                                    style={{ width: `${wingOccupancy}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Card>
            )}

            {/* Basic Details */}
            <Card>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">Basic Details</h3>
                    {user?.role === "ADMIN" && (
                        !isEditingBasic ? (
                            <Button variant="outline" size="sm" onClick={() => setIsEditingBasic(true)}>
                                <Edit size={16} className="mr-2" /> Edit
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => setIsEditingBasic(false)}>
                                    Cancel
                                </Button>
                                <Button variant="primary" size="sm" onClick={handleUpdateBasicInfo}>
                                    Save
                                </Button>
                            </div>
                        )
                    )}
                </div>

                {isEditingBasic ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Project Name</label>
                            <FormInput
                                value={basicForm.projectName}
                                onChange={(e) =>
                                    setBasicForm({ ...basicForm, projectName: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Address</label>
                            <FormInput
                                value={basicForm.projectAddress}
                                onChange={(e) =>
                                    setBasicForm({ ...basicForm, projectAddress: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Start Date</label>
                            <FormInput
                                type="date"
                                value={basicForm.startDate}
                                onChange={(e) => setBasicForm({ ...basicForm, startDate: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Completion Date</label>
                            <FormInput
                                type="date"
                                value={basicForm.completionDate}
                                onChange={(e) =>
                                    setBasicForm({ ...basicForm, completionDate: e.target.value })
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">MahaRERA No</label>
                            <FormInput
                                value={basicForm.mahareraNo}
                                onChange={(e) => setBasicForm({ ...basicForm, mahareraNo: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Progress (%)</label>
                            <FormInput
                                type="number"
                                value={basicForm.progress}
                                onChange={(e) => setBasicForm({ ...basicForm, progress: e.target.value })}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="bg-gray-100 p-2 rounded-lg mt-1">
                                <Building2 className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">MahaRERA</p>
                                <p className="font-medium mt-1">{project.mahareraNo || "N/A"}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-gray-100 p-2 rounded-lg mt-1">
                                <Calendar className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Start Date</p>
                                <p className="font-medium mt-1">{formatDate(project.startDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-gray-100 p-2 rounded-lg mt-1">
                                <Calendar className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Completion</p>
                                <p className="font-medium mt-1">{formatDate(project.completionDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="bg-gray-100 p-2 rounded-lg mt-1">
                                <TrendingUp className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Status</p>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mt-1 ${getStatusColor(project.status)}`}>
                                    {project.status || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </Card>
        </div>
    )
}
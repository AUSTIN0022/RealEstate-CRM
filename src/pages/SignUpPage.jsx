"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { authService } from "../services/authService"

// Define initial empty structure to replace seedData
const INITIAL_DATA_STRUCTURE = {
    organization: {},
    users: [],
    projects: [],
    clients: [],
    wings: [],
    floors: [],
    flats: [],
    enquiries: [],
    bookings: [],
    followUps: [],
    followUpNodes: [],
    disbursements: [],
    clientDisbursements: [],
    bankDetails: [],
    documents: [],
    notifications: [],
    activityLog: [],
}

export default function SignUpPage() {
    const [formData, setFormData] = useState({
        orgName: "",
        orgEmail: "",
        username: "",
        password: "",
        email: "",
        fullName: "",
        mobileNo: "",
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        // Basic validation
        for (const key in formData) {
            if (!formData[key]) {
                setError("Please fill in all fields")
                return
            }
        }

        setLoading(true)
        try {
            console.log("[v0] Attempting registration with:", formData)
            const response = await authService.registerOrganization(formData)

            // Update initial structure with response and save to localStorage
            // Response format: { orgId, orgName, email }
            if (response && response.orgId) {
                const updatedData = { ...INITIAL_DATA_STRUCTURE }
                updatedData.organization = {
                    ...updatedData.organization,
                    orgId: response.orgId,
                    orgName: response.orgName,
                    orgEmail: response.email, // Mapping email from response to orgEmail
                }

                // Also update the initial user if needed, or just the organization part as requested.
                // The user request specifically showed updating organization data.

                localStorage.setItem("propease_data", JSON.stringify(updatedData))
                console.log("Saved registration data to localStorage")
            }

            // Redirect to login with a success indicator state if needed, or just let them login
            navigate("/login", { state: { message: "Registration successful! Please login." } })
        } catch (err) {
            console.error("[v0] Registration error:", err)
            setError(err.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ animationDuration: "4s" }}
                ></div>
                <div
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"
                    style={{ animationDuration: "6s", animationDelay: "1s" }}
                ></div>
                <div
                    className="absolute top-1/2 right-1/3 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"
                    style={{ animationDuration: "5s", animationDelay: "2s" }}
                ></div>
            </div>

            <div className="w-full max-w-2xl relative z-10">
                {/* Glass morphism card */}
                <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20">
                    {/* Logo and Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                            Create an Account
                        </h1>
                        <p className="text-gray-500 text-sm">Register your organization to get started</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Organization Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Name</label>
                                <input
                                    type="text"
                                    name="orgName"
                                    value={formData.orgName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-white"
                                    placeholder="YSM info solution"
                                />
                            </div>

                            {/* Organization Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Organization Email</label>
                                <input
                                    type="email"
                                    name="orgEmail"
                                    value={formData.orgEmail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-white"
                                    placeholder="ysmin@gmail.com"
                                />
                            </div>

                            {/* Full Name */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-white"
                                    placeholder="kadam smita"
                                />
                            </div>

                            {/* Mobile Number */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number</label>
                                <input
                                    type="text"
                                    name="mobileNo"
                                    value={formData.mobileNo}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-white"
                                    placeholder="7854218956"
                                />
                            </div>

                            {/* Personal Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Personal Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-white"
                                    placeholder="smi123@gmail.com"
                                />
                            </div>

                            {/* Username */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-white"
                                    placeholder="smi123"
                                />
                            </div>
                        </div>

                        {/* Password - Full Width */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-white"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                            />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3">
                                <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-sm text-red-700 font-medium">{error}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-indigo-400 disabled:to-purple-400 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Registering...
                                </span>
                            ) : (
                                "Create Account"
                            )}
                        </button>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-500">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                                >
                                    Login
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                {/* Footer Text */}
                <p className="text-center text-sm text-white/60 mt-6">© 2025 PropEase. Real Estate Management System</p>
            </div>
        </div>
    )
}

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {
    Menu,
    X,
    LayoutDashboard,
    Building2,
    Plus,
    BookOpen,
    Phone,
    Users,
    User,
    Bell,
    LogOut,
    Search,
    ChevronDown,
} from "lucide-react"
import { ROLES } from "../../utils/constants"

export const AppLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [userMenuOpen, setUserMenuOpen] = useState(false)
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false)
        }
    }, [location.pathname])

    const isAdmin = user?.role === ROLES.ADMIN

    const menuItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
        { icon: Building2, label: "Projects", path: "/projects" },
        ...(isAdmin ? [{ icon: Plus, label: "Project Registration", path: "/registration" }] : []),
        { icon: BookOpen, label: "Enquiry Book", path: "/enquiry-book" },
        { icon: Phone, label: "Follow-Up", path: "/follow-up" },
        { icon: Users, label: "Clients", path: "/clients" },
        // { icon: Home, label: "Bookings", path: "/bookings" },
        // { icon: DollarSign, label: "Payments", path: "/payments" },
        // { icon: Bell, label: "Notifications", path: "/notifications" },
        ...(isAdmin ? [{ icon: User, label: "Users", path: "/users" }] : []),
        // ...(isAdmin ? [{ icon: Settings, label: "Settings", path: "/settings" }] : []),
    ]

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    const handleNavigation = (path) => {
        navigate(path)
        if (window.innerWidth < 768) {
            setSidebarOpen(false)
        }
    }

    return (
        <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
            {/* Sidebar - Hidden on mobile by default */}
            <div
                className={`fixed md:relative z-40 top-0 left-0 h-screen md:h-auto
          ${sidebarOpen ? "w-64" : "w-0 md:w-20"}
          bg-white border-r border-gray-200 transition-all duration-300 flex flex-col overflow-hidden md:overflow-visible`}
            >
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                    {(sidebarOpen || window.innerWidth >= 768) && (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold">P</span>
                            </div>
                            {sidebarOpen && <span className="font-bold text-gray-900 whitespace-nowrap">PropEase</span>}
                        </div>
                    )}
                    <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded md:hidden">
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-1 hover:bg-gray-100 rounded hidden md:block"
                    >
                        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                {/* Menu Items - Added overflow scroll on mobile */}
                <nav className="flex-1 overflow-y-auto p-2 md:p-4 space-y-1 md:space-y-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon
                        const isActive = location.pathname === item.path
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                className={`w-full flex items-center gap-3 px-3 md:px-4 py-2 rounded-xl transition text-sm md:text-base ${isActive ? "bg-indigo-100 text-indigo-600" : "text-gray-700 hover:bg-gray-100"
                                    }`}
                                title={!sidebarOpen ? item.label : ""}
                            >
                                <Icon size={20} className="flex-shrink-0" />
                                {sidebarOpen && <span className="font-medium truncate">{item.label}</span>}
                            </button>
                        )
                    })}
                </nav>

                {/* User Profile */}
                <div className="p-2 md:p-4 border-t border-gray-200 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 md:px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition text-sm md:text-base"
                        title={!sidebarOpen ? "Logout" : ""}
                    >
                        <LogOut size={20} className="flex-shrink-0" />
                        {sidebarOpen && <span className="font-medium truncate">Logout</span>}
                    </button>
                </div>
            </div>

            {sidebarOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden w-full">
                {/* Navbar - Made responsive with hamburger on mobile */}
                <nav className="bg-white border-b border-gray-200 px-3 md:px-6 py-3 md:py-4 flex items-center justify-between flex-wrap md:flex-nowrap gap-2 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-4 flex-1">
                        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded md:hidden">
                            <Menu size={20} className="text-gray-600" />
                        </button>
                        <h1 className="text-lg md:text-xl font-semibold text-gray-900 truncate">PropEase CRM</h1>
                    </div>

                    <div className="flex items-center gap-2 md:gap-4">
                        {/* Search - Hidden on mobile, shown on md and up */}
                        {/* <div className="relative hidden md:block">
                            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none text-sm"
                            />
                        </div> */}

                        {/* Notifications */}
                        {/* <button className="relative p-2 hover:bg-gray-100 rounded-lg flex-shrink-0">
                            <Bell size={20} className="text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button> */}

                        {/* User Menu */}
                        <div className="relative">
                            <button
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center gap-1 md:gap-2 p-1 md:p-2 hover:bg-gray-100 rounded-xl flex-shrink-0"
                            >
                                <div className="w-7 md:w-8 h-7 md:h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                </div>
                                <ChevronDown size={16} className="text-gray-600 hidden md:block" />
                            </button>

                            {userMenuOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
                                    <div className="px-4 py-3 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-600">Role:</span>
                                            <span
                                                className={`text-xs font-semibold px-2 py-1 rounded-full ${isAdmin ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {user?.role}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>

                {/* Page Content - Made padding responsive */}
                <main className="flex-1 overflow-y-auto p-3 md:p-6">{children}</main>
            </div>
        </div>
    )
}

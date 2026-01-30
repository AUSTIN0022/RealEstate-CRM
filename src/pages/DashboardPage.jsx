import { useEffect, useMemo, useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { AppLayout } from "../components/layout/AppLayout"
import { Table } from "../components/ui/Table"
import { dashboardService } from "../services/dashboardService"
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { Users, Home, DollarSign, Building2, TrendingUp, Activity, Clock } from "lucide-react"

export default function DashboardPage() {
    const { user } = useAuth()
    const [dashboardData, setDashboardData] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const data = await dashboardService.getDashboard()
                setDashboardData(data)
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchDashboard()
    }, [])

    // Calculate statistics from dashboardData
    const stats = useMemo(() => {
        if (!dashboardData) return {
            totalProjects: 0,
            totalEnquiries: 0,
            totalBookings: 0,
            pendingPayments: 0
        }

        return {
            totalProjects: dashboardData.totalProjects || 0,
            totalEnquiries: dashboardData.totalEnquiries || 0,
            totalBookings: dashboardData.propertiesBooked || 0, // Mapping propertiesBooked to totalBookings
            pendingPayments: 0, // Not provided in API
        }
    }, [dashboardData])

    // Chart data - Unit status by project
    const unitStatusData = useMemo(() => {
        if (!dashboardData?.projects) return []

        return dashboardData.projects.map((project) => ({
            name: project.name,
            vacant: project.propertiesAvailable || 0,
            booked: project.propertiesBooked || 0,
            registered: 0, // Not provided in API
        }))
    }, [dashboardData])

    // Chart data - Monthly enquiries (Mock/Random as original)
    const monthlyEnquiriesData = useMemo(() => {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        return months.map((month) => ({
            month,
            enquiries: Math.floor(Math.random() * 20) + 5,
        }))
    }, [])

    // Recent activity (Empty as not in API)
    const recentActivity = useMemo(() => {
        return []
    }, [])

    const activityColumns = [
        { key: "timestamp", label: "Time", render: (val) => new Date(val).toLocaleTimeString() },
        { key: "user", label: "User" },
        { key: "action", label: "Action" },
        { key: "entity", label: "Entity" },
        { key: "details", label: "Details" },
    ]

    if (loading) {
        return (
            <AppLayout>
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </AppLayout>
        )
    }

    return (
        <AppLayout>
            <style>
                {`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=DM+Sans:wght@400;500;700&display=swap');
          
          .dashboard-container {
            font-family: 'DM Sans', -apple-system, sans-serif;
          }
          
          .dashboard-title {
            font-family: 'Sora', sans-serif;
            background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.02em;
          }
          
          .stat-card-enhanced {
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid #e2e8f0;
          }
          
          .stat-card-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--accent-color), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .stat-card-enhanced:hover::before {
            opacity: 1;
          }
          
          .stat-card-enhanced:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
            border-color: #cbd5e1;
          }
          
          .stat-icon-wrapper {
            position: relative;
            display: inline-flex;
            padding: 0.75rem;
            border-radius: 12px;
            transition: all 0.3s ease;
          }
          
          .stat-card-enhanced:hover .stat-icon-wrapper {
            transform: scale(1.1) rotate(-5deg);
          }
          
          .chart-card {
            background: white;
            border-radius: 16px;
            border: 1px solid #e2e8f0;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          
          .chart-card::after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, transparent 70%);
            pointer-events: none;
          }
          
          .chart-card:hover {
            box-shadow: 0 8px 24px -8px rgba(0, 0, 0, 0.08);
            border-color: #cbd5e1;
          }
          
          .activity-card {
            background: linear-gradient(to bottom, #ffffff 0%, #f8fafc 100%);
            border-radius: 16px;
            border: 1px solid #e2e8f0;
          }
          
          .section-header {
            font-family: 'Sora', sans-serif;
            font-weight: 600;
            color: #1e293b;
            letter-spacing: -0.01em;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }
          
          .section-header::before {
            content: '';
            width: 4px;
            height: 20px;
            background: linear-gradient(to bottom, #6366f1, #8b5cf6);
            border-radius: 2px;
          }
          
          .stat-value {
            font-family: 'Sora', sans-serif;
            font-weight: 700;
            letter-spacing: -0.03em;
          }
          
          .trend-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.5rem;
            border-radius: 6px;
            font-size: 0.75rem;
            font-weight: 600;
            transition: all 0.2s ease;
          }
          
          .trend-up {
            background: #dcfce7;
            color: #166534;
          }
          
          .trend-down {
            background: #fee2e2;
            color: #991b1b;
          }
          
          .recharts-wrapper {
            animation: fadeInUp 0.6s ease-out;
          }
          
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .stat-card-1 { --accent-color: #6366f1; }
          .stat-card-2 { --accent-color: #8b5cf6; }
          .stat-card-3 { --accent-color: #ec4899; }
          .stat-card-4 { --accent-color: #f59e0b; }
          
          .activity-row {
            transition: all 0.2s ease;
          }
          
          .activity-row:hover {
            background: #f8fafc;
            transform: translateX(4px);
          }
          
          .empty-state {
            text-align: center;
            padding: 3rem 1rem;
            color: #94a3b8;
          }
          
          .empty-state-icon {
            width: 48px;
            height: 48px;
            margin: 0 auto 1rem;
            opacity: 0.3;
          }
        `}
            </style>

            <div className="dashboard-container space-y-6 md:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="dashboard-title text-2xl md:text-3xl font-bold mb-2">
                            Dashboard Overview
                        </h1>
                        <p className="text-slate-600 text-sm md:text-base flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Welcome back! Here's your real estate overview.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Activity className="w-4 h-4" />
                        <span>Last updated: {new Date().toLocaleTimeString()}</span>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
                    {/* Total Projects */}
                    <div className="stat-card-enhanced stat-card-1 bg-white rounded-xl p-5 md:p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}>
                                <Building2 className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                    Total Projects
                                </div>
                                <div className="stat-value text-3xl md:text-4xl text-slate-900">
                                    {stats.totalProjects}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-500">vs last month</span>
                            <span className="trend-badge trend-up">
                                <TrendingUp className="w-3 h-3" />
                                <span>Active</span>
                            </span>
                        </div>
                    </div>

                    {/* Total Enquiries */}
                    <div className="stat-card-enhanced stat-card-2 bg-white rounded-xl p-5 md:p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)' }}>
                                <Users className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                    Total Enquiries
                                </div>
                                <div className="stat-value text-3xl md:text-4xl text-slate-900">
                                    {stats.totalEnquiries}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-500">growth rate</span>
                            <span className="trend-badge trend-up">
                                <TrendingUp className="w-3 h-3" />
                                <span>+12%</span>
                            </span>
                        </div>
                    </div>

                    {/* Total Bookings */}
                    <div className="stat-card-enhanced stat-card-3 bg-white rounded-xl p-5 md:p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)' }}>
                                <Home className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                    Total Bookings
                                </div>
                                <div className="stat-value text-3xl md:text-4xl text-slate-900">
                                    {stats.totalBookings}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-500">conversion</span>
                            <span className="trend-badge trend-up">
                                <TrendingUp className="w-3 h-3" />
                                <span>+8%</span>
                            </span>
                        </div>
                    </div>

                    {/* Pending Payments */}
                    <div className="stat-card-enhanced stat-card-4 bg-white rounded-xl p-5 md:p-6">
                        <div className="flex items-start justify-between mb-4">
                            <div className="stat-icon-wrapper" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)' }}>
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-right">
                                <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                                    Pending Payments
                                </div>
                                <div className="stat-value text-3xl md:text-4xl text-slate-900">
                                    {stats.pendingPayments}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                            <span className="text-xs text-slate-500">outstanding</span>
                            <span className="trend-badge trend-down">
                                <TrendingUp className="w-3 h-3 rotate-180" />
                                <span>-5%</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
                    {/* Unit Status Chart */}
                    <div className="chart-card p-6 md:p-7">
                        <h3 className="section-header text-lg md:text-xl mb-5">
                            Unit Status by Project
                        </h3>
                        <div className="overflow-x-auto -mx-3 md:mx-0">
                            <div className="min-h-[280px] md:min-h-[320px] px-3 md:px-0">
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={unitStatusData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="vacantGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#10b981" stopOpacity={0.7} />
                                            </linearGradient>
                                            <linearGradient id="bookedGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.7} />
                                            </linearGradient>
                                            <linearGradient id="registeredGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.9} />
                                                <stop offset="100%" stopColor="#f59e0b" stopOpacity={0.7} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'DM Sans' }}
                                            angle={-30}
                                            textAnchor="end"
                                            height={90}
                                            stroke="#cbd5e1"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'DM Sans' }}
                                            stroke="#cbd5e1"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                fontFamily: 'DM Sans'
                                            }}
                                        />
                                        <Legend
                                            wrapperStyle={{ fontFamily: 'DM Sans', fontSize: '13px' }}
                                            iconType="circle"
                                        />
                                        <Bar dataKey="vacant" fill="url(#vacantGradient)" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="booked" fill="url(#bookedGradient)" radius={[6, 6, 0, 0]} />
                                        <Bar dataKey="registered" fill="url(#registeredGradient)" radius={[6, 6, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Monthly Enquiries Chart */}
                    <div className="chart-card p-6 md:p-7">
                        <h3 className="section-header text-lg md:text-xl mb-5">
                            Monthly Enquiries
                        </h3>
                        <div className="overflow-x-auto -mx-3 md:mx-0">
                            <div className="min-h-[280px] md:min-h-[320px] px-3 md:px-0">
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={monthlyEnquiriesData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
                                        <defs>
                                            <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                                        <XAxis
                                            dataKey="month"
                                            tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'DM Sans' }}
                                            stroke="#cbd5e1"
                                        />
                                        <YAxis
                                            tick={{ fontSize: 12, fill: '#64748b', fontFamily: 'DM Sans' }}
                                            stroke="#cbd5e1"
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid #e2e8f0',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                                fontFamily: 'DM Sans'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="enquiries"
                                            stroke="#6366f1"
                                            strokeWidth={3}
                                            dot={{ fill: '#6366f1', r: 5, strokeWidth: 2, stroke: '#fff' }}
                                            activeDot={{ r: 7, strokeWidth: 2 }}
                                            fill="url(#lineGradient)"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </AppLayout>
    )
}
"use client"

import { useMemo } from "react"
import { useData } from "../contexts/DataContext"
import { useAuth } from "../contexts/AuthContext"
import { AppLayout } from "../components/layout/AppLayout"
import { StatCard } from "../components/ui/Card"
import { Card } from "../components/ui/Card"
import { Table } from "../components/ui/Table"
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
import { Users, Home, DollarSign, Building2 } from "lucide-react"
import { ROLES, FLAT_STATUS } from "../utils/constants"

export default function DashboardPage() {
  const { data } = useData()
  const { user } = useAuth()
  const isAdmin = user?.role === ROLES.ADMIN

  // Filter data based on role
  const projects = useMemo(() => {
    if (isAdmin) return data.projects.filter((p) => !p.isDeleted)
    // For agents, would filter by assigned projects
    return data.projects.filter((p) => !p.isDeleted)
  }, [data.projects, isAdmin])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalProjects = projects.length
    const totalEnquiries = data.enquiries.filter((e) => !e.isDeleted).length
    const totalBookings = data.bookings.filter((b) => !b.isDeleted).length
    const pendingPayments = data.clientDisbursements.filter((cd) => !cd.isDeleted && cd.paidAmount === "0").length

    return {
      totalProjects,
      totalEnquiries,
      totalBookings,
      pendingPayments,
    }
  }, [data, projects])

  // Chart data - Unit status by project
  const unitStatusData = useMemo(() => {
    return projects.map((project) => {
      const projectFlats = data.flats.filter((f) => f.projectId === project.projectId && !f.isDeleted)
      return {
        name: project.projectName,
        vacant: projectFlats.filter((f) => f.status === FLAT_STATUS.VACANT).length,
        booked: projectFlats.filter((f) => f.status === FLAT_STATUS.BOOKED).length,
        registered: projectFlats.filter((f) => f.status === FLAT_STATUS.REGISTERED).length,
      }
    })
  }, [data.flats, projects])

  // Chart data - Monthly enquiries
  const monthlyEnquiriesData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map((month, idx) => ({
      month,
      enquiries: Math.floor(Math.random() * 20) + 5,
    }))
  }, [])

  // Recent activity
  const recentActivity = useMemo(() => {
    return data.activityLog.slice(0, 5).map((log) => ({
      timestamp: log.timestamp,
      user: log.user,
      action: log.action,
      entity: log.entity,
      details: log.details,
    }))
  }, [data.activityLog])

  const activityColumns = [
    { key: "timestamp", label: "Time", render: (val) => new Date(val).toLocaleTimeString() },
    { key: "user", label: "User" },
    { key: "action", label: "Action" },
    { key: "entity", label: "Entity" },
    { key: "details", label: "Details" },
  ]

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's your real estate overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Building2}
            label="Total Projects"
            value={stats.totalProjects}
            trend="vs last month"
            trendUp={true}
          />
          <StatCard icon={Users} label="Total Enquiries" value={stats.totalEnquiries} trend="+12%" trendUp={true} />
          <StatCard icon={Home} label="Total Bookings" value={stats.totalBookings} trend="+8%" trendUp={true} />
          <StatCard
            icon={DollarSign}
            label="Pending Payments"
            value={stats.pendingPayments}
            trend="-5%"
            trendUp={false}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Unit Status Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Unit Status by Project</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={unitStatusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vacant" fill="#10b981" />
                <Bar dataKey="booked" fill="#3b82f6" />
                <Bar dataKey="registered" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Monthly Enquiries Chart */}
          <Card>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Enquiries</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyEnquiriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="enquiries" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <Table columns={activityColumns} data={recentActivity} />
        </Card>
      </div>
    </AppLayout>
  )
}


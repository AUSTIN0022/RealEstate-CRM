import React, { useEffect, useMemo, useState } from "react"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts"
import { enquiryService } from "../../services/enquiryService"

export default function MonthlyEnquiriesChart() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await enquiryService.getEnquiriesBasicInfo()
                // Ensure response is an array
                const enquiries = Array.isArray(response) ? response : []
                setData(enquiries)
            } catch (err) {
                console.error("Failed to fetch monthly enquiries:", err)
                setError(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    const processedData = useMemo(() => {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        // Initialize all months with 0 enquiries and correct order index
        const monthlyStats = monthNames.map((name, index) => ({
            month: name,
            enquiries: 0,
            monthIndex: index
        }))

        // Process data
        data.forEach(enquiry => {
            if (enquiry.enquiryCreatedDateTime) {
                const date = new Date(enquiry.enquiryCreatedDateTime)
                if (!isNaN(date.getTime())) {
                    const monthIndex = date.getMonth()
                    if (monthlyStats[monthIndex]) {
                        monthlyStats[monthIndex].enquiries += 1
                    }
                }
            }
        })

        // Filter out future months if needed, or keep all 12. 
        // Showing current year data primarily? The requirement didn't specify year filtering, 
        // considering the example data is "2026", assuming we aggregate all time or just show months.
        // For standard "Monthly Enquiries" usually implies "Enquiries per month" (aggregated) or "Last 12 months".
        // Given just specific fields, grouping by month (0-11) is the safest basic implementation.

        return monthlyStats
    }, [data])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[300px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (error) {
        throw error // Let ErrorBoundary handle it
    }

    return (
        <div className="chart-card p-6 md:p-7">
            <h3 className="section-header text-lg md:text-xl mb-5">
                Monthly Enquiries
            </h3>
            <div className="overflow-x-auto -mx-3 md:mx-0">
                <div className="min-h-[280px] md:min-h-[320px] px-3 md:px-0">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={processedData} margin={{ top: 10, right: 15, left: 0, bottom: 5 }}>
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
                                allowDecimals={false}
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
    )
}

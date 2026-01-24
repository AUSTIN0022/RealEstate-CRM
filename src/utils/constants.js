// import { seedData } from "../data/seedData"

export const ROLES = {
    ADMIN: "ADMIN",
    EMPLOYEE: "EMPLOYEE",
}

export const PROJECT_STATUS = {
    UPCOMING: "UPCOMING",
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
}

export const FLAT_STATUS = {
    VACANT: "VACANT",
    BOOKED: "BOOKED",
    REGISTERED: "REGISTERED",
}

export const ENQUIRY_STATUS = {
    ONGOING: "ONGOING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
    BOOKED: "BOOKED",
    HOT_LEAD: "HOT_LEAD",
    WARM_LEAD: "WARM_LEAD",
    COLD_LEAD: "COLD_LEAD",
}

export const PAYMENT_TYPE = {
    FULL_PAYMENT: "FullPayment",
    PARTIAL_PAYMENT: "PartialPayment",
}

export const DOCUMENT_TYPE = {
    FLOOR_PLAN: "FloorPlan",
    BASEMENT_PLAN: "BasementPlan",
}

export const NOTIFICATION_TYPE = {
    ENQUIRY_FOLLOWUP: "ENQUIRY_FOLLOWUP",
    PAYMENT_FOLLOWUP: "PAYMENT_FOLLOWUP",
    DEMAND_LETTER: "DEMAND_LETTER",
}

export const STATUS_COLORS = {
    VACANT: "#10b981",
    BOOKED: "#3b82f6",
    REGISTERED: "#ef4444",
    ONGOING: "#f59e0b",
    COMPLETED: "#10b981",
    CANCELLED: "#6b7280",
    UPCOMING: "#8b5cf6",
    IN_PROGRESS: "#3b82f6",
}

export const STATIC_CREDENTIALS = []

export const FOLLOWUP_EVENT_TAGS = {
    FOLLOW_UP_CREATED: "Follow-up Created",
    CLIENT_CALLED: "Client Called",
    SITE_VISIT_SCHEDULED: "Site Visit Scheduled",
    SITE_VISIT_COMPLETED: "Site Visit Completed",
    PROPOSAL_SENT: "Proposal Sent",
    NEGOTIATION_IN_PROGRESS: "Negotiation in Progress",
    DEAL_CLOSED: "Deal Closed",
    PAYMENT_RECEIVED: "Payment Received",
    FOLLOW_UP_RESCHEDULED: "Follow-up Rescheduled",
    DOCUMENT_SENT: "Document Sent",
    DOCUMENT_RECEIVED: "Document Received",
    QUERY_RESOLVED: "Query Resolved",
    WAITING_FOR_CLIENT: "Waiting for Client",
    FOLLOW_UP_COMPLETED: "Follow-up Completed",
}

export const FOLLOWUP_EVENT_TAG_COLORS = {
    "Follow-up Created": "bg-blue-100 text-blue-700",
    "Client Called": "bg-green-100 text-green-700",
    "Site Visit Scheduled": "bg-purple-100 text-purple-700",
    "Site Visit Completed": "bg-indigo-100 text-indigo-700",
    "Proposal Sent": "bg-orange-100 text-orange-700",
    "Negotiation in Progress": "bg-yellow-100 text-yellow-700",
    "Deal Closed": "bg-emerald-100 text-emerald-700",
    "Payment Received": "bg-teal-100 text-teal-700",
    "Follow-up Rescheduled": "bg-cyan-100 text-cyan-700",
    "Document Sent": "bg-pink-100 text-pink-700",
    "Document Received": "bg-rose-100 text-rose-700",
    "Query Resolved": "bg-lime-100 text-lime-700",
    "Waiting for Client": "bg-gray-100 text-gray-700",
    "Follow-up Completed": "bg-green-100 text-green-700",
}

export const FLAT_TYPES = {
    ONE_BHK: "1BHK",
    TWO_BHK: "2BHK",
    THREE_BHK: "3BHK",
    FOUR_BHK: "4BHK",
    FIVE_BHK: "5BHK",
    STUDIO: "Studio",
    PENTHOUSE: "Penthouse",
}

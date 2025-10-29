import { seedData } from "../data/seedData"

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

export const STATIC_CREDENTIALS = seedData.users.map((user) => ({
  email: user.email,
  password: user.passwordHash,
  role: user.role,
  fullName: user.fullName,
}))

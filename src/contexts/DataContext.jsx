"use client"

import React, { createContext, useState, useEffect } from "react"
import { seedData } from "../data/seedData"

export const DataContext = createContext()

export const DataProvider = ({ children }) => {
  const [data, setData] = useState(seedData)

  useEffect(() => {
    const storedData = localStorage.getItem("propease_data")
    if (storedData) {
      try {
        setData(JSON.parse(storedData))
      } catch (e) {
        console.error("Failed to parse data:", e)
        setData(seedData)
      }
    } else {
      localStorage.setItem("propease_data", JSON.stringify(seedData))
    }
  }, [])

  const updateData = (newData) => {
    setData(newData)
    localStorage.setItem("propease_data", JSON.stringify(newData))
  }

  // Project operations
  const addProject = (project) => {
    const updated = {
      ...data,
      projects: [...data.projects, project],
    }
    updateData(updated)
    return project
  }

  const updateProject = (projectId, updates) => {
    const updated = {
      ...data,
      projects: data.projects.map((p) => (p.projectId === projectId ? { ...p, ...updates } : p)),
    }
    updateData(updated)
  }

  const deleteProject = (projectId) => {
    const updated = {
      ...data,
      projects: data.projects.map((p) => (p.projectId === projectId ? { ...p, isDeleted: true } : p)),
    }
    updateData(updated)
  }

  // Client operations
  const addClient = (client) => {
    const updated = {
      ...data,
      clients: [...data.clients, client],
    }
    updateData(updated)
    return client
  }

  const updateClient = (clientId, updates) => {
    const updated = {
      ...data,
      clients: data.clients.map((c) => (c.clientId === clientId ? { ...c, ...updates } : c)),
    }
    updateData(updated)
  }

  // Enquiry operations
  const addEnquiry = (enquiry) => {
    const updated = {
      ...data,
      enquiries: [...data.enquiries, enquiry],
    }
    updateData(updated)
    return enquiry
  }

  const updateEnquiry = (enquiryId, updates) => {
    const updated = {
      ...data,
      enquiries: data.enquiries.map((e) => (e.enquiryId === enquiryId ? { ...e, ...updates } : e)),
    }
    updateData(updated)
  }

  // Booking operations
  const addBooking = (booking) => {
    const updated = {
      ...data,
      bookings: [...data.bookings, booking],
    }
    updateData(updated)
    return booking
  }

  const updateBooking = (bookingId, updates) => {
    const updated = {
      ...data,
      bookings: data.bookings.map((b) => (b.bookingId === bookingId ? { ...b, ...updates } : b)),
    }
    updateData(updated)
  }

  // Flat operations
  const updateFlat = (propertyId, updates) => {
    const updated = {
      ...data,
      flats: data.flats.map((f) => (f.propertyId === propertyId ? { ...f, ...updates } : f)),
    }
    updateData(updated)
  }

  // Wing operations
  const addWing = (wing) => {
    const updated = {
      ...data,
      wings: [...data.wings, wing],
    }
    updateData(updated)
    return wing
  }

  // Floor operations
  const addFloor = (floor) => {
    const updated = {
      ...data,
      floors: [...data.floors, floor],
    }
    updateData(updated)
    return floor
  }

  // Flat operations
  const addFlat = (flat) => {
    const updated = {
      ...data,
      flats: [...data.flats, flat],
    }
    updateData(updated)
    return flat
  }

  // Disbursement operations
  const addDisbursement = (disbursement) => {
    const updated = {
      ...data,
      disbursements: [...data.disbursements, disbursement],
    }
    updateData(updated)
    return disbursement
  }

  // Bank detail operations
  const addBankDetail = (bankDetail) => {
    const updated = {
      ...data,
      bankDetails: [...data.bankDetails, bankDetail],
    }
    updateData(updated)
    return bankDetail
  }

  // Document operations
  const addDocument = (document) => {
    const updated = {
      ...data,
      documents: [...data.documents, document],
    }
    updateData(updated)
    return document
  }

  // Notification operations
  const addNotification = (notification) => {
    const updated = {
      ...data,
      notifications: [...data.notifications, notification],
    }
    updateData(updated)
    return notification
  }

  const markNotificationRead = (notificationId) => {
    const updated = {
      ...data,
      notifications: data.notifications.map((n) => (n.notificationId === notificationId ? { ...n, isRead: true } : n)),
    }
    updateData(updated)
  }

  // Follow-up operations
  const addFollowUp = (followUp) => {
    const updated = {
      ...data,
      followUps: [...(data.followUps || []), followUp],
    }
    updateData(updated)
    return followUp
  }

  const addFollowUpNode = (node) => {
    const updated = {
      ...data,
      followUpNodes: [...(data.followUpNodes || []), node],
    }
    updateData(updated)
    return node
  }

  return (
    <DataContext.Provider
      value={{
        data,
        updateData,
        addProject: (project) => {
          const updated = { ...data, projects: [...data.projects, project] }
          updateData(updated)
          return project
        },
        updateProject: (projectId, updates) => {
          const updated = {
            ...data,
            projects: data.projects.map((p) => (p.projectId === projectId ? { ...p, ...updates } : p)),
          }
          updateData(updated)
        },
        deleteProject: (projectId) => {
          const updated = {
            ...data,
            projects: data.projects.map((p) => (p.projectId === projectId ? { ...p, isDeleted: true } : p)),
          }
          updateData(updated)
        },
        addClient: (client) => {
          const clientWithDate = {
            ...client,
            createdDate: client.createdDate || new Date().toISOString().split("T")[0],
          }
          const updated = { ...data, clients: [...data.clients, clientWithDate] }
          updateData(updated)
          return clientWithDate
        },
        updateClient: (clientId, updates) => {
          const updated = {
            ...data,
            clients: data.clients.map((c) => (c.clientId === clientId ? { ...c, ...updates } : c)),
          }
          updateData(updated)
        },
        addEnquiry: (enquiry) => {
          const updated = { ...data, enquiries: [...data.enquiries, enquiry] }
          updateData(updated)
          return enquiry
        },
        updateEnquiry: (enquiryId, updates) => {
          const updated = {
            ...data,
            enquiries: data.enquiries.map((e) => (e.enquiryId === enquiryId ? { ...e, ...updates } : e)),
          }
          updateData(updated)
        },
        addBooking: (booking) => {
          const updated = { ...data, bookings: [...data.bookings, booking] }
          updateData(updated)
          return booking
        },
        updateBooking: (bookingId, updates) => {
          const updated = {
            ...data,
            bookings: data.bookings.map((b) => (b.bookingId === bookingId ? { ...b, ...updates } : b)),
          }
          updateData(updated)
        },
        updateFlat: (propertyId, updates) => {
          const updated = {
            ...data,
            flats: data.flats.map((f) => (f.propertyId === propertyId ? { ...f, ...updates } : f)),
          }
          updateData(updated)
        },
        addWing: (wing) => {
          const updated = { ...data, wings: [...data.wings, wing] }
          updateData(updated)
          return wing
        },
        addFloor: (floor) => {
          const updated = { ...data, floors: [...data.floors, floor] }
          updateData(updated)
          return floor
        },
        addFlat: (flat) => {
          const updated = { ...data, flats: [...data.flats, flat] }
          updateData(updated)
          return flat
        },
        addDisbursement: (disbursement) => {
          const updated = { ...data, disbursements: [...data.disbursements, disbursement] }
          updateData(updated)
          return disbursement
        },
        addBankDetail: (bankDetail) => {
          const updated = { ...data, bankDetails: [...data.bankDetails, bankDetail] }
          updateData(updated)
          return bankDetail
        },
        addDocument: (document) => {
          const updated = { ...data, documents: [...data.documents, document] }
          updateData(updated)
          return document
        },
        addNotification: (notification) => {
          const updated = { ...data, notifications: [...data.notifications, notification] }
          updateData(updated)
          return notification
        },
        markNotificationRead: (notificationId) => {
          const updated = {
            ...data,
            notifications: data.notifications.map((n) =>
              n.notificationId === notificationId ? { ...n, isRead: true } : n,
            ),
          }
          updateData(updated)
        },
        addFollowUp,
        addFollowUpNode,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => {
  const context = React.useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within DataProvider")
  }
  return context
}

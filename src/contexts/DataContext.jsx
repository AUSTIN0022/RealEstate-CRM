"use client"

import React, { createContext, useState, useEffect } from "react"

export const DataContext = createContext()

const INITIAL_STATE = {
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

export const DataProvider = ({ children }) => {
    const [data, setData] = useState(INITIAL_STATE)

    useEffect(() => {
        const storedData = localStorage.getItem("propease_data")
        if (storedData) {
            try {
                setData(JSON.parse(storedData))
            } catch (e) {
                console.error("Failed to parse data:", e)
                setData(INITIAL_STATE)
            }
        } else {
            localStorage.setItem("propease_data", JSON.stringify(INITIAL_STATE))
        }
    }, [])

    const updateData = (newData) => {
        console.log("=== DataContext: Updating data ===", {
            oldEnquiries: data.enquiries?.length,
            newEnquiries: newData.enquiries?.length,
        })
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
        const clientWithDate = {
            ...client,
            createdDate: client.createdDate || new Date().toISOString().split("T")[0],
        }
        const updated = {
            ...data,
            clients: [...data.clients, clientWithDate],
        }
        updateData(updated)
        return clientWithDate
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
        console.log("=== addEnquiry called ===", enquiry)
        const newEnquiries = [...(data.enquiries || []), enquiry]
        const updated = {
            ...data,
            enquiries: newEnquiries,
        }
        console.log("=== Enquiries before update ===", data.enquiries?.length)
        console.log("=== Enquiries after update ===", newEnquiries.length)
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
        const nodeWithAgent = {
            ...node,
            agentName: node.agentName || "Unknown",
        }
        const updated = {
            ...data,
            followUpNodes: [...(data.followUpNodes || []), nodeWithAgent],
        }
        updateData(updated)
        return nodeWithAgent
    }

    const updateFollowUp = (followUpId, updates) => {
        const followUps = data.followUps || []
        const updated = {
            ...data,
            followUps: followUps.map((fu) => (fu.followUpId === followUpId ? { ...fu, ...updates } : fu)),
        }
        updateData(updated)
    }

    return (
        <DataContext.Provider
            value={{
                data,
                updateData,
                addProject,
                updateProject,
                deleteProject,
                addClient,
                updateClient,
                addEnquiry,
                updateEnquiry,
                addBooking,
                updateBooking,
                updateFlat,
                addWing,
                addFloor,
                addFlat,
                addDisbursement,
                addBankDetail,
                addDocument,
                addNotification,
                markNotificationRead,
                addFollowUp,
                addFollowUpNode,
                updateFollowUp,
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

import { apiClient } from "./apiClient"

export const clientService = {
  // Get all clients with basic info
  async getClientsBasicInfo() {
    try {
      const response = await apiClient.request("/clients/basicinfolist")
      console.log("Clients basic info fetched")
      return response
    } catch (error) {
      console.error("Failed to fetch clients basic info:", error)
      throw error
    }
  },

  // Get client by ID
  async getClientById(clientId) {
    try {
      const response = await apiClient.request(`/clients/${clientId}`)
      console.log("Client fetched:", clientId)
      return response
    } catch (error) {
      console.error("Failed to fetch client:", error)
      throw error
    }
  },

  // Get all clients (full details)
  async getAllClients() {
    try {
      const response = await apiClient.request("/clients")
      console.log("All clients fetched")
      return response
    } catch (error) {
      console.error("Failed to fetch all clients:", error)
      throw error
    }
  },

  // Create a new client
  async createClient(clientData) {
    try {
      const response = await apiClient.request("/clients", {
        method: "POST",
        body: JSON.stringify(clientData),
      })

      console.log("Client created successfully")
      return response
    } catch (error) {
      console.error("Failed to create client:", error)
      throw error
    }
  },

  // Update client details
  async updateClient(clientId, clientData) {
    try {
      const response = await apiClient.request(`/clients/${clientId}`, {
        method: "PUT",
        body: JSON.stringify(clientData),
      })

      console.log("Client updated:", clientId)
      return response
    } catch (error) {
      console.error("Failed to update client:", error)
      throw error
    }
  },

  // Delete client
  async deleteClient(clientId) {
    try {
      await apiClient.request(`/clients/${clientId}`, {
        method: "DELETE",
      })

      console.log("Client deleted:", clientId)
      return true
    } catch (error) {
      console.error("Failed to delete client:", error)
      throw error
    }
  },
}

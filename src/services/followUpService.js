import { apiClient } from "./apiClient"

export const followUpService = {
  // Get all follow-ups
  async getAllFollowUps() {
    try {
      const response = await apiClient.request("/followUps")
      console.log("All follow-ups fetched")
      return response
    } catch (error) {
      console.error("Failed to fetch follow-ups:", error)
      throw error
    }
  },

  // Get basic info of all follow-ups
  async getFollowUpsBasicInfo() {
    try {
      const response = await apiClient.request("/followUps/basicinfolist")
      console.log("Follow-ups basic info fetched")
      return response
    } catch (error) {
      console.error("Failed to fetch follow-ups basic info:", error)
      throw error
    }
  },

  // Get follow-ups for a specific project
  async getProjectFollowUps(projectId) {
    try {
      const response = await apiClient.request(`/followUps/project/${projectId}`)
      console.log("Project follow-ups fetched:", projectId)
      return response
    } catch (error) {
      console.error("Failed to fetch project follow-ups:", error)
      throw error
    }
  },

  // Get follow-ups for a specific enquiry
  async getEnquiryFollowUps(enquiryId) {
    try {
      const response = await apiClient.request(`/followUps/enquiry/${enquiryId}`)
      console.log("Enquiry follow-ups fetched:", enquiryId)
      return response
    } catch (error) {
      console.error("Failed to fetch enquiry follow-ups:", error)
      throw error
    }
  },

  // Get follow-up by ID
  async getFollowUpById(followUpId) {
    try {
      const response = await apiClient.request(`/followUps/${followUpId}`)
      console.log("Follow-up fetched:", followUpId)
      return response
    } catch (error) {
      console.error("Failed to fetch follow-up:", error)
      throw error
    }
  },

  // Get remaining follow-up tasks (today and future)
  async getFollowUpTasks(fromDate = null, toDate = null) {
    try {
      let endpoint = "/followUps/tasks"
      if (fromDate && toDate) {
        endpoint += `?fromDate=${fromDate}&toDate=${toDate}`
      }
      const response = await apiClient.request(endpoint)
      console.log("Follow-up tasks fetched")
      return response
    } catch (error) {
      console.error("Failed to fetch follow-up tasks:", error)
      throw error
    }
  },

  // Add a new node to a follow-up
  async addFollowUpNode(followUpId, nodeData) {
    try {
      const response = await apiClient.request(`/followUps/${followUpId}/node`, {
        method: "POST",
        body: JSON.stringify({
          followUpNextDate: nodeData.followUpNextDate,
          body: nodeData.body,
          tag: nodeData.tag || null,
        }),
      })

      console.log("Follow-up node added:", followUpId)
      return response
    } catch (error) {
      console.error("Failed to add follow-up node:", error)
      throw error
    }
  },

  
}

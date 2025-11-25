import { apiClient } from "./apiClient"

export const enquiryService = {
  async getAllEnquiries() {
    try {
      const response = await apiClient.request("/enquiries")
      console.log("All enquiries fetched")
      return response
    } catch (error) {
      console.error("Failed to fetch enquiries:", error)
      throw error
    }
  },

  async getEnquiriesBasicInfo() {
    try {
      const response = await apiClient.request("/enquiries/basicinfolist")
      console.log("Enquiries basic info fetched")
      return response
    } catch (error) {
      console.error("Failed to fetch enquiries basic info:", error)
      throw error
    }
  },

  async getProjectEnquiries(projectId) {
    try {
      const response = await apiClient.request(`/enquiries/project/${projectId}`)
      console.log("Project enquiries fetched:", projectId)
      return response
    } catch (error) {
      console.error("Failed to fetch project enquiries:", error)
      throw error
    }
  },

  // --- NEW METHOD ADDED HERE ---
  async getPropertyOptions(projectId) {
    try {
      const response = await apiClient.request(`/enquiries/propertyOptions/forProject/${projectId}`)
      console.log("Property options fetched for project:", projectId)
      return response
    } catch (error) {
      console.error("Failed to fetch property options:", error)
      throw error
    }
  },
  // -----------------------------

  async createEnquiry(enquiryData) {
    try {
      const response = await apiClient.request("/enquiries", {
        method: "POST",
        body: JSON.stringify(enquiryData),
      })

      console.log("Enquiry created successfully")
      return response
    } catch (error) {
      console.error("Failed to create enquiry:", error)
      throw error
    }
  },

  async updateEnquiry(enquiryId, enquiryData) {
    try {
      const response = await apiClient.request(`/enquiries/${enquiryId}`, {
        method: "PUT",
        body: JSON.stringify(enquiryData),
      })

      console.log("Enquiry updated successfully:", enquiryId)
      return response
    } catch (error) {
      console.error("Failed to update enquiry:", error)
      throw error
    }
  },

  async updateEnquiryClientInfo(enquiryId, clientInfo) {
    try {
      const response = await apiClient.request(`/enquiries/${enquiryId}/clientInfo`, {
        method: "PUT",
        body: JSON.stringify(clientInfo),
      })

      console.log("Enquiry client info updated:", enquiryId)
      return response
    } catch (error) {
      console.error("Failed to update enquiry client info:", error)
      throw error
    }
  },

  async cancelEnquiry(enquiryId, remark = "") {
    try {
      const response = await apiClient.request(`/enquiries/cancel/${enquiryId}?remark=${encodeURIComponent(remark)}`, {
        method: "DELETE",
      })

      console.log("Enquiry cancelled:", enquiryId)
      return response
    } catch (error) {
      console.error("Failed to cancel enquiry:", error)
      throw error
    }
  },
}
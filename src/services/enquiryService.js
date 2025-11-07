import { apiClient } from "./apiClient"

export const enquiryService = {
  async getAllEnquiries() {
    try {
      const response = await apiClient.request("/enquiries")
      console.log("[v0] All enquiries fetched")
      return response
    } catch (error) {
      console.error("[v0] Failed to fetch enquiries:", error)
      throw error
    }
  },

  async getEnquiriesBasicInfo() {
    try {
      const response = await apiClient.request("/enquiries/basicinfolist")
      console.log("[v0] Enquiries basic info fetched")
      return response
    } catch (error) {
      console.error("[v0] Failed to fetch enquiries basic info:", error)
      throw error
    }
  },

  async getProjectEnquiries(projectId) {
    try {
      const response = await apiClient.request(`/enquiries/project/${projectId}`)
      console.log("[v0] Project enquiries fetched:", projectId)
      return response
    } catch (error) {
      console.error("[v0] Failed to fetch project enquiries:", error)
      throw error
    }
  },

  async createEnquiry(enquiryData) {
    try {
      const response = await apiClient.request("/enquiries", {
        method: "POST",
        body: JSON.stringify(enquiryData),
      })

      console.log("[v0] Enquiry created successfully")
      return response
    } catch (error) {
      console.error("[v0] Failed to create enquiry:", error)
      throw error
    }
  },

  async updateEnquiry(enquiryId, enquiryData) {
    try {
      const response = await apiClient.request(`/enquiries/${enquiryId}`, {
        method: "PUT",
        body: JSON.stringify(enquiryData),
      })

      console.log("[v0] Enquiry updated successfully:", enquiryId)
      return response
    } catch (error) {
      console.error("[v0] Failed to update enquiry:", error)
      throw error
    }
  },

  async updateEnquiryClientInfo(enquiryId, clientInfo) {
    try {
      const response = await apiClient.request(`/enquiries/${enquiryId}/clientInfo`, {
        method: "PUT",
        body: JSON.stringify(clientInfo),
      })

      console.log("[v0] Enquiry client info updated:", enquiryId)
      return response
    } catch (error) {
      console.error("[v0] Failed to update enquiry client info:", error)
      throw error
    }
  },

  async cancelEnquiry(enquiryId, remark = "") {
    try {
      const response = await apiClient.request(`/enquiries/cancel/${enquiryId}?remark=${encodeURIComponent(remark)}`, {
        method: "DELETE",
      })

      console.log("[v0] Enquiry cancelled:", enquiryId)
      return response
    } catch (error) {
      console.error("[v0] Failed to cancel enquiry:", error)
      throw error
    }
  },
}

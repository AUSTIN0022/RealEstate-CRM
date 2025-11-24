import { apiClient } from "./apiClient"

export const projectService = {
  // --- Basic Project Operations ---

  async getProjects() {
    try {
      const response = await apiClient.request("/projects/basicinfolist")
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to fetch projects:", error)
      throw error
    }
  },

  async getProjectById(projectId) {
    try {
      const response = await apiClient.request(`/projects/${projectId}`)
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to fetch project:", error)
      throw error
    }
  },

  async createProject(projectData) {
    try {
      const formData = new FormData()

      // Basic Info
      formData.append("projectName", projectData.projectName)
      formData.append("projectAddress", projectData.projectAddress)
      formData.append("startDate", projectData.startDate)
      formData.append("completionDate", projectData.completionDate)
      formData.append("mahareraNo", projectData.mahareraNo || "")
      formData.append("status", projectData.status || "UPCOMING")
      formData.append("progress", projectData.progress || 0)
      formData.append("path", projectData.path || "/")

      // Existing formData logic for initial creation...
      // (Preserving your original logic here if needed, but typically creation is simple)

      const response = await apiClient.request("/projects", {
        method: "POST",
        body: formData,
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to create project:", error)
      throw error
    }
  },

  async updateProject(projectId, projectData) {
    try {
      // API Guide: PUT {{base_url}}/{{project_id}}
      const response = await apiClient.request(`/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData),
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to update project:", error)
      throw error
    }
  },

  async deleteProject(projectId) {
    try {
      // API Guide: DELETE {{base_url}}/{{project_id}}
      await apiClient.request(`/projects/${projectId}`, {
        method: "DELETE",
      })
      return true
    } catch (error) {
      console.error("[ProjectService] Failed to delete project:", error)
      throw error
    }
  },

  // --- Enquiries ---

  async getProjectEnquiries(projectId) {
    try {
      const response = await apiClient.request(`/enquiries/project/${projectId}`)
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to fetch enquiries:", error)
      throw error
    }
  },

  // --- Wings & Floors ---

  async createWing(projectId, wingData) {
    try {
      // API Guide: POST {{base_url}}/{{project_id}} (Wings endpoint inferred as /wings based on context)
      // Correction based on API Guide: curl ... /api/wings/5004...
      const response = await apiClient.request(`/wings/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wingData),
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to create wing:", error)
      throw error
    }
  },

  async updateWing(wingId, wingData) {
    try {
      // API Guide: PUT {{base_url}}/{{wing_id}}
      const response = await apiClient.request(`/wings/${wingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wingData),
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to update wing:", error)
      throw error
    }
  },

  // --- Bank Info ---

  async createBankInfo(projectId, bankData) {
    try {
      // API Guide: POST {{base_url}}/{{project_id}} (for bank info)
      const response = await apiClient.request(`/bankProjectInfo/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankData),
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to create bank info:", error)
      throw error
    }
  },

  async updateBankInfo(bankInfoId, bankData) {
    try {
      // API Guide: PUT {{base_url}}/{{bank_project_info_id}}
      const response = await apiClient.request(`/bankProjectInfo/${bankInfoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bankData),
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to update bank info:", error)
      throw error
    }
  },

  // --- Amenities ---

  async createAmenity(projectId, amenityData) {
    try {
      // API Guide: POST {{base_url}}/{{project_id}} (for amenities)
      const response = await apiClient.request(`/amenities/${projectId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(amenityData),
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to create amenity:", error)
      throw error
    }
  },

  async updateAmenity(amenityId, amenityData) {
    try {
      // API Guide: PUT {{base_url}}/{{amenity_id}}
      const response = await apiClient.request(`/amenities/${amenityId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(amenityData),
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to update amenity:", error)
      throw error
    }
  },

  async deleteAmenity(amenityId) {
    try {
      // API Guide: DELETE {{base_url}}/{{amenity_id}}
      await apiClient.request(`/amenities/${amenityId}`, {
        method: "DELETE",
      })
      return true
    } catch (error) {
      console.error("[ProjectService] Failed to delete amenity:", error)
      throw error
    }
  },

  // --- Disbursements ---

  async getDisbursements(projectId) {
    try {
      // API Guide: GET {{base_url}}/{{project_id}}
      const response = await apiClient.request(`/disbursements/${projectId}`)
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to fetch disbursements:", error)
      throw error
    }
  },

  async updateDisbursements(projectId, disbursementList) {
    try {
      // API Guide: PUT {{base_url}}/{{project_id}}
      const response = await apiClient.request(`/disbursements/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(disbursementList),
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to update disbursements:", error)
      throw error
    }
  },
}
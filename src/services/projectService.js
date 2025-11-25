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

      // --- 1. Basic Info ---
      formData.append("projectName", projectData.projectName)
      formData.append("projectAddress", projectData.projectAddress)
      formData.append("startDate", projectData.startDate)
      formData.append("completionDate", projectData.completionDate)
      formData.append("mahareraNo", projectData.mahareraNo || "")
      formData.append("status", projectData.status || "UPCOMING")
      formData.append("path", projectData.path || "/")
      
      // Note: curl doesn't send "progress", but your object does. 
      // Keeping it just in case, but converting to string.
      formData.append("progress", (projectData.progress || 0).toString())

      // --- 2. Wings & Floors (Nested) ---
      if (projectData.wings && projectData.wings.length > 0) {
        projectData.wings.forEach((wing, wIndex) => {
          formData.append(`wings[${wIndex}].wingName`, wing.wingName)
          formData.append(`wings[${wIndex}].noOfFloors`, wing.noOfFloors)
          formData.append(`wings[${wIndex}].noOfProperties`, wing.noOfProperties)

          if (wing.floors && wing.floors.length > 0) {
            wing.floors.forEach((floor, fIndex) => {
              formData.append(`wings[${wIndex}].floors[${fIndex}].floorNo`, floor.floorNo)
              formData.append(`wings[${wIndex}].floors[${fIndex}].floorName`, floor.floorName)
              formData.append(`wings[${wIndex}].floors[${fIndex}].propertyType`, floor.propertyType)
              formData.append(`wings[${wIndex}].floors[${fIndex}].property`, floor.property)
              formData.append(`wings[${wIndex}].floors[${fIndex}].area`, floor.area)
              formData.append(`wings[${wIndex}].floors[${fIndex}].quantity`, floor.quantity)
            })
          }
        })
      }

      // --- 3. Project Approved Banks ---
      if (projectData.projectApprovedBanksInfo && projectData.projectApprovedBanksInfo.length > 0) {
        projectData.projectApprovedBanksInfo.forEach((bank, index) => {
          formData.append(`projectApprovedBanksInfo[${index}].bankName`, bank.bankName)
          formData.append(`projectApprovedBanksInfo[${index}].branchName`, bank.branchName)
          formData.append(`projectApprovedBanksInfo[${index}].contactPerson`, bank.contactPerson)
          formData.append(`projectApprovedBanksInfo[${index}].contactNumber`, bank.contactNumber)
        })
      }

      // --- 4. Disbursement Banks ---
      if (projectData.disbursementBanksDetail && projectData.disbursementBanksDetail.length > 0) {
        projectData.disbursementBanksDetail.forEach((bank, index) => {
          formData.append(`disbursementBanksDetail[${index}].bankName`, bank.bankName)
          formData.append(`disbursementBanksDetail[${index}].branchName`, bank.branchName)
          formData.append(`disbursementBanksDetail[${index}].accountName`, bank.accountName)
          formData.append(`disbursementBanksDetail[${index}].ifsc`, bank.ifsc)
          formData.append(`disbursementBanksDetail[${index}].accountType`, bank.accountType)
          formData.append(`disbursementBanksDetail[${index}].accountNo`, bank.accountNo)
          
          // Handle File Upload for Disbursement Letter Head
          if (bank.disbursementLetterHead) {
            formData.append(`disbursementBanksDetail[${index}].disbursementLetterHead`, bank.disbursementLetterHead)
          }
        })
      }

      // --- 5. Amenities ---
      if (projectData.amenities && projectData.amenities.length > 0) {
        projectData.amenities.forEach((amenity, index) => {
          formData.append(`amenities[${index}].amenityName`, amenity.amenityName)
        })
      }

      // --- 6. Documents (Files) ---
      if (projectData.documents && projectData.documents.length > 0) {
        projectData.documents.forEach((doc, index) => {
          formData.append(`documents[${index}].documentType`, doc.documentType)
          formData.append(`documents[${index}].documentTitle`, doc.documentTitle)
          
          // The actual file object
          if (doc.document) {
            formData.append(`documents[${index}].document`, doc.document)
          }
        })
      }

      // --- 7. Disbursements ---
      if (projectData.disbursements && projectData.disbursements.length > 0) {
        projectData.disbursements.forEach((d, index) => {
          formData.append(`disbursements[${index}].disbursementTitle`, d.disbursementTitle)
          formData.append(`disbursements[${index}].description`, d.description)
          formData.append(`disbursements[${index}].percentage`, d.percentage)
        })
      }

      // --- 8. Main Letterhead File ---
      if (projectData.letterHeadFile) {
        formData.append("letterHeadFile", projectData.letterHeadFile)
      }

      const response = await apiClient.request("/projects", {
        method: "POST",
        body: formData,
        // Don't set Content-Type header here; fetch sets it automatically for FormData with the correct boundary
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
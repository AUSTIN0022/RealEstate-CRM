import { apiClient } from "./apiClient"

export const projectService = {
  async getProjects() {
    try {
      const response = await apiClient.request("/projects/basicinfolist")
      console.log("[v0] Projects fetched successfully")
      return response
    } catch (error) {
      console.error("[v0] Failed to fetch projects:", error)
      throw error
    }
  },

  async getProjectById(projectId) {
    try {
      const response = await apiClient.request(`/projects/${projectId}`)
      console.log("[v0] Project fetched:", projectId)
      return response
    } catch (error) {
      console.error("[v0] Failed to fetch project:", error)
      throw error
    }
  },

  async createProject(projectData) {
    try {
      const formData = new FormData()

      formData.append("projectName", projectData.projectName)
      formData.append("projectAddress", projectData.projectAddress)
      formData.append("startDate", projectData.startDate)
      formData.append("completionDate", projectData.completionDate)
      formData.append("mahareraNo", projectData.mahareraNo || "")
      formData.append("status", projectData.status || "UPCOMING")
      formData.append("progress", projectData.progress || 0)
      formData.append("path", projectData.path || "/")

      if (projectData.wings && Array.isArray(projectData.wings)) {
        projectData.wings.forEach((wing, wingIndex) => {
          formData.append(`wings[${wingIndex}].wingName`, wing.wingName)
          formData.append(`wings[${wingIndex}].noOfFloors`, wing.noOfFloors)
          formData.append(`wings[${wingIndex}].noOfProperties`, wing.noOfProperties)

          if (wing.floors && Array.isArray(wing.floors)) {
            wing.floors.forEach((floor, floorIndex) => {
              formData.append(`wings[${wingIndex}].floors[${floorIndex}].floorNo`, floor.floorNo)
              formData.append(`wings[${wingIndex}].floors[${floorIndex}].floorName`, floor.floorName)
              formData.append(`wings[${wingIndex}].floors[${floorIndex}].propertyType`, floor.propertyType)
              formData.append(`wings[${wingIndex}].floors[${floorIndex}].property`, floor.property)
              formData.append(`wings[${wingIndex}].floors[${floorIndex}].area`, floor.area)
              formData.append(`wings[${wingIndex}].floors[${floorIndex}].quantity`, floor.quantity)
            })
          }
        })
      }

      if (projectData.projectApprovedBanksInfo && Array.isArray(projectData.projectApprovedBanksInfo)) {
        projectData.projectApprovedBanksInfo.forEach((bank, index) => {
          formData.append(`projectApprovedBanksInfo[${index}].bankName`, bank.bankName)
          formData.append(`projectApprovedBanksInfo[${index}].branchName`, bank.branchName)
          formData.append(`projectApprovedBanksInfo[${index}].contactPerson`, bank.contactPerson)
          formData.append(`projectApprovedBanksInfo[${index}].contactNumber`, bank.contactNumber)
        })
      }

      if (projectData.disbursementBanksDetail && Array.isArray(projectData.disbursementBanksDetail)) {
        projectData.disbursementBanksDetail.forEach((bank, index) => {
          formData.append(`disbursementBanksDetail[${index}].accountName`, bank.accountName)
          formData.append(`disbursementBanksDetail[${index}].bankName`, bank.bankName)
          formData.append(`disbursementBanksDetail[${index}].branchName`, bank.branchName)
          formData.append(`disbursementBanksDetail[${index}].ifsc`, bank.ifsc)
          formData.append(`disbursementBanksDetail[${index}].accountType`, bank.accountType)
          formData.append(`disbursementBanksDetail[${index}].accountNo`, bank.accountNo)
        })
      }

      if (projectData.amenities && Array.isArray(projectData.amenities)) {
        projectData.amenities.forEach((amenity, index) => {
          formData.append(`amenities[${index}].amenityName`, amenity.amenityName || amenity)
        })
      }

      if (projectData.documents && Array.isArray(projectData.documents)) {
        projectData.documents.forEach((doc, index) => {
          formData.append(`documents[${index}].documentType`, doc.documentType)
          formData.append(`documents[${index}].documentTitle`, doc.documentTitle)
          if (doc.document) {
            formData.append(`documents[${index}].document`, doc.document)
          }
        })
      }

      if (projectData.disbursements && Array.isArray(projectData.disbursements)) {
        projectData.disbursements.forEach((disbursement, index) => {
          formData.append(`disbursements[${index}].disbursementTitle`, disbursement.disbursementTitle)
          formData.append(`disbursements[${index}].description`, disbursement.description)
          formData.append(`disbursements[${index}].percentage`, disbursement.percentage)
        })
      }

      console.log("[v0] Creating project with FormData")
      const response = await apiClient.request("/projects", {
        method: "POST",
        body: formData,
      })

      console.log("[v0] Project created successfully:", response)
      return response
    } catch (error) {
      console.error("[v0] Failed to create project:", error)
      throw error
    }
  },

  async updateProject(projectId, projectData) {
    try {
      const response = await apiClient.request(`/projects/${projectId}`, {
        method: "PUT",
        body: JSON.stringify(projectData),
      })

      console.log("[v0] Project updated successfully:", projectId)
      return response
    } catch (error) {
      console.error("[v0] Failed to update project:", error)
      throw error
    }
  },

  async deleteProject(projectId) {
    try {
      await apiClient.request(`/projects/${projectId}`, {
        method: "DELETE",
      })

      console.log("[v0] Project deleted successfully:", projectId)
      return true
    } catch (error) {
      console.error("[v0] Failed to delete project:", error)
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
}

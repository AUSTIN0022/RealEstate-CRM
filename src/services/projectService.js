import { apiClient } from "./apiClient"

export const projectService = {
  // --- Basic Project Operations ---

  async getProjects() {
    return await apiClient.request("/projects/basicinfolist")
  },

  async getProjectById(projectId) {
    return await apiClient.request(`/projects/${projectId}`)
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
      })
      return response
    } catch (error) {
      console.error("[ProjectService] Failed to create project:", error)
      throw error
    }
  },

  async updateProject(projectId, projectData) {
    return await apiClient.request(`/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(projectData),
    })
  },

  async deleteProject(projectId) {
    await apiClient.request(`/projects/${projectId}`, { method: "DELETE" })
    return true
  },

  // --- Wings ---

  async createWing(projectId, wingData) {
    return await apiClient.request(`/wings/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wingData),
    })
  },

  async updateWing(wingId, wingData) {
    return await apiClient.request(`/wings/${wingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(wingData),
    })
  },

  async deleteWing(wingId) {
    return await apiClient.request(`/wings/${wingId}`, {
      method: "DELETE",
    })
  },

  // --- Bank Info ---

  async getBanksByProject(projectId) {
    return await apiClient.request(`/bankProjectInfo/project/${projectId}`)
  },

  async createBankInfo(projectId, bankData) {
    return await apiClient.request(`/bankProjectInfo/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bankData),
    })
  },

  async updateBankInfo(bankInfoId, bankData) {
    return await apiClient.request(`/bankProjectInfo/${bankInfoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bankData),
    })
  },

  async deleteBankInfo(bankInfoId) {
    return await apiClient.request(`/bankProjectInfo/${bankInfoId}`, {
      method: "DELETE",
    })
  },

  // --- Amenities ---

  async getAmenitiesByProject(projectId) {
    return await apiClient.request(`/amenities/project/${projectId}`)
  },

  async createAmenity(projectId, amenityData) {
    return await apiClient.request(`/amenities/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(amenityData),
    })
  },

  async updateAmenity(amenityId, amenityData) {
    return await apiClient.request(`/amenities/${amenityId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(amenityData),
    })
  },

  async deleteAmenity(amenityId) {
    return await apiClient.request(`/amenities/${amenityId}`, {
      method: "DELETE",
    })
  },

  // --- Documents ---

  async getDocumentsByProject(projectId) {
    return await apiClient.request(`/documents/project/${projectId}`)
  },

  async createDocument(projectId, docData) {
    const formData = new FormData()
    formData.append("documentType", docData.documentType)
    formData.append("documentTitle", docData.documentTitle)

    if (docData.file) {
      formData.append("document", docData.file)
    }

    const token = apiClient.getAuthToken()

    // Matches your working curl: /api/documents/{projectId}
    const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/${projectId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const t = await response.text()
      throw new Error(t || "Failed to upload document")
    }
    return true
  },

  async deleteDocument(docId) {
    return await apiClient.request(`/documents/${docId}`, {
      method: "DELETE",
    })
  },

  // --- Fixed Download/Preview Method ---
  async getDocumentSignedUrl(documentUrlPath) {
    try {
      const token = apiClient.getAuthToken()
      
      // 1. Remove leading slash if present
      const cleanPath = documentUrlPath.startsWith("/") ? documentUrlPath.slice(1) : documentUrlPath
      
      // 2. Use encodeURI, NOT encodeURIComponent. 
      // This preserves the '/' structure (e.g. "Folder/File.pdf") while encoding spaces (e.g. "Rainbow%203").
      const formattedPath = encodeURI(cleanPath)

      // 3. CORRECTED ENDPOINT: /documents/download/
      // Matches your working curl: {{base_url}}/documents/download/{{path}}
      const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/download/${formattedPath}`, {
         method: "GET",
         headers: {
            Authorization: `Bearer ${token}`,
         }
      })

      if (!response.ok) {
        // Log detailed error for debugging
        const errorText = await response.text()
        console.error("API Error:", response.status, errorText)
        throw new Error(`Server responded with ${response.status}`)
      }
      
      const signedUrl = await response.text()
      return signedUrl
    } catch (error) {
      console.error("Signed URL error:", error)
      throw error
    }
  },

  // --- Enquiries & Disbursements ---

  async getProjectEnquiries(projectId) {
    return await apiClient.request(`/enquiries/project/${projectId}`)
  },

  async getDisbursements(projectId) {
    return await apiClient.request(`/disbursements/${projectId}`)
  },

  async updateDisbursements(projectId, disbursementList) {
    return await apiClient.request(`/disbursements/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(disbursementList),
    })
  },
}
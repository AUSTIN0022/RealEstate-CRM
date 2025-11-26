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

  // --- Bank Info (Updated Endpoints) ---

  async getBanksByProject(projectId) {
    // GET {{base_url}}/bankProjectInfo/project/{{project_id}}
    return await apiClient.request(`/bankProjectInfo/project/${projectId}`)
  },

  async createBankInfo(projectId, bankData) {
    // POST {{base_url}}/bankProjectInfo/{{project_id}}
    return await apiClient.request(`/bankProjectInfo/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bankData),
    })
  },

  async updateBankInfo(bankInfoId, bankData) {
    // PUT {{base_url}}/bankProjectInfo/{{bank_project_info_id}}
    return await apiClient.request(`/bankProjectInfo/${bankInfoId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bankData),
    })
  },

  async deleteBankInfo(bankInfoId) {
    // DELETE {{base_url}}/bankProjectInfo/{{bank_project_info_id}}
    return await apiClient.request(`/bankProjectInfo/${bankInfoId}`, {
      method: "DELETE",
    })
  },

  // --- Amenities (Updated Endpoints) ---

  async getAmenitiesByProject(projectId) {
    // GET {{base_url}}/amenities/project/{{project_id}}
    return await apiClient.request(`/amenities/project/${projectId}`)
  },

  async createAmenity(projectId, amenityData) {
    // POST {{base_url}}/amenities/{{project_id}}
    return await apiClient.request(`/amenities/${projectId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(amenityData),
    })
  },

  async updateAmenity(amenityId, amenityData) {
    // PUT {{base_url}}/amenities/{{amenity_id}}
    return await apiClient.request(`/amenities/${amenityId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(amenityData),
    })
  },

  async deleteAmenity(amenityId) {
    // DELETE {{base_url}}/amenities/{{amenity_id}}
    return await apiClient.request(`/amenities/${amenityId}`, {
      method: "DELETE",
    })
  },

  // --- Documents (New) ---

  async getDocumentsByProject(projectId) {
    // GET {{base_url}}/documents/project/{{project_id}}
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

  const response = await fetch(`https://realestate.ysminfosolution.com/api/documents/${projectId}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`
    },
    body: formData
  })

  if (!response.ok) {
    const t = await response.text()
    throw new Error(t || "Failed to upload document")
  }

  // Upload usually returns null/empty — return success manually
  return true
},

  async deleteDocument(docId) {
    // DELETE {{base_url}}/documents/{{doc_id}}
    return await apiClient.request(`/documents/${docId}`, {
      method: "DELETE",
    })
  },

  async downloadDocument(downloadPath) {
    // The API guide implies a full relative path or ID usage. 
    // Assuming the API returns a path like "download/uuid/project/..."
    // We need to request this with responseType blob to handle file download
    try {
        // Ensure path starts with /
        const cleanPath = downloadPath.startsWith('/') ? downloadPath : `/${downloadPath}`;
        
        // Note: You might need to adjust based on how apiClient handles blobs.
        // If apiClient parses JSON by default, you might need a raw fetch here or a flag in apiClient.
        // Assuming standard fetch for blob:
        const token = localStorage.getItem("token") // Or however you store auth
        const baseUrl = "https://realestate.ysminfosolution.com/api" // Adjust to your env config
        
        const response = await fetch(`${baseUrl}${cleanPath}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })

        if (!response.ok) throw new Error("Download failed")

        const blob = await response.blob()
        
        // Create a temporary link to trigger download
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        // Attempt to extract filename from header or path
        const fileName = cleanPath.split('/').pop() || "document"
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error("Download error:", error)
        throw error
    }
  },

  // --- Enquiries & Disbursements (Existing) ---

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
import { apiClient } from "./apiClient"

// Helper function to recursively build FormData
// FIXED: Now skips null/undefined values instead of sending them as empty strings.
// This prevents Spring Boot from crashing when it receives a String for a MultipartFile field.
const buildFormData = (formData, data, parentKey) => {
  if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
    Object.keys(data).forEach(key => {
      let keyName;
      if (parentKey) {
        if (Array.isArray(data)) {
           keyName = `${parentKey}[${key}]`;
        } else {
           keyName = `${parentKey}.${key}`;
        }
      } else {
        keyName = key;
      }
      buildFormData(formData, data[key], keyName);
    });
  } else {
    // --- FIX STARTS HERE ---
    // If data is null or undefined, DO NOT append it to FormData.
    // Spring Boot treats a missing key as null (correct), 
    // but treats an empty string "" as a String (incorrect for File fields).
    if (data === null || data === undefined) {
      return;
    }
    // --- FIX ENDS HERE ---
    
    formData.append(parentKey, data);
  }
};

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

      // 1. Prepare data 
      const payload = {
        ...projectData,
        mahareraNo: projectData.mahareraNo || "",
        status: projectData.status || "UPCOMING",
        path: projectData.path || "/",
        progress: (projectData.progress || 0).toString(),
      }

      // 2. Use the helper to automatically flatten the object into FormData
      buildFormData(formData, payload);

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

  async getDocumentSignedUrl(documentUrlPath) {
    try {
      const token = apiClient.getAuthToken()
      const cleanPath = documentUrlPath.startsWith("/") ? documentUrlPath.slice(1) : documentUrlPath
      const formattedPath = encodeURI(cleanPath)

      const response = await fetch(`${import.meta.env.VITE_API_URL}/documents/download/${formattedPath}`, {
         method: "GET",
         headers: {
            Authorization: `Bearer ${token}`,
         }
      })

      if (!response.ok) {
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
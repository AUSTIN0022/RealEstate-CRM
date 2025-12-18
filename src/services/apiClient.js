const API_BASE_URL = import.meta.env.VITE_API_URL

// Variable to hold the pending refresh promise (prevents multiple refresh calls)
let refreshPromise = null

export const apiClient = {
  getAuthToken: () => {
    const auth = localStorage.getItem("propease_auth")
    if (!auth) return null
    try {
      return JSON.parse(auth).accessToken || null
    } catch {
      return null
    }
  },

  getRefreshToken: () => {
    const auth = localStorage.getItem("propease_auth")
    if (!auth) return null
    try {
      return JSON.parse(auth).refreshToken || null
    } catch {
      return null
    }
  },

  setTokens: (accessToken, refreshToken) => {
    const existing = localStorage.getItem("propease_auth")
    const parsed = existing ? JSON.parse(existing) : {}
    parsed.accessToken = accessToken
    parsed.refreshToken = refreshToken
    localStorage.setItem("propease_auth", JSON.stringify(parsed))
  },




  

  clearTokens: () => {
    localStorage.removeItem("propease_auth")
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`

    // 1. Prepare Headers
    const headers = { ...options.headers }
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    // 2. Attach Token
    const token = this.getAuthToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    try {
      const response = await fetch(url, { ...options, headers })

      // 3. Handle 401 (Unauthorized)
      if (response.status === 401) {
        console.warn("Token expired, attempting refresh...")

        // Attempt refresh
        const refreshed = await this.refreshAccessToken()

        if (refreshed) {
          console.log("Token refreshed! Retrying original request...")
          // Retry with NEW token
          const newToken = this.getAuthToken()
          headers["Authorization"] = `Bearer ${newToken}`
          
          const retryResponse = await fetch(url, { ...options, headers })
          return this.handleResponse(retryResponse)
        } else {
          // Refresh failed - Logout user
          console.error("Refresh failed. Logging out.")
          this.clearTokens()
          window.location.href = "/login"
          throw new Error("Session expired. Please login again.")
        }
      }

      return this.handleResponse(response)
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  },

  async handleResponse(response) {
    const text = await response.text()
    let data = null

    if (text) {
      try {
        data = JSON.parse(text)
      } catch (err) {
        // Ignore JSON parse errors for non-JSON responses
      }
    }

    if (!response.ok) {
      const message = data?.message || text || `API Error: ${response.status}`
      throw new Error(message)
    }

    return data
  },

  // --- REFRESH LOGIC ---
  async refreshAccessToken() {
    // If a refresh is already in progress, return that same promise
    if (refreshPromise) {
      return refreshPromise
    }

    // Create a new refresh promise
    refreshPromise = (async () => {
      const refreshToken = this.getRefreshToken()
      if (!refreshToken) return false

      try {
        const response = await fetch(`${API_BASE_URL}/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        })

        if (response.ok) {
          const data = await response.json()
          this.setTokens(data.accessToken, data.refreshToken)
          return true
        }
        return false
      } catch (error) {
        console.error("Token refresh failed:", error)
        return false
      } finally {
        // Clear the promise so next time we can try again
        refreshPromise = null
      }
    })()

    return refreshPromise
  },
}
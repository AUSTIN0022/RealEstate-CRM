const API_BASE_URL =  import.meta.env.VITE_API_URL // "https://realestate.ysminfosolution.com/api" //

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

    // Start with user-specified headers
    const headers = { ...options.headers }

    // Only set JSON header if body is not FormData
    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json"
    }

    // Attach Bearer token
    const token = this.getAuthToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    } else {
      console.warn("[apiClient] No access token found in localStorage")
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Token expired
      if (response.status === 401) {
        console.warn("Token expired or unauthorized, attempting refresh...")
        const refreshed = await this.refreshAccessToken()
        if (refreshed) {
          headers["Authorization"] = `Bearer ${this.getAuthToken()}`
          return fetch(url, { ...options, headers }).then((res) => this.handleResponse(res))
        } else {
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
        console.warn("[apiClient] Non-JSON or empty response:", text)
      }
    }

    if (!response.ok) {
      const message = data?.message || text || `API Error: ${response.status}`
      throw new Error(message)
    }

    return data
  },

  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) return false

    try {
      const response = await fetch(`${API_BASE_URL}/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()
      if (response.ok) {
        this.setTokens(data.accessToken, data.refreshToken)
        return true
      }
      return false
    } catch (error) {
      console.error("Token refresh failed:", error)
      return false
    }
  },
}

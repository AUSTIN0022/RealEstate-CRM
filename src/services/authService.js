import { apiClient } from "./apiClient"

export const authService = {
  async login(username, password) {
    try {
      const response = await fetch("https://realestate.ysminfosolution.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Login failed")
      }

      // Store tokens
      apiClient.setTokens(data.accessToken, data.refreshToken)

      return {
        success: true,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresInSeconds: data.expiresInSeconds,
        role: data.role,
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    }
  },

  async logout() {
    apiClient.clearTokens()
    return true
  },

  isTokenValid() {
    const token = apiClient.getAuthToken()
    return !!token
  },
}

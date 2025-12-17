import React, { createContext, useState, useEffect } from "react"
import { authService } from "../services/authService"
import { apiClient } from "../services/apiClient"
import { useToast } from "../components/ui/Toast"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { error } = useToast()

  // 1. Load stored user from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("propease_auth")
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth)
        setUser(parsed)
        
        // --- ADDED: Sync apiClient immediately on load ---
        if (parsed.accessToken && parsed.refreshToken) {
           apiClient.setTokens(parsed.accessToken, parsed.refreshToken)
        }
      } catch (e) {
        console.error("Failed to parse auth:", e)
      }
    }
    setLoading(false)
  }, [])

  // --- REMOVED: The 10-minute auto-refresh interval is gone. ---
  // The app will now rely on apiClient to catch 401 errors and refresh on demand.

  // 2. Handle session expiry cleanly
  // This is passed to apiClient (if you link them) or used internally
  const handleSessionExpired = () => {
    logout()
    error("Your session has expired. Please log in again.")
    window.location.href = "/login"
  }

  // 3. Login
  const login = async (username, password) => {
    try {
      const result = await authService.login(username, password)

      const userData = {
        username,
        email: username,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
        expiresInSeconds: result.expiresInSeconds,
        role: result.role,
        loginTime: new Date().toISOString(),
      }

      setUser(userData)
      localStorage.setItem("propease_auth", JSON.stringify(userData))
      apiClient.setTokens(result.accessToken, result.refreshToken)
      return userData
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  // 4. Logout
  const logout = () => {
    authService.logout()
    setUser(null)
    localStorage.removeItem("propease_auth")
    apiClient.clearTokens() // Ensure apiClient is cleared too
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
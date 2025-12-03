import React, { createContext, useState, useEffect } from "react"
import { authService } from "../services/authService"
import { apiClient } from "../services/apiClient"
import { useToast } from "../components/ui/Toast" // import toast hook

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const { error } = useToast() // for session expiry message

  // 1. Load stored user from localStorage
  useEffect(() => {
    const storedAuth = localStorage.getItem("propease_auth")
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth)
        setUser(parsed)
      } catch (e) {
        console.error("Failed to parse auth:", e)
      }
    }
    setLoading(false)
  }, [])

  // 2. Auto-refresh token every 10 minutes
  useEffect(() => {
    const interval = setInterval(async () => {
      const refreshToken = apiClient.getRefreshToken()
      if (refreshToken) {
        try {
          console.log("[Auth] Attempting silent token refresh...")
          const response = await fetch(`${VITE_API_URL}/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          })

          if (response.ok) {
            const data = await response.json()
            // update user + apiClient
            const updatedUser = { ...user, accessToken: data.accessToken, refreshToken: data.refreshToken }
            setUser(updatedUser)
            localStorage.setItem("propease_auth", JSON.stringify(updatedUser))
            apiClient.setTokens(data.accessToken, data.refreshToken)
            console.log("[Auth] Token refreshed successfully ✅")
          } else {
            console.warn("[Auth] Token refresh failed — logging out...")
            handleSessionExpired()
          }
        } catch (err) {
          console.error("[Auth] Error refreshing token:", err)
          handleSessionExpired()
        }
      }
    }, 10 * 60 * 1000) // every 10 minutes

    return () => clearInterval(interval)
  }, [user])

  // 3. Handle session expiry cleanly
  const handleSessionExpired = () => {
    logout()
    error("Your session has expired. Please log in again.")
    window.location.href = "/login"
  }

  // 4. Login
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

  //  5. Logout
  const logout = () => {
    authService.logout()
    setUser(null)
    localStorage.removeItem("propease_auth")
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

"use client"

import React, { createContext, useState, useEffect } from "react"
import { STATIC_CREDENTIALS } from "../utils/constants"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedAuth = localStorage.getItem("propease_auth")
    if (storedAuth) {
      try {
        setUser(JSON.parse(storedAuth))
      } catch (e) {
        console.error("Failed to parse auth:", e)
      }
    }
    setLoading(false)
  }, [])

  const login = (email, password) => {
    const credential = STATIC_CREDENTIALS.find((c) => c.email === email && c.password === password)

    if (!credential) {
      throw new Error("Invalid email or password")
    }

    const userData = {
      email,
      role: credential.role,
      loginTime: new Date().toISOString(),
    }

    setUser(userData)
    localStorage.setItem("propease_auth", JSON.stringify(userData))
    return userData
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("propease_auth")
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

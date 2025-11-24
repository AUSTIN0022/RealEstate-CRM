import { apiClient } from "./apiClient"

export const userService = {
  // Get all users
  async getAllUsers() {
    try {
      const response = await apiClient.request("/users")
      console.log("All users fetched")
      return response
    } catch (error) {
      console.error("Failed to fetch users:", error)
      throw error
    }
  },

  // Get currently logged-in user info
  async getCurrentUser() {
    try {
      const response = await apiClient.request("/users/me")
      console.log("Current user fetched")
      return response
    } catch (error) {
      console.error("Failed to fetch current user:", error)
      throw error
    }
  },

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await apiClient.request(`/users/${userId}`)
      console.log("User fetched:", userId)
      return response
    } catch (error) {
      console.error("Failed to fetch user:", error)
      throw error
    }
  },

  // Create a new user (admin only)
  async createUser(userData) {
    try {
      const response = await apiClient.request("/users", {
        method: "POST",
        body: JSON.stringify(userData),
      })

      console.log("User created successfully")
      return response
    } catch (error) {
      console.error("Failed to create user:", error)
      throw error
    }
  },

  // Update user details (admin only)
  async updateUser(userId, userData) {
    try {
      const response = await apiClient.request(`/users/${userId}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      })

      console.log("User updated:", userId)
      return response
    } catch (error) {
      console.error("Failed to update user:", error)
      throw error
    }
  },

  // Delete user (admin only)
  async deleteUser(userId) {
    try {
      await apiClient.request(`/users/${userId}`, {
        method: "DELETE",
      })

      console.log("User deleted:", userId)
      return true
    } catch (error) {
      console.error("Failed to delete user:", error)
      throw error
    }
  },

  // Enable/Disable user
  async toggleUserStatus(userId, enabled) {
    try {
      const response = await apiClient.request(`/users/${userId}/status`, {
        method: "PUT",
        body: JSON.stringify({ enabled }),
      })

      console.log("User status updated:", userId)
      return response
    } catch (error) {
      console.error("Failed to update user status:", error)
      throw error
    }
  },

  // Create a new employee (admin only)
  async createEmployee(employeeData) {
    try {
      const response = await apiClient.request("/users", {
        method: "POST",
        body: JSON.stringify(employeeData),
      })

      console.log("Employee created successfully")
      return response
    } catch (error) {
      console.error("Failed to create employee:", error)
      throw error
    }
  },
}

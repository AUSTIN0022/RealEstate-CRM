import { apiClient } from "./apiClient"

export const dashboardService = {
    getDashboard: () => {
        return apiClient.request("/dashboard")
    },
}

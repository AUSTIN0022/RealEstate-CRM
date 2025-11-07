"use client"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { DataProvider } from "./contexts/DataContext"
import { useAuth } from "./contexts/AuthContext"
import { ToastContainer } from "./components/ui/Toast"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ProjectsPage from "./pages/ProjectsPage"
import ProjectDetailPage from "./pages/ProjectDetailPage"
import RegistrationPage from "./pages/RegistrationPage"
import EnquiryBookPage from "./pages/EnquiryBookPage"
import FollowUpPage from "./pages/FollowUpPage"
import BookingsPage from "./pages/BookingsPage"
import ClientsPage from "./pages/ClientsPage"
import ClientProfilePage from "./pages/ClientProfilePage"
import PaymentsPage from "./pages/PaymentsPage"
import NotificationsPage from "./pages/NotificationsPage"
import UsersPage from "./pages/UsersPage"
import SettingsPage from "./pages/SettingsPage"
import { ROLES } from "./utils/constants"

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-600 mb-4">You don't have access to this page.</p>
          <p className="text-sm text-gray-500">Contact your administrator for access.</p>
        </div>
      </div>
    )
  }

  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <ProjectsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects/:projectId"
        element={
          <ProtectedRoute>
            <ProjectDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/registration"
        element={
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            <RegistrationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/enquiry-book"
        element={
          <ProtectedRoute>
            <EnquiryBookPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/follow-up"
        element={
          <ProtectedRoute>
            <FollowUpPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients"
        element={
          <ProtectedRoute>
            <ClientsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clients/:clientId"
        element={
          <ProtectedRoute>
            <ClientProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payments"
        element={
          <ProtectedRoute>
            <PaymentsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredRole={ROLES.ADMIN}>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <ToastContainer />
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </Router>
  )
}

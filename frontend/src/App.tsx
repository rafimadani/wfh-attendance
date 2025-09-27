import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { Login } from "./pages/Login"
import { Dashboard } from "./pages/Dashboard"
import { Attendance } from "./pages/Attendance"
import { Employees } from "./pages/Employees"
import { AttendanceRecords } from "./pages/AttendanceRecords"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="employees" element={<Employees />} />
            <Route path="attendance-records" element={<AttendanceRecords />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

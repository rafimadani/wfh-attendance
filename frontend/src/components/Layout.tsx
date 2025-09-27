"use client"

import type React from "react"
import { Outlet, Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"

export const Layout: React.FC = () => {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-primary text-primary-foreground"
      : "text-muted-foreground hover:text-foreground"
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/dashboard" className="text-xl font-bold text-primary">
                WFH Attendance
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link
                  to="/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/dashboard")}`}
                >
                  Dashboard
                </Link>
                {user?.role === "employee" && (
                  <Link
                    to="/attendance"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/attendance")}`}
                  >
                    Submit Attendance
                  </Link>
                )}
                {user?.role === "hr" && (
                  <>
                    <Link
                      to="/employees"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/employees")}`}
                    >
                      Employees
                    </Link>
                    <Link
                      to="/attendance-records"
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive("/attendance-records")}`}
                    >
                      Attendance Records
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">
                {user?.email} ({user?.role})
              </span>
              <button onClick={logout} className="btn-outline">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  )
}

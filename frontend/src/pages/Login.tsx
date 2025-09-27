/**
 * LOGIN COMPONENT - User authentication interface
 *
 * This component handles user login with form validation and error handling:
 * - Email/password form with controlled inputs
 * - Integration with AuthContext for state management
 * - Automatic redirect for authenticated users
 * - Error display for failed login attempts
 *
 * Key concepts:
 * - Controlled components: React state manages form inputs
 * - React Router: Navigation and redirects
 * - Error handling: Try/catch with user-friendly messages
 * - Loading states: UI feedback during async operations
 */

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"

export const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { user, login } = useAuth()

  useEffect(() => {
    if (user) {
      // Redirect to dashboard if already authenticated
      window.location.href = "/dashboard"
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      // Successful login will trigger redirect via useEffect
    } catch (err: any) {
      console.log(err)
      setError(err.response?.data?.message || err.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">WFH Attendance System</h2>
          <p className="mt-2 text-sm text-muted-foreground">Sign in to your account</p>
        </div>
        <div className="card">
          <div className="card-content">
            <form className="space-y-6" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input mt-1"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="input mt-1"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <button type="submit" className="btn-primary w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <div className="text-sm text-muted-foreground">
                <p>Demo Accounts:</p>
                <p>
                  <strong>HR:</strong> hr@company.com / password123
                </p>
                <p>
                  <strong>Employee:</strong> employee@company.com / password123
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

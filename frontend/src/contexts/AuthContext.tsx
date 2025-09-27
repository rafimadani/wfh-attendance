/**
 * AUTH CONTEXT - React Context for global authentication state
 *
 * This context provides authentication state and methods throughout the React app:
 * - User login/logout functionality
 * - Persistent authentication using localStorage
 * - Loading states during authentication checks
 * - Role-based access control
 *
 * Key concepts:
 * - React Context: Global state management without prop drilling
 * - localStorage: Browser storage for JWT tokens
 * - useEffect: Side effects for initialization and cleanup
 * - Custom hooks: useAuth hook for consuming context
 */

"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { authService } from "../services/authService"

interface User {
  id: number
  email: string
  role: "employee" | "hr"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // Try to get user profile from API
          const userData = await authService.getProfile()
          setUser(userData)
        }
      } catch (error) {
        // Token expired/invalid, remove it
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const response = await authService.login(email, password)
    localStorage.setItem("token", response.access_token)
    setUser(response.user)
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    // Optionally redirect to login page
    window.location.href = "/login"
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

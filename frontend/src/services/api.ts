import axios from "axios"

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost"

export const authAPI = axios.create({
  baseURL: `${API_BASE_URL}:3001`,
})

export const employeeAPI = axios.create({
  baseURL: `${API_BASE_URL}:3002`,
})

export const attendanceAPI = axios.create({
  baseURL: `${API_BASE_URL}:3003`,
})

// Add auth token to requests
const addAuthToken = (config: any) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}

authAPI.interceptors.request.use(addAuthToken)
employeeAPI.interceptors.request.use(addAuthToken)
attendanceAPI.interceptors.request.use(addAuthToken)

// Handle auth errors
const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    const onLoginPage = window.location.pathname === "/login"

    if (!onLoginPage) {
      // kalau user udah di halaman lain (token expired) → redirect
      localStorage.removeItem("token")
      window.location.href = "/login"
    }
    // kalau lagi di halaman login → jangan reload, biarin komponen Login nampilin error
  }
  return Promise.reject(error)
}

authAPI.interceptors.response.use((response) => response, handleAuthError)
employeeAPI.interceptors.response.use((response) => response, handleAuthError)
attendanceAPI.interceptors.response.use((response) => response, handleAuthError)

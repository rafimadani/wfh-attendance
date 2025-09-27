/**
 * ATTENDANCE SERVICE - Frontend API calls for attendance operations
 *
 * This service handles all attendance-related API communications:
 * - Submitting attendance with photo upload
 * - Retrieving attendance records with pagination
 * - Getting attendance statistics
 * - CRUD operations for attendance management
 *
 * Key concepts:
 * - FormData: Multipart form data for file uploads
 * - Query parameters: URL parameters for pagination and filtering
 * - HTTP methods: GET, POST, PATCH, DELETE for different operations
 * - API response handling: Consistent data structure across endpoints
 */

import { attendanceAPI } from "./api"

export const attendanceService = {
  async submitAttendance(formData: FormData) {
    const response = await attendanceAPI.post("/attendance/submit", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  },

  async getAll(page = 1, limit = 10) {
    const response = await attendanceAPI.get(`/attendance?page=${page}&limit=${limit}`)
    return response.data
  },

  async getMyAttendance(page = 1, limit = 10) {
    const response = await attendanceAPI.get(`/attendance/my-attendance?page=${page}&limit=${limit}`)
    return response.data
  },

  async getByEmployee(employeeId: number, page = 1, limit = 10) {
    const response = await attendanceAPI.get(`/attendance/employee/${employeeId}?page=${page}&limit=${limit}`)
    return response.data
  },

  async getStats(employeeId?: number) {
    const url = employeeId ? `/attendance/stats?employeeId=${employeeId}` : "/attendance/stats"
    const response = await attendanceAPI.get(url)
    return response.data
  },

  async getMyStats() {
    const response = await attendanceAPI.get("/attendance/my-stats")
    return response.data
  },

  async getTodayAttendance() {
    const response = await attendanceAPI.get("/attendance/today")
    return response.data
  },

  async update(id: number, data: any) {
    const response = await attendanceAPI.patch(`/attendance/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    const response = await attendanceAPI.delete(`/attendance/${id}`)
    return response.data
  },
}

"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { attendanceService } from "../services/attendanceService"
import { employeeService } from "../services/employeeService" // 👈 added

interface AttendanceRecord {
  id: number
  employeeId: number
  checkInTime: string
  photoPath: string
  notes: string
  status: "present" | "absent" | "late"
  employee?: {
    firstName: string
    lastName: string
    department: string
  }
}

export const AttendanceRecords: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    fetchRecords()
  }, [currentPage])

  const fetchRecords = async () => {
    try {
      const response = await attendanceService.getAll(currentPage, 10)
      const employees = await employeeService.getAll()

      // enrich attendance with employee info
      const enriched = response.data.map((r: any) => {
        const emp = employees.find((e: any) => e.id === r.employeeId)
        return {
          ...r,
          employee: emp
            ? { firstName: emp.firstName, lastName: emp.lastName, department: emp.department }
            : null,
        }
      })

      setRecords(enriched)
      setTotalPages(Math.ceil(response.total / response.limit))
    } catch (error) {
      console.error("Error fetching attendance records:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Attendance Records</h1>
        <p className="text-muted-foreground">View all employee attendance submissions</p>
      </div>

      <div className="card">
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Check-in Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {records.map((record) => (
                  <tr key={record.id}>
                    {/* ✅ Employee Name */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                      {record.employee
                        ? `${record.employee.firstName} ${record.employee.lastName}`
                        : `ID: ${record.employeeId}`}
                    </td>

                    {/* ✅ Department */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {record.employee?.department || "-"}
                    </td>

                    {/* Check-in Time */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {new Date(record.checkInTime).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          record.status === "present"
                            ? "bg-green-100 text-green-800"
                            : record.status === "late"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    {/* Photo */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.photoPath && (
                        <img
                          src={`http://localhost:3003/uploads/${record.photoPath.split("/").pop()}`}
                          alt="Attendance proof"
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                    </td>

                    {/* Notes */}
                    <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">
                      {record.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="btn-outline disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="btn-outline disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * ATTENDANCE COMPONENT - Employee attendance submission interface
 *
 * This component allows employees to submit daily attendance with photo proof:
 * - File upload for work-from-home photos
 * - Form validation and preview functionality
 * - Success/error state management
 * - Integration with attendance service API
 *
 * Key concepts:
 * - File handling: FileReader API and FormData for uploads
 * - useRef: Direct DOM access for file input reset
 * - Conditional rendering: Different UI states (form, success, error)
 * - FormData: Multipart form data for file uploads
 */

"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useAuth } from "../contexts/AuthContext"
import { attendanceService } from "../services/attendanceService"

export const Attendance: React.FC = () => {
  const { user } = useAuth()
  const [photo, setPhoto] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhoto(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!photo) {
      setError("Please select a photo")
      return
    }

    setLoading(true)
    setError("")

    try {
      const formData = new FormData()
      formData.append("photo", photo)
      formData.append("employeeId", user?.id.toString() || "")
      formData.append("notes", notes)

      await attendanceService.submitAttendance(formData)

      // On success: clear form and show success
      setSuccess(true)
      setPhoto(null)
      setNotes("")
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to submit attendance")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="card-content text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Attendance Submitted!</h3>
            <p className="text-muted-foreground mb-6">Your attendance has been recorded successfully.</p>
            <button onClick={() => setSuccess(false)} className="btn-primary">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Submit Attendance</h2>
          <p className="text-sm text-muted-foreground">Upload a photo as proof of your work from home</p>
        </div>
        <div className="card-content">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="photo" className="block text-sm font-medium text-foreground mb-2">
                Work Photo *
              </label>
              <input
                ref={fileInputRef}
                id="photo"
                name="photo"
                type="file"
                accept="image/*"
                required
                className="input"
                onChange={handlePhotoChange}
              />
              <p className="text-xs text-muted-foreground mt-1">Upload a photo showing you're working from home</p>
            </div>

            {photo && (
              <div className="mt-4">
                <p className="text-sm font-medium text-foreground mb-2">Preview:</p>
                <img
                  src={URL.createObjectURL(photo) || "/placeholder.svg"}
                  alt="Work photo preview"
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-foreground mb-2">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="input resize-none"
                placeholder="Add any notes about your work today..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-primary w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Attendance"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

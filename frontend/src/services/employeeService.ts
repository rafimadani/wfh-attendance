import { employeeAPI } from "./api"

export const employeeService = {
  async getAll() {
    const response = await employeeAPI.get("/employees")
    return response.data
  },

  async getById(id: number) {
    const response = await employeeAPI.get(`/employees/${id}`)
    return response.data
  },

  async create(data: any) {
    const response = await employeeAPI.post("/employees", data)
    return response.data
  },

  async update(id: number, data: any) {
    const response = await employeeAPI.patch(`/employees/${id}`, data)
    return response.data
  },

  async delete(id: number) {
    const response = await employeeAPI.delete(`/employees/${id}`)
    return response.data
  },

  async getStats() {
    const response = await employeeAPI.get("/employees/stats")
    return response.data
  },
}

import { authAPI } from "./api"

export const authService = {
  async login(email: string, password: string) {
    const response = await authAPI.post("/auth/login", { email, password })
    return response.data
  },

  async register(email: string, password: string, role?: string) {
    const response = await authAPI.post("/auth/register", { email, password, role })
    return response.data
  },

  async getProfile() {
    const response = await authAPI.get("/auth/profile")
    return response.data
  },

  async verifyToken() {
    const response = await authAPI.get("/auth/verify")
    return response.data
  },
}

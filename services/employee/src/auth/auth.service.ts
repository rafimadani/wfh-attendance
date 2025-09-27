import { Injectable } from "@nestjs/common"
import type { HttpService } from "@nestjs/axios"
import type { ConfigService } from "@nestjs/config"
import { firstValueFrom } from "rxjs"

@Injectable()
export class AuthService {
  private authServiceUrl: string

  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    this.authServiceUrl = this.configService.get("AUTH_SERVICE_URL", "http://localhost:3001")
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.authServiceUrl}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      )
      return response.data
    } catch (error) {
      throw new Error("Invalid token")
    }
  }
}

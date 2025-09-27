import type { HttpService } from "@nestjs/axios";
import type { ConfigService } from "@nestjs/config";
export declare class AuthService {
    private httpService;
    private configService;
    private authServiceUrl;
    constructor(httpService: HttpService, configService: ConfigService);
    verifyToken(token: string): Promise<any>;
}

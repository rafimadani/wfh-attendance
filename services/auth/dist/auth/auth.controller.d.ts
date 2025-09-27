import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: import("../users/entities/user.entity").UserRole;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: import("../users/entities/user.entity").UserRole;
        };
    }>;
    getProfile(req: any): Promise<void>;
    verifyToken(req: any): Promise<{
        valid: boolean;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
}

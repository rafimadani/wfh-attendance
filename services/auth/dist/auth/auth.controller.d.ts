import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UsersService } from "../users/users.service";
import { UserRole } from "../users/entities/user.entity";
export declare class AuthController {
    private authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: UserRole;
        };
    }>;
    register(registerDto: RegisterDto): Promise<{
        access_token: string;
        user: {
            id: number;
            email: string;
            role: UserRole;
        };
    }>;
    getProfile(req: any): Promise<{
        id: number;
        email: string;
        role: UserRole;
        createdAt: Date;
    }>;
    verifyToken(req: any): Promise<{
        valid: boolean;
        user: {
            id: any;
            email: any;
            role: any;
        };
    }>;
    deleteUser(id: number): Promise<void>;
}

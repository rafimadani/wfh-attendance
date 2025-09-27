import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import type { User } from "../users/entities/user.entity";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { UserRole } from "../users/entities/user.entity";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<User | null>;
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
    getProfile(userId: number): Promise<{
        id: number;
        email: string;
        role: UserRole;
        createdAt: Date;
    }>;
}

/**
 * AUTH SERVICE - Core authentication logic for the WFH Attendance System
 *
 * This service handles user authentication using JWT tokens. It's responsible for:
 * - Validating user credentials during login
 * - Generating JWT tokens for authenticated users
 * - User registration with password hashing
 * - User profile retrieval
 *
 * Key concepts:
 * - JWT (JSON Web Tokens): Stateless authentication tokens that contain user info
 * - bcrypt: Library for hashing passwords securely
 * - Role-based access: Users have roles (employee, hr) that determine permissions
 */

import { Injectable, UnauthorizedException } from "@nestjs/common"
import  { JwtService } from "@nestjs/jwt"
import  { UsersService } from "../users/users.service"
import type { User } from "../users/entities/user.entity"
import  { LoginDto } from "./dto/login.dto"
import  { RegisterDto } from "./dto/register.dto"
import { UserRole } from "../users/entities/user.entity";
import { CreateUserDto } from "../users/dto/create-user.dto";

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService, // JWT service for creating and verifying tokens
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    // TODO: Find user by email using UsersService
    // TODO: Validate the provided password against the stored hash
    // TODO: Return the user if valid, null if invalid
    // Hint: Use this.usersService.findByEmail() and this.usersService.validatePassword()
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null; // no user found
    }
    const isValid = await this.usersService.validatePassword(user, password);
    if (!isValid) {
      return null; // password mismatch
    }
    return user;

    // throw new Error("TODO: Implement user validation")
  }


  async login(loginDto: LoginDto) {
    // TODO: Validate user credentials using validateUser method
    // TODO: If invalid, throw UnauthorizedException with "Invalid credentials"
    // TODO: Create JWT payload with user id, email, and role
    // TODO: Generate access token using this.jwtService.sign()
    // TODO: Return object with access_token and user info (id, email, role)
    const user = await this.validateUser(loginDto.email,loginDto.password)
    if (!user){
      throw new UnauthorizedException('Invalid credentials')
    }
    const payload = { sub: user.id, email: user.email, role: user.role };
    const access_token = this.jwtService.sign(payload);
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    // throw new Error("TODO: Implement login logic")

  }

    async register(registerDto: RegisterDto) {
    // 1. Map RegisterDto → CreateUserDto
    const createUserDto: CreateUserDto = {
      email: registerDto.email,
      password: registerDto.password,
      role: UserRole.EMPLOYEE, // enforce default role
    };

    // 2. Create user in DB
    const user = await this.usersService.create(createUserDto);

    // 3. Build JWT payload
    const payload = { sub: user.id, email: user.email, role: user.role };

    // 4. Sign JWT
    const access_token = this.jwtService.sign(payload);

    // 5. Return response
    return {
      access_token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
  async getProfile(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // Exclude sensitive fields like password
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}

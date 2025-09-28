import { Body,Controller, Post, Get, UseGuards, Request, Delete,ParseIntPipe,Param } from "@nestjs/common"
import { AuthService } from "./auth.service"
import  { LoginDto } from "./dto/login.dto"
import  { RegisterDto } from "./dto/register.dto"
import { JwtAuthGuard } from "./guards/jwt-auth.guard"
import { UsersService } from "../users/users.service"; // 👈 add this
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "./decorators/roles.decorator";
import { UserRole } from "../users/entities/user.entity";



@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService,  private readonly usersService: UsersService, // 👈 inject UsersService here
) {}


  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto)
  }

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }


  @UseGuards(JwtAuthGuard)
  @Get('verify')
  async verifyToken(@Request() req) {
    return {
      valid: true,
      user: {
        id: req.user.sub,
        email: req.user.email,
        role: req.user.role,
      },
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.HR)
  @Delete("users/:id")
  async deleteUser(@Param("id", ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

}

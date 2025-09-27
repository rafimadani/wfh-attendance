import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from "class-validator"
import { UserRole } from "../entities/user.entity"

export class CreateUserDto {
  @IsEmail()
  email: string

  @IsString()
  @MinLength(6)
  password: string

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole
}

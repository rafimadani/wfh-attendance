import { IsString, IsOptional, IsEnum, IsDateString, IsNumber } from "class-validator"
import { EmployeeStatus } from "../entities/employee.entity"

export class CreateEmployeeDto {
  @IsOptional()
  @IsNumber()
  userId?: number

  @IsString()
  employeeId: string

  @IsString()
  firstName: string

  @IsString()
  lastName: string

  @IsOptional()
  @IsString()
  department?: string

  @IsOptional()
  @IsString()
  position?: string

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsDateString()
  hireDate?: string

  @IsOptional()
  @IsEnum(EmployeeStatus)
  status?: EmployeeStatus
}

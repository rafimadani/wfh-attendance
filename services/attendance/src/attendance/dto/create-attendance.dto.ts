import { IsNumber, IsOptional, IsString, IsEnum } from "class-validator"
import { AttendanceStatus } from "../entities/attendance.entity"

export class CreateAttendanceDto {
  @IsNumber()
  employeeId: number

  @IsOptional()
  @IsString()
  notes?: string

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus
}

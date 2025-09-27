import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Query,
  UseInterceptors,
  Request,
  BadRequestException,
  UploadedFile,
} from "@nestjs/common"
import { FileInterceptor } from "@nestjs/platform-express"
import { AttendanceService } from "./attendance.service"
import { CreateAttendanceDto } from "./dto/create-attendance.dto"
import { UpdateAttendanceDto } from "./dto/update-attendance.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/enums/user-role.enum"
import type { Express } from "express"
import { diskStorage } from "multer"
import { extname } from "path"
@Controller("attendance")
@UseGuards(JwtAuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post("submit")
  @UseInterceptors(
    FileInterceptor("photo", {
      storage: diskStorage({
        destination: "./uploads",  // folder tujuan simpan file
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
          cb(null, file.fieldname + "-" + uniqueSuffix + extname(file.originalname))
        },
      }),
    }),
  )
  async create(
    @UploadedFile() photo: Express.Multer.File,
    @Request() req,
    @Query("employeeId") employeeId?: string,
  ) {
    if (!photo) throw new BadRequestException("Photo is required for attendance")

    let empId: number

    if (req.user.role === UserRole.EMPLOYEE) {
      empId = req.user.sub
    } else if (req.user.role === UserRole.HR) {
      if (!employeeId) throw new BadRequestException("Employee ID is required for HR")
      empId = Number(employeeId)
    }

    // ⬇️ Forward token ke service
    const authHeader = req.headers.authorization

    return this.attendanceService.create(
      { employeeId: empId },
      photo.path,
      authHeader,    // 👈 pass ke service
    )
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  findAll(@Query("page", ParseIntPipe) page = 1, @Query("limit", ParseIntPipe) limit = 10) {
    return this.attendanceService.findAll(page, limit)
  }

  @Get("employee/:employeeId")
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  findByEmployee(
    @Param("employeeId", ParseIntPipe) employeeId: number,
    @Query("page", ParseIntPipe) page = 1,
    @Query("limit", ParseIntPipe) limit = 10,
  ) {
    return this.attendanceService.findByEmployee(employeeId, page, limit)
  }

  // @Get("stats")
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.HR)
  // getStats(@Query("employeeId") employeeId?: string) {
  //   const empId = employeeId ? Number.parseInt(employeeId) : undefined
  //   return this.attendanceService.getAttendanceStats(empId)
  // }

  @Get("my-attendance")
  async getMyAttendance(@Request() req, @Query("page") page = 1, @Query("limit") limit = 10) {
    return this.attendanceService.findByEmployee(req.user.sub, page, limit)
  }

  @Get("today")
  async getTodayAttendance(@Request() req) {
    return this.attendanceService.getTodayAttendance(req.user.sub)
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.attendanceService.findOne(id)
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  update(@Param("id", ParseIntPipe) id: number, updateAttendanceDto: UpdateAttendanceDto) {
    return this.attendanceService.update(id, updateAttendanceDto)
  }

  @Delete(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.attendanceService.remove(id)
  }
}

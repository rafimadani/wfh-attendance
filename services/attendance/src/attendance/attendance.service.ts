import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common"
import { InjectRepository } from "@nestjs/typeorm"
import { Repository, Between } from "typeorm"
import { HttpService } from "@nestjs/axios"
import { ConfigService } from "@nestjs/config"
import { firstValueFrom } from "rxjs"
import { Attendance } from "./entities/attendance.entity"
import { CreateAttendanceDto } from "./dto/create-attendance.dto"
import { UpdateAttendanceDto } from "./dto/update-attendance.dto"

@Injectable()
export class AttendanceService {
  private employeeServiceUrl: string

  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.employeeServiceUrl = this.configService.get("EMPLOYEE_SERVICE_URL", "http://localhost:3002")
  }

  /**
   * Create new attendance record
   * @param createAttendanceDto contains `employeeId` (actually userId from JWT or query)
   * @param photoPath path to uploaded photo
   */
  async create(
    createAttendanceDto: CreateAttendanceDto,
    photoPath?: string,
    authHeader?: string,
  ): Promise<Attendance> {
    let employee;
    try {
      console.log(authHeader)
      const response = await firstValueFrom(
        this.httpService.get(
          `${this.employeeServiceUrl}/employees/by-user/${createAttendanceDto.employeeId}`,
          {
            headers: {
              Authorization: authHeader, // 🔑 forward token
            },
          },
        ),
      );
      employee = response.data;
    } catch (err) {
      console.error("❌ Error calling EmployeeService:", err.response?.data || err.message);
      throw new BadRequestException("Employee not found (auth issue?)");
    }

    if (!employee) {
      throw new BadRequestException("Employee not found");
    }

    // 🔎 Step 2: Prevent duplicate attendance for today
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    const existing = await this.attendanceRepository.findOne({
      where: {
        employeeId: employee.id, // pakai PK employee.id
        checkInTime: Between(startOfDay, endOfDay),
      },
    })

    if (existing) {
      throw new BadRequestException("Attendance already recorded for today")
    }

    // 🔎 Step 3: Save record
    const record = this.attendanceRepository.create({
      employeeId: employee.id, // simpan PK employee.id
      photoPath,
      checkInTime: new Date(),
    })

    return this.attendanceRepository.save(record)
  }

  async findAll(page = 1, limit = 10) {
    const [data, total] = await this.attendanceRepository.findAndCount({
      order: { checkInTime: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total, page, limit }
  }

  async findByEmployee(employeeId: number, page = 1, limit = 10) {
    const [data, total] = await this.attendanceRepository.findAndCount({
      where: { employeeId },
      order: { checkInTime: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { data, total, page, limit }
  }

  async findOne(id: number): Promise<Attendance> {
    const attendance = await this.attendanceRepository.findOne({ where: { id } })
    if (!attendance) throw new NotFoundException(`Attendance ${id} not found`)
    return attendance
  }

  async update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance> {
    const attendance = await this.findOne(id)
    Object.assign(attendance, updateAttendanceDto)
    return this.attendanceRepository.save(attendance)
  }

  async remove(id: number): Promise<void> {
    const attendance = await this.findOne(id)
    await this.attendanceRepository.remove(attendance)
  }

  async getTodayAttendance(employeeId: number): Promise<Attendance | null> {
    const now = new Date()
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const endOfDay = new Date(startOfDay)
    endOfDay.setDate(endOfDay.getDate() + 1)

    return this.attendanceRepository.findOne({
      where: { employeeId, checkInTime: Between(startOfDay, endOfDay) },
    })
  }
}

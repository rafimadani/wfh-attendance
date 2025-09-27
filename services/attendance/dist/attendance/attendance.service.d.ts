import { Repository } from "typeorm";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { Attendance } from "./entities/attendance.entity";
import { CreateAttendanceDto } from "./dto/create-attendance.dto";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
export declare class AttendanceService {
    private readonly attendanceRepository;
    private readonly httpService;
    private readonly configService;
    private employeeServiceUrl;
    constructor(attendanceRepository: Repository<Attendance>, httpService: HttpService, configService: ConfigService);
    create(createAttendanceDto: CreateAttendanceDto, photoPath?: string, authHeader?: string): Promise<Attendance>;
    findAll(page?: number, limit?: number): Promise<{
        data: Attendance[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByEmployee(employeeId: number, page?: number, limit?: number): Promise<{
        data: Attendance[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: number): Promise<Attendance>;
    update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<Attendance>;
    remove(id: number): Promise<void>;
    getTodayAttendance(employeeId: number): Promise<Attendance | null>;
}

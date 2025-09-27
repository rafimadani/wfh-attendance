import { AttendanceService } from "./attendance.service";
import { UpdateAttendanceDto } from "./dto/update-attendance.dto";
export declare class AttendanceController {
    private readonly attendanceService;
    constructor(attendanceService: AttendanceService);
    create(photo: Express.Multer.File, req: any, employeeId?: string): Promise<import("./entities/attendance.entity").Attendance>;
    findAll(page?: number, limit?: number): Promise<{
        data: import("./entities/attendance.entity").Attendance[];
        total: number;
        page: number;
        limit: number;
    }>;
    findByEmployee(employeeId: number, page?: number, limit?: number): Promise<{
        data: import("./entities/attendance.entity").Attendance[];
        total: number;
        page: number;
        limit: number;
    }>;
    getMyAttendance(req: any, page?: number, limit?: number): Promise<{
        data: import("./entities/attendance.entity").Attendance[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTodayAttendance(req: any): Promise<import("./entities/attendance.entity").Attendance>;
    findOne(id: number): Promise<import("./entities/attendance.entity").Attendance>;
    update(id: number, updateAttendanceDto: UpdateAttendanceDto): Promise<import("./entities/attendance.entity").Attendance>;
    remove(id: number): Promise<void>;
}

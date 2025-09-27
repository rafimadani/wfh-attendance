import { AttendanceStatus } from "../entities/attendance.entity";
export declare class CreateAttendanceDto {
    employeeId: number;
    notes?: string;
    status?: AttendanceStatus;
}

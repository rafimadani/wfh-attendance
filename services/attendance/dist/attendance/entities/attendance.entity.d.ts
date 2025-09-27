export declare enum AttendanceStatus {
    PRESENT = "present",
    ABSENT = "absent",
    LATE = "late"
}
export declare class Attendance {
    id: number;
    employeeId: number;
    checkInTime: Date;
    photoPath: string;
    notes: string;
    status: AttendanceStatus;
    createdAt: Date;
    updatedAt: Date;
}

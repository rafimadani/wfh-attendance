export declare enum EmployeeStatus {
    ACTIVE = "active",
    INACTIVE = "inactive"
}
export declare class Employee {
    id: number;
    userId: number;
    employeeId: string;
    firstName: string;
    lastName: string;
    department: string;
    position: string;
    phone: string;
    hireDate: Date;
    status: EmployeeStatus;
    createdAt: Date;
    updatedAt: Date;
}

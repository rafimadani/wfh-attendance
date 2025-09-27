import { EmployeeStatus } from "../entities/employee.entity";
export declare class CreateEmployeeDto {
    userId?: number;
    employeeId: string;
    firstName: string;
    lastName: string;
    department?: string;
    position?: string;
    phone?: string;
    hireDate?: string;
    status?: EmployeeStatus;
}

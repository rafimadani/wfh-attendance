import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<import("./entities/employee.entity").Employee>;
    findAll(): Promise<import("./entities/employee.entity").Employee[]>;
    search(name?: string, position?: string): Promise<import("./entities/employee.entity").Employee[]>;
    findOne(id: number): Promise<import("./entities/employee.entity").Employee>;
    findByUserId(userId: number): Promise<import("./entities/employee.entity").Employee>;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<import("./entities/employee.entity").Employee>;
    remove(id: number): Promise<void>;
}

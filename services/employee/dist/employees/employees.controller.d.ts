import { EmployeesService } from "./employees.service";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
export declare class EmployeesController {
    private readonly employeesService;
    constructor(employeesService: EmployeesService);
    create(createEmployeeDto: CreateEmployeeDto): Promise<import("./entities/employee.entity").Employee>;
    findAll(): Promise<import("./entities/employee.entity").Employee[]>;
    getMyEmployee(req: any): Promise<import("./entities/employee.entity").Employee>;
    findOne(id: number, req: any): Promise<import("./entities/employee.entity").Employee>;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<import("./entities/employee.entity").Employee>;
    remove(id: number, req: any): Promise<void>;
    createWithUser(body: any, req: any): Promise<import("./entities/employee.entity").Employee>;
}

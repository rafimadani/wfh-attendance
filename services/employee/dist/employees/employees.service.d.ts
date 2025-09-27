import { Repository } from "typeorm";
import { Employee } from "./entities/employee.entity";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
export declare class EmployeesService {
    private readonly employeesRepository;
    constructor(employeesRepository: Repository<Employee>);
    create(createEmployeeDto: CreateEmployeeDto): Promise<Employee>;
    findAll(): Promise<Employee[]>;
    findOne(id: number): Promise<Employee>;
    search(name?: string, position?: string): Promise<Employee[]>;
    findByUserId(userId: number): Promise<Employee | null>;
    findByEmployeeId(employeeId: string): Promise<Employee | null>;
    update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee>;
    remove(id: number): Promise<void>;
    getEmployeeStats(): Promise<void>;
}

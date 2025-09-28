/**
 * EMPLOYEES SERVICE - CRUD operations for employee management
 *
 * This service handles all employee-related database operations:
 * - Creating new employee records with unique employee IDs
 * - Retrieving employee information for HR dashboard
 * - Updating employee details with validation
 * - Generating employee statistics
 *
 * Key concepts:
 * - Unique constraints: Employee IDs must be unique across the system
 * - Status management: Employees can be active/inactive
 * - User relationship: Employees are linked to User accounts for authentication
 */

import { Injectable, NotFoundException, ConflictException,BadRequestException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Employee } from "./entities/employee.entity";
import { CreateEmployeeDto } from "./dto/create-employee.dto";
import { UpdateEmployeeDto } from "./dto/update-employee.dto";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeesRepository: Repository<Employee>,
    private readonly httpService: HttpService,
  ) {}

  async createWithUser(
    body: CreateEmployeeDto & { email: string; password: string; authHeader?: string }
  ): Promise<Employee> {
    let user;
    try {
      // Step 1: Call Auth Service to register user
      const response = await firstValueFrom(
        this.httpService.post(
          "http://auth-service:3001/auth/register", // 👈 change host/port as needed
          {
            email: body.email,
            password: body.password,
          },
          body.authHeader ? { headers: { Authorization: body.authHeader } } : {},
        )
      );
      user = response.data.user;
    } catch (err) {
      console.error("❌ Error creating user:", err.response?.data || err.message);
      throw new BadRequestException("Failed to create user");
    }

    try {
      // Step 2: Create Employee linked with user.id
      const { email, password, authHeader, ...employeeData } = body;
      const employee = this.employeesRepository.create({
        ...employeeData,
        userId: user.id,
      });
      return await this.employeesRepository.save(employee);
    } catch (err) {
      console.error("❌ Error creating employee, rolling back user:", err);

      // Step 3: Rollback user if employee creation fails
      if (user?.id) {
        try {
          await firstValueFrom(
            this.httpService.delete(`http://auth-service:3001/users/${user.id}`)
          );
        } catch (rollbackErr) {
          console.error("⚠️ Failed to rollback user:", rollbackErr.message);
        }
      }

      throw new BadRequestException("Failed to create employee");
    }
  }
  async create(createEmployeeDto: CreateEmployeeDto): Promise<Employee> {
    const existing = await this.employeesRepository.findOne({
      where: { employeeId: createEmployeeDto.employeeId },
    });
    if (existing) {
      throw new ConflictException("Employee with this ID already exists");
    }

    const employee = this.employeesRepository.create(createEmployeeDto);
    return this.employeesRepository.save(employee);
  }

   
  

  async findAll(): Promise<Employee[]> {
    return this.employeesRepository.find({
      order: { createdAt: "DESC" },
    });
  }

  async findOne(id: number): Promise<Employee> {
    const employee = await this.employeesRepository.findOneBy({ id });
    if (!employee) {
      throw new NotFoundException(`Employee with ID ${id} not found`);
    }
    return employee;
  }

  // employees.service.ts
  async search(name?: string, position?: string): Promise<Employee[]> {
    const qb = this.employeesRepository.createQueryBuilder("employee");

    if (name) {
      qb.andWhere(
        "LOWER(employee.firstName) LIKE LOWER(:name) OR LOWER(employee.lastName) LIKE LOWER(:name) OR LOWER(CONCAT(employee.firstName, ' ', employee.lastName)) LIKE LOWER(:name)",
        { name: `%${name}%` },
      );
    }

    if (position) {
      qb.andWhere("LOWER(employee.position) LIKE LOWER(:position)", {
        position: `%${position}%`,
      });
    }

    return qb.orderBy("employee.createdAt", "DESC").getMany();
  }


  async findByUserId(userId: number): Promise<Employee | null> {
    return this.employeesRepository.findOne({ where: { userId } });
  }

  async findByEmployeeId(employeeId: string): Promise<Employee | null> {
    return this.employeesRepository.findOne({ where: { employeeId } });
  }

  async update(id: number, updateEmployeeDto: UpdateEmployeeDto): Promise<Employee> {
    const employee = await this.findOne(id);

    // Check if updating employeeId conflicts with another record
    if (updateEmployeeDto.employeeId && updateEmployeeDto.employeeId !== employee.employeeId) {
      const conflict = await this.findByEmployeeId(updateEmployeeDto.employeeId);
      if (conflict) {
        throw new ConflictException("Employee ID already in use");
      }
    }

    Object.assign(employee, updateEmployeeDto);
    return this.employeesRepository.save(employee);
  }

  async remove(id: number, authHeader?: string): Promise<void> {
  const employee = await this.findOne(id);
  // console.log(employee);

  if (employee.userId) {
    try {
      await firstValueFrom(
        this.httpService.delete(
          `http://auth-service:3001/auth/users/${employee.userId}`,
          authHeader ? { headers: { Authorization: authHeader } } : {},
        ),
      );
    } catch (err) {
      // console.error("❌ Failed to delete user in Auth service:", err.response?.data || err.message);
      throw new BadRequestException("Failed to delete linked user, employee not deleted");
    }
  }

  await this.employeesRepository.remove(employee);
}




//   async registerWithUser(
//   email: string,
//   password: string,
//   employeeData: any,
//   authHeader?: string,
// ) {
//     let user;
//     try {
//       // Step 1: Create user via Auth Service
//       const response = await firstValueFrom(
//         this.httpService.post(
//           `${this.authServiceUrl}/auth/register`,
//           { email, password, role: "employee" }, // enforce employee role
//           { headers: { Authorization: authHeader } },
//         ),
//       );
//       user = response.data.user;
//     } catch (err) {
//       console.error("❌ Error creating user:", err.response?.data || err.message);
//       throw new BadRequestException("Failed to create user");
//     }

//     try {
//       // Step 2: Create employee linked with user.id
//       const employee = this.employeeRepository.create({
//         ...employeeData,
//         userId: user.id,
//       });
//       return await this.employeeRepository.save(employee);
//     } catch (err) {
//       console.error("❌ Error creating employee, rolling back user:", err);

//       // Step 3: Rollback user if employee creation fails
//       if (user?.id) {
//         try {
//           await firstValueFrom(
//             this.httpService.delete(`${this.authServiceUrl}/users/${user.id}`, {
//               headers: { Authorization: authHeader },
//             }),
//           );
//         } catch (rollbackErr) {
//           console.error("⚠️ Failed to rollback user:", rollbackErr.message);
//         }
//       }

//       throw new BadRequestException("Failed to create employee");
//     }
//   }


  async getEmployeeStats() {
    // TODO: Count total employees
    // TODO: Count active employees (status: "active")
    // TODO: Count inactive employees (status: "inactive")
    // TODO: Return statistics object with total, active, inactive counts
    // Hint: Use this.employeesRepository.count() with where conditions
    throw new Error("TODO: Implement employee statistics")
  }
}

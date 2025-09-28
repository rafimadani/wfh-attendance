"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const employee_entity_1 = require("./entities/employee.entity");
const axios_1 = require("@nestjs/axios");
const rxjs_1 = require("rxjs");
let EmployeesService = class EmployeesService {
    constructor(employeesRepository, httpService) {
        this.employeesRepository = employeesRepository;
        this.httpService = httpService;
    }
    async createWithUser(body) {
        let user;
        try {
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.post("http://auth-service:3001/auth/register", {
                email: body.email,
                password: body.password,
            }, body.authHeader ? { headers: { Authorization: body.authHeader } } : {}));
            user = response.data.user;
        }
        catch (err) {
            console.error("❌ Error creating user:", err.response?.data || err.message);
            throw new common_1.BadRequestException("Failed to create user");
        }
        try {
            const { email, password, authHeader, ...employeeData } = body;
            const employee = this.employeesRepository.create({
                ...employeeData,
                userId: user.id,
            });
            return await this.employeesRepository.save(employee);
        }
        catch (err) {
            console.error("❌ Error creating employee, rolling back user:", err);
            if (user?.id) {
                try {
                    await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`http://auth-service:3001/users/${user.id}`));
                }
                catch (rollbackErr) {
                    console.error("⚠️ Failed to rollback user:", rollbackErr.message);
                }
            }
            throw new common_1.BadRequestException("Failed to create employee");
        }
    }
    async create(createEmployeeDto) {
        const existing = await this.employeesRepository.findOne({
            where: { employeeId: createEmployeeDto.employeeId },
        });
        if (existing) {
            throw new common_1.ConflictException("Employee with this ID already exists");
        }
        const employee = this.employeesRepository.create(createEmployeeDto);
        return this.employeesRepository.save(employee);
    }
    async findAll() {
        return this.employeesRepository.find({
            order: { createdAt: "DESC" },
        });
    }
    async findOne(id) {
        const employee = await this.employeesRepository.findOneBy({ id });
        if (!employee) {
            throw new common_1.NotFoundException(`Employee with ID ${id} not found`);
        }
        return employee;
    }
    async search(name, position) {
        const qb = this.employeesRepository.createQueryBuilder("employee");
        if (name) {
            qb.andWhere("LOWER(employee.firstName) LIKE LOWER(:name) OR LOWER(employee.lastName) LIKE LOWER(:name) OR LOWER(CONCAT(employee.firstName, ' ', employee.lastName)) LIKE LOWER(:name)", { name: `%${name}%` });
        }
        if (position) {
            qb.andWhere("LOWER(employee.position) LIKE LOWER(:position)", {
                position: `%${position}%`,
            });
        }
        return qb.orderBy("employee.createdAt", "DESC").getMany();
    }
    async findByUserId(userId) {
        return this.employeesRepository.findOne({ where: { userId } });
    }
    async findByEmployeeId(employeeId) {
        return this.employeesRepository.findOne({ where: { employeeId } });
    }
    async update(id, updateEmployeeDto) {
        const employee = await this.findOne(id);
        if (updateEmployeeDto.employeeId && updateEmployeeDto.employeeId !== employee.employeeId) {
            const conflict = await this.findByEmployeeId(updateEmployeeDto.employeeId);
            if (conflict) {
                throw new common_1.ConflictException("Employee ID already in use");
            }
        }
        Object.assign(employee, updateEmployeeDto);
        return this.employeesRepository.save(employee);
    }
    async remove(id, authHeader) {
        const employee = await this.findOne(id);
        if (employee.userId) {
            try {
                await (0, rxjs_1.firstValueFrom)(this.httpService.delete(`http://auth-service:3001/auth/users/${employee.userId}`, authHeader ? { headers: { Authorization: authHeader } } : {}));
            }
            catch (err) {
                throw new common_1.BadRequestException("Failed to delete linked user, employee not deleted");
            }
        }
        await this.employeesRepository.remove(employee);
    }
    async getEmployeeStats() {
        throw new Error("TODO: Implement employee statistics");
    }
};
exports.EmployeesService = EmployeesService;
exports.EmployeesService = EmployeesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(employee_entity_1.Employee)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService])
], EmployeesService);
//# sourceMappingURL=employees.service.js.map
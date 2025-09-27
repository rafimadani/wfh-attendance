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
exports.AttendanceService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const axios_1 = require("@nestjs/axios");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const attendance_entity_1 = require("./entities/attendance.entity");
let AttendanceService = class AttendanceService {
    constructor(attendanceRepository, httpService, configService) {
        this.attendanceRepository = attendanceRepository;
        this.httpService = httpService;
        this.configService = configService;
        this.employeeServiceUrl = this.configService.get("EMPLOYEE_SERVICE_URL", "http://localhost:3002");
    }
    async create(createAttendanceDto, photoPath, authHeader) {
        let employee;
        try {
            console.log(authHeader);
            const response = await (0, rxjs_1.firstValueFrom)(this.httpService.get(`${this.employeeServiceUrl}/employees/by-user/${createAttendanceDto.employeeId}`, {
                headers: {
                    Authorization: authHeader,
                },
            }));
            employee = response.data;
        }
        catch (err) {
            console.error("❌ Error calling EmployeeService:", err.response?.data || err.message);
            throw new common_1.BadRequestException("Employee not found (auth issue?)");
        }
        if (!employee) {
            throw new common_1.BadRequestException("Employee not found");
        }
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        const existing = await this.attendanceRepository.findOne({
            where: {
                employeeId: employee.id,
                checkInTime: (0, typeorm_2.Between)(startOfDay, endOfDay),
            },
        });
        if (existing) {
            throw new common_1.BadRequestException("Attendance already recorded for today");
        }
        const record = this.attendanceRepository.create({
            employeeId: employee.id,
            photoPath,
            checkInTime: new Date(),
        });
        return this.attendanceRepository.save(record);
    }
    async findAll(page = 1, limit = 10) {
        const [data, total] = await this.attendanceRepository.findAndCount({
            order: { checkInTime: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async findByEmployee(employeeId, page = 1, limit = 10) {
        const [data, total] = await this.attendanceRepository.findAndCount({
            where: { employeeId },
            order: { checkInTime: "DESC" },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, total, page, limit };
    }
    async findOne(id) {
        const attendance = await this.attendanceRepository.findOne({ where: { id } });
        if (!attendance)
            throw new common_1.NotFoundException(`Attendance ${id} not found`);
        return attendance;
    }
    async update(id, updateAttendanceDto) {
        const attendance = await this.findOne(id);
        Object.assign(attendance, updateAttendanceDto);
        return this.attendanceRepository.save(attendance);
    }
    async remove(id) {
        const attendance = await this.findOne(id);
        await this.attendanceRepository.remove(attendance);
    }
    async getTodayAttendance(employeeId) {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);
        return this.attendanceRepository.findOne({
            where: { employeeId, checkInTime: (0, typeorm_2.Between)(startOfDay, endOfDay) },
        });
    }
};
exports.AttendanceService = AttendanceService;
exports.AttendanceService = AttendanceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(attendance_entity_1.Attendance)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        axios_1.HttpService,
        config_1.ConfigService])
], AttendanceService);
//# sourceMappingURL=attendance.service.js.map
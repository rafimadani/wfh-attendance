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
exports.AttendanceController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const attendance_service_1 = require("./attendance.service");
const update_attendance_dto_1 = require("./dto/update-attendance.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_role_enum_1 = require("../auth/enums/user-role.enum");
const multer_1 = require("multer");
const path_1 = require("path");
let AttendanceController = class AttendanceController {
    constructor(attendanceService) {
        this.attendanceService = attendanceService;
    }
    async create(photo, req, employeeId) {
        if (!photo)
            throw new common_1.BadRequestException("Photo is required for attendance");
        let empId;
        if (req.user.role === user_role_enum_1.UserRole.EMPLOYEE) {
            empId = req.user.sub;
        }
        else if (req.user.role === user_role_enum_1.UserRole.HR) {
            if (!employeeId)
                throw new common_1.BadRequestException("Employee ID is required for HR");
            empId = Number(employeeId);
        }
        const authHeader = req.headers.authorization;
        return this.attendanceService.create({ employeeId: empId }, photo.path, authHeader);
    }
    findAll(page = 1, limit = 10) {
        return this.attendanceService.findAll(page, limit);
    }
    findByEmployee(employeeId, page = 1, limit = 10) {
        return this.attendanceService.findByEmployee(employeeId, page, limit);
    }
    async getMyAttendance(req, page = 1, limit = 10) {
        return this.attendanceService.findByEmployee(req.user.sub, page, limit);
    }
    async getTodayAttendance(req) {
        return this.attendanceService.getTodayAttendance(req.user.sub);
    }
    findOne(id) {
        return this.attendanceService.findOne(id);
    }
    update(id, updateAttendanceDto) {
        return this.attendanceService.update(id, updateAttendanceDto);
    }
    remove(id) {
        return this.attendanceService.remove(id);
    }
};
exports.AttendanceController = AttendanceController;
__decorate([
    (0, common_1.Post)("submit"),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)("photo", {
        storage: (0, multer_1.diskStorage)({
            destination: "./uploads",
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                cb(null, file.fieldname + "-" + uniqueSuffix + (0, path_1.extname)(file.originalname));
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Query)("employeeId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.HR),
    __param(0, (0, common_1.Query)("page", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("limit", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("employee/:employeeId"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.HR),
    __param(0, (0, common_1.Param)("employeeId", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("page", common_1.ParseIntPipe)),
    __param(2, (0, common_1.Query)("limit", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object, Object]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findByEmployee", null);
__decorate([
    (0, common_1.Get)("my-attendance"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)("page")),
    __param(2, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getMyAttendance", null);
__decorate([
    (0, common_1.Get)("today"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AttendanceController.prototype, "getTodayAttendance", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.HR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.HR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_attendance_dto_1.UpdateAttendanceDto]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.HR),
    __param(0, (0, common_1.Param)("id", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], AttendanceController.prototype, "remove", null);
exports.AttendanceController = AttendanceController = __decorate([
    (0, common_1.Controller)("attendance"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [attendance_service_1.AttendanceService])
], AttendanceController);
//# sourceMappingURL=attendance.controller.js.map
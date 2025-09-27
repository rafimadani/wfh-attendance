"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const axios_1 = require("@nestjs/axios");
const platform_express_1 = require("@nestjs/platform-express");
const attendance_module_1 = require("./attendance/attendance.module");
const auth_module_1 = require("./auth/auth.module");
const attendance_entity_1 = require("./attendance/entities/attendance.entity");
const multer_1 = require("multer");
const path_1 = require("path");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    type: "mysql",
                    host: configService.get("DB_HOST", "localhost"),
                    port: configService.get("DB_PORT", 3306),
                    username: configService.get("DB_USERNAME", "wfh_user"),
                    password: configService.get("DB_PASSWORD", "wfh_password"),
                    database: configService.get("DB_DATABASE", "wfh_attendance"),
                    entities: [attendance_entity_1.Attendance],
                    synchronize: process.env.NODE_ENV !== "production",
                    logging: process.env.NODE_ENV !== "production",
                }),
                inject: [config_1.ConfigService],
            }),
            platform_express_1.MulterModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    storage: (0, multer_1.diskStorage)({
                        destination: configService.get("UPLOAD_PATH", "./uploads"),
                        filename: (req, file, callback) => {
                            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
                            const ext = (0, path_1.extname)(file.originalname);
                            callback(null, `attendance-${uniqueSuffix}${ext}`);
                        },
                    }),
                    fileFilter: (req, file, callback) => {
                        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                            return callback(new Error("Only image files are allowed!"), false);
                        }
                        callback(null, true);
                    },
                    limits: {
                        fileSize: configService.get("MAX_FILE_SIZE", 5 * 1024 * 1024),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            axios_1.HttpModule,
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                useFactory: (configService) => ({
                    secret: configService.get("JWT_SECRET", "your-secret-key"),
                    signOptions: {
                        expiresIn: configService.get("JWT_EXPIRES_IN", "24h"),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            auth_module_1.AuthModule,
            attendance_module_1.AttendanceModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
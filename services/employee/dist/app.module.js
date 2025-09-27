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
const employees_module_1 = require("./employees/employees.module");
const auth_module_1 = require("./auth/auth.module");
const employee_entity_1 = require("./employees/entities/employee.entity");
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
                    entities: [employee_entity_1.Employee],
                    synchronize: process.env.NODE_ENV !== "production",
                    logging: process.env.NODE_ENV !== "production",
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
            employees_module_1.EmployeesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
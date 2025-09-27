import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { HttpModule } from "@nestjs/axios"
import { EmployeesModule } from "./employees/employees.module"
import { AuthModule } from "./auth/auth.module"
import { Employee } from "./employees/entities/employee.entity"

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "mysql",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 3306),
        username: configService.get("DB_USERNAME", "wfh_user"),
        password: configService.get("DB_PASSWORD", "wfh_password"),
        database: configService.get("DB_DATABASE", "wfh_attendance"),
        entities: [Employee],
        synchronize: process.env.NODE_ENV !== "production",
        logging: process.env.NODE_ENV !== "production",
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET", "your-secret-key"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN", "24h"),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    EmployeesModule,
  ],
})
export class AppModule {}

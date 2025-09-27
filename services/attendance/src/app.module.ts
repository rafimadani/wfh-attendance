import { Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { TypeOrmModule } from "@nestjs/typeorm"
import { JwtModule } from "@nestjs/jwt"
import { PassportModule } from "@nestjs/passport"
import { HttpModule } from "@nestjs/axios"
import { MulterModule } from "@nestjs/platform-express"
import { AttendanceModule } from "./attendance/attendance.module"
import { AuthModule } from "./auth/auth.module"
import { Attendance } from "./attendance/entities/attendance.entity"
import { diskStorage } from "multer"
import { extname } from "path"

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
        entities: [Attendance],
        synchronize: process.env.NODE_ENV !== "production",
        logging: process.env.NODE_ENV !== "production",
      }),
      inject: [ConfigService],
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        storage: diskStorage({
          destination: configService.get("UPLOAD_PATH", "./uploads"),
          filename: (req, file, callback) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
            const ext = extname(file.originalname)
            callback(null, `attendance-${uniqueSuffix}${ext}`)
          },
        }),
        fileFilter: (req, file, callback) => {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            return callback(new Error("Only image files are allowed!"), false)
          }
          callback(null, true)
        },
        limits: {
          fileSize: configService.get("MAX_FILE_SIZE", 5 * 1024 * 1024), // 5MB
        },
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
    AttendanceModule,
  ],
})
export class AppModule {}

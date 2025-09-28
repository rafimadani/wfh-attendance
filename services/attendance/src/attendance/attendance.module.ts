// services/attendance/src/attendance/attendance.module.ts
import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Attendance } from "./entities/attendance.entity"
import { AttendanceService } from "./attendance.service"
import { AttendanceController } from "./attendance.controller"
import { HttpModule } from "@nestjs/axios"
import { ConfigModule } from "@nestjs/config"
import { RolesGuard } from "../auth/guards/roles.guard"

@Module({
  imports: [
    TypeOrmModule.forFeature([Attendance]),
    HttpModule,
    ConfigModule,
  ],
  controllers: [AttendanceController],
  providers: [
    AttendanceService,
    RolesGuard,   
  ],
  exports: [AttendanceService],
})
export class AttendanceModule {}

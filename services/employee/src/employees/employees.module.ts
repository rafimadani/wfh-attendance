import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EmployeesService } from "./employees.service"
import { EmployeesController } from "./employees.controller"
import { Employee } from "./entities/employee.entity"
import { AuthModule } from "../auth/auth.module"
import { RolesGuard } from "../auth/guards/roles.guard"

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), AuthModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, RolesGuard],  // ✅ Hapus Reflector
  exports: [EmployeesService],
})
export class EmployeesModule {}

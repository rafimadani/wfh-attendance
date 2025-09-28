import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { EmployeesService } from "./employees.service"
import { EmployeesController } from "./employees.controller"
import { Employee } from "./entities/employee.entity"
import { AuthModule } from "../auth/auth.module"
import { RolesGuard } from "../auth/guards/roles.guard"
import { HttpModule } from "@nestjs/axios"; // 👈 add this


@Module({
  imports: [TypeOrmModule.forFeature([Employee]), AuthModule,HttpModule],
  controllers: [EmployeesController],
  providers: [EmployeesService, RolesGuard],  
  exports: [EmployeesService],
  
})
export class EmployeesModule {}

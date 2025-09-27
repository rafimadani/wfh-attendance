import { Controller, Get, Post, Patch, Param, Delete, UseGuards, ParseIntPipe, Body, Query  } from "@nestjs/common";
import  { EmployeesService } from "./employees.service"
import  { CreateEmployeeDto } from "./dto/create-employee.dto"
import  { UpdateEmployeeDto } from "./dto/update-employee.dto"
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard"
import { RolesGuard } from "../auth/guards/roles.guard"
import { Roles } from "../auth/decorators/roles.decorator"
import { UserRole } from "../auth/enums/user-role.enum"

@Controller("employees")
@UseGuards(JwtAuthGuard)
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  create(@Body() createEmployeeDto: CreateEmployeeDto) {
    return this.employeesService.create(createEmployeeDto);
  }
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  findAll() {
    return this.employeesService.findAll()
  }

  // employees.controller.ts
  @Get("search")
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  search(
    @Query("name") name?: string,
    @Query("position") position?: string,
  ) {
    return this.employeesService.search(name, position);
  }


  // @Get("stats")
  // @UseGuards(RolesGuard)
  // @Roles(UserRole.HR)
  // getStats() {
  //   return this.employeesService.getEmployeeStats()
  // }

  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
  }

  @Get("by-user/:userId")
  findByUserId(@Param("userId", ParseIntPipe) userId: number) {
    return this.employeesService.findByUserId(userId);
  }

  @Patch(":id")
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ) {
    return this.employeesService.update(id, updateEmployeeDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.remove(id);
  }
}

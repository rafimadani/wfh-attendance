import { Controller, Get, Post, Patch, Param, Delete, UseGuards, ParseIntPipe, Body, Req } from "@nestjs/common";
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



  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.employeesService.findOne(id);
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


    @Delete(":id")
    @UseGuards(RolesGuard)
    @Roles(UserRole.HR)
    remove(@Param("id", ParseIntPipe) id: number, @Req() req) {
      return this.employeesService.remove(id, req.headers.authorization); 
    }

  @Post("with-user")
  @UseGuards(RolesGuard)
  @Roles(UserRole.HR) // HR only
  async createWithUser(@Body() body: any, @Req() req) {
    return this.employeesService.createWithUser({
      ...body,
      authHeader: req.headers.authorization, 
    });
  }
}

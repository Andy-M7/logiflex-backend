import { Controller, Get, Post, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Controller('employees')
export class EmployeesController {
  constructor(private srv: EmployeesService) {}

  @Get()
  list(@Query('search') s?: string, @Query('active') a?: string) {
    return this.srv.findAll(s, a);
  }

  @Post()
  create(@Body() dto: CreateEmployeeDto) {
    return this.srv.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEmployeeDto) {
    return this.srv.update(id, dto);
  }

  @Patch(':id/toggle')
  toggle(@Param('id') id: string) {
    return this.srv.toggle(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.srv.remove(id);
  }
}

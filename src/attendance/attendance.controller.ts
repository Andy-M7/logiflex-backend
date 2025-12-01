import { Controller, Post, Get, Body, Query } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post() // Guardar un registro: POST /api/v1/attendance
  register(@Body() dto: CreateAttendanceDto) {
    return this.attendanceService.register(dto);
  }

  @Get() // Obtener registros por fecha: GET /api/v1/attendance?date=2023-10-27
  findByDate(@Query('date') date: string) {
    return this.attendanceService.findByDate(date);
  }
}
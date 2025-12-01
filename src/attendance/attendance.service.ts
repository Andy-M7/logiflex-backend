import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { Employee } from '../employees/entities/employee.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  // Guardar asistencia (Si ya existe registro para ese empleado+fecha, lo actualiza)
  async register(dto: CreateAttendanceDto) {
    const employee = await this.employeeRepo.findOneBy({ id: dto.employeeId });
    if (!employee) throw new Error('Empleado no encontrado');

    // Buscar si ya existe registro hoy
    let record = await this.attendanceRepo.findOne({
      where: { 
        date: dto.date, 
        employee: { id: dto.employeeId } 
      }
    });

    if (record) {
      // Actualizar existente
      record.isPresent = dto.isPresent;
    } else {
      // Crear nuevo
      record = this.attendanceRepo.create({
        date: dto.date,
        isPresent: dto.isPresent,
        employee: employee
      });
    }

    return await this.attendanceRepo.save(record);
  }

  // Obtener asistencia de un día específico
  async findByDate(date: string) {
    return await this.attendanceRepo.find({
      where: { date },
      relations: ['employee']
    });
  }
}
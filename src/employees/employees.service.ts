import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Employee } from './entities/employee.entity';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(@InjectRepository(Employee) private repo: Repository<Employee>) {}

  // ============================================
  // LISTAR EMPLEADOS
  // ============================================
  findAll(search?: string, active?: string) {
    const where: any = {};
    if (search) where.fullName = Like(`%${search}%`);
    if (active === 'true' || active === 'false') {
      where.active = active === 'true';
    }

    return this.repo.find({
      where,
      order: { fullName: 'ASC' },
    });
  }

  // ============================================
  // CREAR EMPLEADO
  // ============================================
  create(dto: CreateEmployeeDto) {
    const employee = this.repo.create(dto);
    return this.repo.save(employee);
  }

  // ============================================
  // ACTUALIZAR EMPLEADO
  // ============================================
  async update(id: string, dto: UpdateEmployeeDto) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException('Empleado no encontrado');

    if (dto.fullName !== undefined) e.fullName = dto.fullName;
    if (dto.role !== undefined) e.role = dto.role;

    // ⭐ ESTE CAMPO ES CORRECTO (antes estaba mal)
    if (dto.active !== undefined) {
      e.active = dto.active;
    }

    return this.repo.save(e);
  }

  // ============================================
  // ACTIVAR / DESACTIVAR (TOGGLE)
  // ============================================
  async toggle(id: string) {
    const e = await this.repo.findOne({ where: { id } });
    if (!e) throw new NotFoundException();

    e.active = !e.active;
    return this.repo.save(e);
  }

  // ============================================
  // ELIMINAR
  // ============================================
  async remove(id: string) {
    await this.repo.delete(id);
    return { ok: true };
  }
}

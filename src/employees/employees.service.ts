import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto'; // <--- Importar
import { Employee } from './entities/employee.entity';

@Injectable()
export class EmployeesService {
  
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      const employee = this.employeeRepo.create(createEmployeeDto);
      await this.employeeRepo.save(employee);
      return employee;
    } catch (error: any) {
      if (error.code === '23505') throw new BadRequestException('Ya existe un empleado con ese DNI');
      throw new InternalServerErrorException('Error al crear empleado');
    }
  }

  async findAll() {
    return await this.employeeRepo.find({
      //where: { isActive: true },
      order: { createdAt: 'DESC' }
    });
  }

  // --- NUEVO: Buscar por ID ---
  async findOne(id: string) {
    const employee = await this.employeeRepo.findOneBy({ id });
    if (!employee) throw new NotFoundException(`Empleado con ID ${id} no encontrado`);
    return employee;
  }

  // --- NUEVO: Editar ---
  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    // preload busca por ID y reemplaza los datos que vengan en el DTO
    const employee = await this.employeeRepo.preload({
      id: id,
      ...updateEmployeeDto
    });

    if (!employee) throw new NotFoundException(`Empleado con ID ${id} no encontrado`);

    try {
      await this.employeeRepo.save(employee);
      return employee;
    } catch (error) {
      throw new BadRequestException('Error al actualizar (posible DNI duplicado)');
    }
  }

  async remove(id: string) {
    const employee = await this.findOne(id); // Reusamos findOne para validar que exista
    employee.isActive = false;
    await this.employeeRepo.save(employee);
    return { message: 'Empleado desactivado correctamente' };
  }
}
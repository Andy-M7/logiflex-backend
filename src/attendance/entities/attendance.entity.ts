import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: string; // Formato YYYY-MM-DD

  @Column({ default: false })
  isPresent: boolean;

  // Relación con Empleado (Muchos registros pertenecen a un empleado)
  @ManyToOne(() => Employee, (employee) => employee.id, { eager: true })
  employee: Employee;

  @CreateDateColumn()
  createdAt: Date;
}
// src/attendance/entities/attendance.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Employee } from '../../employees/entities/employee.entity';

@Entity('attendance')
export class Attendance {
  @PrimaryGeneratedColumn('uuid') id: string;

  @ManyToOne(() => Employee) employee: Employee;

  @Column({ type: 'date' }) date: string;      // YYYY-MM-DD
  @Column({ default: true }) present: boolean;
}

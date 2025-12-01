import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  fullName: string; // "Nombre" en tu diseño

  @Column('text', { unique: true })
  dni: string;      // "DNI" en tu diseño

  @Column('text')
  role: string;     // "Rol" (Lider, Auxiliar, Supervisor)

  @Column('bool', { default: true })
  isActive: boolean; // "Estado" (Activo/Inactivo)

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
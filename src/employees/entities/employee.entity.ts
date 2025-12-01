import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true }) dni: string;
  @Column() fullName: string;
  @Column({ default: 'Auxiliar' }) role: string;
  @Column({ default: true }) active: boolean;

  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}

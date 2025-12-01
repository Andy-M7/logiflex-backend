import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  firebaseUUID: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { nullable: true })
  password: string;

  @Column('text')
  fullName: string;

  // --- NUEVAS COLUMNAS NECESARIAS ---
  
  @Column('bool', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ----------------------------------

  @ManyToOne(() => Company, (company) => company.users, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}
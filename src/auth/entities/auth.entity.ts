import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  firebaseUUID: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text')
  fullName: string;

  @ManyToOne(() => Company, (company) => company.users, { eager: true })
  @JoinColumn({ name: 'company_id' })
  company: Company;
}

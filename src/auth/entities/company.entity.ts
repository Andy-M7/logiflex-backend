import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './auth.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  name: string;

  @Column('text')
  industry: string;

  @Column('boolean', { default: true })
  active: boolean;

  @OneToMany(() => User, (user) => user.company)
  users: User[];
}

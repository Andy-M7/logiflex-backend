// src/packing/entities/packing-list.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('packing_list')
export class PackingList {
  @PrimaryGeneratedColumn('uuid') id: string;

  @Column({ unique: true }) code: string;   // 40802
  @Column() clientRef: string;              // 10266-7-30

  @CreateDateColumn() createdAt: Date;
}

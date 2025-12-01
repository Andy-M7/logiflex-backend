import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ nullable: true })
  lote?: string;

  @Column({ default: true })
  active: boolean;  // 👈 Necesario para toggle

  @Column({ nullable: true })
  imageUrl?: string; // si después manejas imágenes
}

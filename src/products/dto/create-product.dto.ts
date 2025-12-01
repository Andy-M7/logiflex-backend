import { IsString, IsOptional } from 'class-validator';

export class CreateProductDto {
  @IsString()
  nombre: string;

  @IsOptional()
  @IsString()
  lote?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}

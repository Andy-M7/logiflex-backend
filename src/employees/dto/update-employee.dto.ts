import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateEmployeeDto {

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  active: boolean;  // ✔️ COINCIDE CON LA ENTITY
}

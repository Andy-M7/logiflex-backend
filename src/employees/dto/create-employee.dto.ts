import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class CreateEmployeeDto {

  @IsString()
  dni: string;

  @IsString()
  fullName: string;

  @IsString()
  role: string;

  @IsBoolean()
  active: boolean;   // ✔️ COINCIDE CON LA ENTITY
}

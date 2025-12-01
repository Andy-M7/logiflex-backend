import { IsString, IsNotEmpty, MinLength, IsIn, IsBoolean, IsOptional } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  dni: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  fullName: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['Lider', 'Auxiliar', 'Supervisor'], {
    message: 'El rol debe ser Lider, Auxiliar o Supervisor',
  })
  role: string;

  @IsBoolean()
  @IsOptional() // Es opcional porque si no lo envías, asumiremos true
  isActive?: boolean;
}
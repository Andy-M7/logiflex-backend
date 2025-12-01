import { IsEmail, IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateUserDto {

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  name?: string;  // ← ahora soporta nombre real

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  role?: string; // ← NO UserRole (prohibido en DTO decorado)

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

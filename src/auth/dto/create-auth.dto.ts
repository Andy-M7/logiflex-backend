import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateAuthDto {
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  fullName: string;
}
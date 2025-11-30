import { IsString } from 'class-validator';

export class VerifyAuthDto {
  @IsString()
  token: string;
}

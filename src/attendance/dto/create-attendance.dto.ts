import { IsBoolean, IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateAttendanceDto {
  @IsNotEmpty()
  @IsUUID()
  employeeId: string;

  @IsNotEmpty()
  @IsDateString()
  date: string; // YYYY-MM-DD

  @IsBoolean()
  isPresent: boolean;
}
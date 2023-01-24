import { IsNotEmpty, IsOptional } from 'class-validator';

export class SessionDto {
  @IsNotEmpty()
  startTime: Date;

  @IsOptional()
  endTime: Date;

  @IsNotEmpty()
  infected: boolean;

  @IsOptional()
  note: string;

  @IsNotEmpty()
  userId: string;
}

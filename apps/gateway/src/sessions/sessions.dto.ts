import { IsNotEmpty, IsOptional } from 'class-validator';

export class SessionDto {
  @IsOptional()
  startTime: Date;

  @IsOptional()
  endTime: Date;

  @IsOptional()
  infected: boolean;

  @IsOptional()
  note: string;

  @IsOptional()
  createdQrCode: Date;

  @IsNotEmpty()
  roomId: boolean;

  @IsOptional()
  userId: string;
}

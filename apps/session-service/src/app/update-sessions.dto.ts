import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateSessionDto {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  startTime: Date;

  @IsOptional()
  endTime: Date;

  @IsNotEmpty()
  infected: boolean;

  @IsOptional()
  note: string;
}

import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';
import { Risk } from './risk.enum';

export class CurrenStatusDto {
  @IsNotEmpty()
  numberOfEncounters: number;

  @IsOptional()
  lastEncounter?: Date;

  @IsEnum(Risk)
  risk: Risk;

  @IsNotEmpty()
  updatedAt: Date;
}

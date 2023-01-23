import { IsEnum, IsNotEmpty, Max, Min } from 'class-validator';
import { Faculty } from './faculty.enum';

export class RoomDto {
  @IsNotEmpty()
  name: string;

  @Min(1)
  @Max(60)
  maxParticipants: number;

  @Min(1)
  maxDuration: number;

  @IsEnum(Faculty)
  faculty?: Faculty;
}

export interface findAllQuery {
  name?: string;
  faculty?: Faculty;
}

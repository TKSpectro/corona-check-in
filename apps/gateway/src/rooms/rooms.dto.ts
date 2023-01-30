import { IsEnum, IsNotEmpty, Max, Min } from 'class-validator';

export enum Faculty {
  AI = 'AI',
  SA = 'SA',
}

export class RoomDto {
  @IsNotEmpty()
  name: string;

  @Min(1)
  @Max(200)
  maxParticipants: number;

  @Min(1)
  maxDuration: number;

  @IsEnum(Faculty)
  faculty: Faculty;
}

export interface findAllQuery {
  name?: string;
  faculty?: Faculty;
}

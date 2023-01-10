import { IsEnum, IsNotEmpty, Max, Min } from 'class-validator';

export enum Faculty {
  AI = 'Angewandte Informatik',
  SA = 'Soziale Arbeit',
}

export class RoomDto {
  @IsNotEmpty()
  name: string;

  @Min(1)
  @Max(60)
  maxParticipants: number;

  @Min(1)
  maxDuration: number;

  @IsEnum(Faculty)
  faculty: Faculty;
}

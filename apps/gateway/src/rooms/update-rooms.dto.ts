import { RoomDto } from './rooms.dto';
import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateRoomDto extends PartialType(RoomDto) {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsOptional()
  createdQrCode: Date;
}

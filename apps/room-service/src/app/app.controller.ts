import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RoomEntity } from './room.entity';
import { RoomDto } from '../../../gateway/src/rooms/rooms.dto';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateRoomDto } from '../../../gateway/src/rooms/update-rooms.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'rooms', cmd: 'getRooms' })
  getRooms({
    page,
    limit,
  }: {
    page: number;
    limit: number;
  }): Promise<RoomEntity[]> {
    return this.appService.getRooms(page, limit);
  }

  @MessagePattern({ role: 'room', cmd: 'getRoom' })
  getRoom(id: string): Promise<RoomEntity> {
    return this.appService.getRoom(id);
  }

  @MessagePattern({ role: 'room', cmd: 'createRoom' })
  createRoom(createRoomDto: RoomDto): Promise<RoomEntity> {
    return this.appService.createRoom(createRoomDto);
  }

  @MessagePattern({ role: 'room', cmd: 'updateRoom' })
  updateRoom(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    return this.appService.updateRoom(updateRoomDto);
  }

  @MessagePattern({ role: 'room', cmd: 'deleteRoom' })
  deleteRoom(id: string): Promise<boolean> {
    return this.appService.deleteRoom(id);
  }
}

import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import { MessagePattern } from '@nestjs/microservices';
import { RoomEntity } from './room.entity';
import { UpdateRoomDto } from './update-rooms.dto';
import { RoomDto } from './rooms.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'rooms', cmd: 'getRooms' })
  getRooms({
    page,
    limit,
    roomFilter,
  }: {
    page: number;
    limit: number;
    roomFilter?: string;
  }): Promise<RoomEntity[]> {
    return this.appService.getRooms(page, limit, roomFilter);
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

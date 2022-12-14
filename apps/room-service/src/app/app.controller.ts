import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { RoomEntity } from './room.entity';
import { RoomDto } from './rooms.dto';
import { UpdateRoomDto } from './update-rooms.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'rooms', cmd: 'getRooms' })
  getRooms({
    pageOptionsDto,
    roomFilter,
  }: {
    pageOptionsDto: PageOptionsDto;
    roomFilter?: string;
  }) {
    return this.appService.getRooms(pageOptionsDto, roomFilter);
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

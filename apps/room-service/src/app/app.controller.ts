import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { RoomEntity } from './room.entity';
import { findAllQuery, RoomDto } from './rooms.dto';
import { UpdateRoomDto } from './update-rooms.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'room', cmd: 'health' })
  health() {
    return true;
  }

  @MessagePattern({ role: 'room', cmd: 'get-all' })
  getRooms({
    pageOptionsDto,
    query,
  }: {
    pageOptionsDto: PageOptionsDto;
    query?: findAllQuery;
  }) {
    return this.appService.getRooms(pageOptionsDto, query);
  }

  @MessagePattern({ role: 'room', cmd: 'get-by-id' })
  getRoom(id: string): Promise<RoomEntity> {
    return this.appService.getRoom(id);
  }

  @MessagePattern({ role: 'room', cmd: 'create' })
  createRoom(createRoomDto: RoomDto): Promise<RoomEntity> {
    return this.appService.createRoom(createRoomDto);
  }

  @MessagePattern({ role: 'room', cmd: 'update' })
  updateRoom(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    return this.appService.updateRoom(updateRoomDto);
  }

  @MessagePattern({ role: 'room', cmd: 'update-qr-code' })
  updateQrCode(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    return this.appService.updateQrCode(updateRoomDto);
  }

  @MessagePattern({ role: 'room', cmd: 'delete' })
  deleteRoom(id: string): Promise<boolean> {
    return this.appService.deleteRoom(id);
  }
}

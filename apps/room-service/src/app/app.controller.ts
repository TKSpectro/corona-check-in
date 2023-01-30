import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
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
  async getRooms({
    pageOptionsDto,
    query,
  }: {
    pageOptionsDto: PageOptionsDto;
    query?: findAllQuery;
  }) {
    return this.appService.getRooms(pageOptionsDto, query);
  }

  @MessagePattern({ role: 'room', cmd: 'get-by-id' })
  async getRoom(id: string) {
    return this.appService.getRoom(id);
  }

  @MessagePattern({ role: 'room', cmd: 'create' })
  async createRoom(createRoomDto: RoomDto) {
    return this.appService.createRoom(createRoomDto);
  }

  @MessagePattern({ role: 'room', cmd: 'update' })
  async updateRoom(updateRoomDto: UpdateRoomDto) {
    return this.appService.updateRoom(updateRoomDto);
  }

  @MessagePattern({ role: 'room', cmd: 'update-qr-code' })
  async updateQrCode(updateRoomDto: UpdateRoomDto) {
    return this.appService.updateQrCode(updateRoomDto);
  }

  @MessagePattern({ role: 'room', cmd: 'delete' })
  async deleteRoom(id: string) {
    return this.appService.deleteRoom(id);
  }
}

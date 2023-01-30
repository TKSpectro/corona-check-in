import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { environment } from '../environments/environment';
import { RoomEntity } from './room.entity';
import { findAllQuery, RoomDto } from './rooms.dto';
import { UpdateRoomDto } from './update-rooms.dto';

@Injectable()
export class RoomsService {
  constructor(@Inject('rooms-service') private roomClient: ClientProxy) {}

  async getRooms(pageOptionsDto: PageOptionsDto, query: findAllQuery) {
    return lastValueFrom(
      this.roomClient
        .send<RoomEntity>(
          { role: 'room', cmd: 'get-all' },
          { pageOptionsDto, query }
        )
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async getRoom(id: string) {
    return lastValueFrom(
      this.roomClient
        .send<RoomEntity>({ role: 'room', cmd: 'get-by-id' }, id)
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async createRoom(createRoomDto: RoomDto) {
    return lastValueFrom(
      this.roomClient
        .send<RoomEntity>({ role: 'room', cmd: 'create' }, createRoomDto)
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async update(updateRoomDto: UpdateRoomDto) {
    return lastValueFrom(
      this.roomClient
        .send<RoomEntity>({ role: 'room', cmd: 'update' }, updateRoomDto)
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async updateQrCode(updateRoomDto: UpdateRoomDto) {
    return lastValueFrom(
      this.roomClient
        .send<RoomEntity>(
          { role: 'room', cmd: 'update-qr-code' },
          updateRoomDto
        )
        .pipe(timeout(environment.serviceTimeout))
    );
  }

  async removeRoom(id: string) {
    return lastValueFrom(
      this.roomClient
        .send({ role: 'room', cmd: 'delete' }, id)
        .pipe(timeout(environment.serviceTimeout))
    );
  }
}

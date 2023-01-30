import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable, timeout } from 'rxjs';
import { environment } from '../environments/environment';
import { RoomEntity } from './room.entity';
import { findAllQuery, RoomDto } from './rooms.dto';
import { UpdateRoomDto } from './update-rooms.dto';

@Injectable()
export class RoomsService {
  constructor(@Inject('rooms-service') private roomClient: ClientProxy) {}

  getRooms(
    pageOptionsDto: PageOptionsDto,
    query: findAllQuery
  ): Observable<RoomEntity> {
    return this.roomClient
      .send<RoomEntity>(
        { role: 'rooms', cmd: 'getRooms' },
        { pageOptionsDto, query }
      )
      .pipe(timeout(environment.serviceTimeout));
  }

  getRoom(id: string): Observable<RoomEntity> {
    return this.roomClient
      .send<RoomEntity>({ role: 'room', cmd: 'getRoom' }, id)
      .pipe(timeout(environment.serviceTimeout));
  }

  createRoom(createRoomDto: RoomDto) {
    return this.roomClient
      .send<RoomEntity>({ role: 'room', cmd: 'createRoom' }, createRoomDto)
      .pipe(timeout(environment.serviceTimeout));
  }

  update(updateRoomDto: UpdateRoomDto) {
    return this.roomClient
      .send<RoomEntity>({ role: 'room', cmd: 'updateRoom' }, updateRoomDto)
      .pipe(timeout(environment.serviceTimeout));
  }

  updateQrCode(updateRoomDto: UpdateRoomDto) {
    return this.roomClient
      .send<RoomEntity>({ role: 'room', cmd: 'updateQrCode' }, updateRoomDto)
      .pipe(timeout(environment.serviceTimeout));
  }

  removeRoom(id: string): Observable<RoomEntity> {
    return this.roomClient
      .send({ role: 'room', cmd: 'deleteRoom' }, id)
      .pipe(timeout(environment.serviceTimeout));
  }
}

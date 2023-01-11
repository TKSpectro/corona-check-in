import { PageOptionsDto } from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { RoomEntity } from './room.entity';
import { RoomDto } from './rooms.dto';
import { UpdateRoomDto } from './update-rooms.dto';

@Injectable()
export class RoomsService {
  constructor(@Inject('rooms-service') private roomClient: ClientProxy) {}

  getRooms(
    pageOptionsDto: PageOptionsDto,
    roomFilter: string
  ): Observable<RoomEntity> {
    return this.roomClient.send<RoomEntity>(
      { role: 'rooms', cmd: 'getRooms' },
      { pageOptionsDto, roomFilter }
    );
  }

  getRoom(id: string): Observable<RoomEntity> {
    return this.roomClient.send<RoomEntity>(
      { role: 'room', cmd: 'getRoom' },
      id
    );
  }

  createRoom(createRoomDto: RoomDto) {
    return this.roomClient.send<RoomEntity>(
      { role: 'room', cmd: 'createRoom' },
      createRoomDto
    );
  }

  update(updateRoomDto: UpdateRoomDto) {
    return this.roomClient.send<RoomEntity>(
      { role: 'room', cmd: 'updateRoom' },
      updateRoomDto
    );
  }

  removeRoom(id: string): Observable<RoomEntity> {
    return this.roomClient.send({ role: 'room', cmd: 'deleteRoom' }, id);
  }
}

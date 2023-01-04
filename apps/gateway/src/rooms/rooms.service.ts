import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RoomEntity } from '../../../room-service/src/app/room.entity';

@Injectable()
export class RoomsService {
  constructor(@Inject('rooms-service') private roomClient: ClientProxy) {}

  // create(createRoomDto: CreateRoomDto) {
  //   return 'This action adds a new room';
  // }

  getRooms() {
    return this.roomClient.send<RoomEntity>(
      { role: 'rooms', cmd: 'getAll' },
      {}
    );
  }

  getRoom(id: string) {
    return this.roomClient.send<RoomEntity>(
      { role: 'room', cmd: 'getOne' },
      id
    );
  }

  // update(id: number, updateRoomDto: UpdateRoomDto) {
  //   return `This action updates a #${id} room`;
  // }

  remove(id: number) {
    return `This action removes a #${id} room`;
  }
}

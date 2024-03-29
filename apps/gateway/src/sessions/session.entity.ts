import { RoomDto } from '../rooms/rooms.dto';

export class SessionEntity {
  id: string;

  createdAt: Date;

  updatedAt: Date;

  startTime: Date;

  endTime: Date;

  infected: boolean;

  note: string;

  userId: string;

  roomId: string;

  room?: RoomDto;
}

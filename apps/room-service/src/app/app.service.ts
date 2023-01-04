import { Injectable } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoomEntity } from './room.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>
  ) {}

  async onModuleInit() {
    if (
      !(await this.roomRepository.findOne({
        where: { name: 'room-session-1' },
      }))
    ) {
      await this.roomRepository.insert({
        id: '00000000-0000-0000-0002-000000000001',
        name: 'room-session-1',
      });
    }

    if (
      !(await this.roomRepository.findOne({
        where: { name: 'room-session-2' },
      }))
    ) {
      await this.roomRepository.insert({
        id: '00000000-0000-0000-0002-000000000002',
        name: 'room-session-2',
      });
    }
  }

  @MessagePattern({ role: 'rooms', cmd: 'getAll' })
  getRooms() {
    return this.roomRepository.find();
  }
}

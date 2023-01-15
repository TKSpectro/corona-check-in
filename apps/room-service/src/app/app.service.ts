import {
  findWithMeta,
  PageOptionsDto,
} from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { lastValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { Faculty } from './faculty.enum';
import { RoomEntity } from './room.entity';
import { RoomDto } from './rooms.dto';
import { UpdateRoomDto } from './update-rooms.dto';

interface qrCodeData {
  qrCode: Uint8Array;
  generatedAt: Date;
}

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(RoomEntity)
    private readonly roomRepository: Repository<RoomEntity>,
    @Inject('qr-code-service') private qrCodeSrv: ClientProxy
  ) {}

  async onModuleInit() {
    for (let i = 0; i < 25; ++i) {
      if (
        !(await this.roomRepository.findOne({
          where: {
            id: `00000000-0000-0000-0002-0000000000${i < 10 ? 0 : ''}${i}`,
          },
        }))
      ) {
        await this.roomRepository.insert({
          id: `00000000-0000-0000-0002-0000000000${i < 10 ? 0 : ''}${i}`,
          name: `room-session-${i}`,
          maxDuration: randomInt(30, 240),
          maxParticipants: randomInt(10, 100),
          qrCode: null,
          createdQrCode: new Date(),
        });
      }
    }
  }

  async getRooms(pageOptionsDto: PageOptionsDto, roomFilter?: string) {
    const queryBuilder = this.roomRepository.createQueryBuilder();
    let isFaculty: boolean;
    for (const key in Faculty) {
      if (Faculty[key] === roomFilter) {
        queryBuilder.andWhere('faculty = :faculty', { faculty: Faculty[key] });
        isFaculty = true;
      }
    }
    if (!isFaculty && roomFilter) {
      queryBuilder.andWhere('name like :name', { name: `%${roomFilter}%` });
    }

    return findWithMeta(queryBuilder, pageOptionsDto);
  }

  async getRoom(id: string): Promise<RoomEntity> {
    return await this.roomRepository.findOne({ where: { id } });
  }

  async createRoom(createRoomDto: RoomDto): Promise<RoomEntity> {
    const room: RoomEntity = await this.roomRepository.save(createRoomDto);
    if (room) {
      const qrCode = await lastValueFrom(
        this.qrCodeSrv.send<qrCodeData>(
          { role: 'qr-code', cmd: 'generate' },
          {
            roomId: room.id,
          }
        )
      );
      room.qrCode = qrCode.qrCode;
      room.createdQrCode = qrCode.generatedAt;
    }
    await this.roomRepository.update(room.id, room);
    room.qrCode = null;
    return room;
  }

  async updateRoom(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    const newCode = await lastValueFrom(
      this.qrCodeSrv.send<qrCodeData>(
        { role: 'qr-code', cmd: 'generate' },
        {
          roomId: updateRoomDto.id,
        }
      )
    );
    const updateRoom = await this.roomRepository.findOne({
      where: { id: updateRoomDto.id },
    });
    updateRoom.qrCode = newCode.qrCode;
    updateRoom.createdQrCode = newCode.generatedAt;
    const room = await this.roomRepository.save(
      this.roomRepository.merge(updateRoom, updateRoomDto)
    );
    room.qrCode = null;
    return room;
  }

  async updateQrCode(updateRoomDto: UpdateRoomDto): Promise<RoomEntity> {
    const updateRoom = await this.roomRepository.findOne({
      where: { id: updateRoomDto.id },
    });
    updateRoom.createdQrCode = updateRoomDto.createdQrCode;
    const room = await this.roomRepository.save(
      this.roomRepository.merge(updateRoom, updateRoomDto)
    );
    room.qrCode = null;
    return room;
  }

  async deleteRoom(id: string): Promise<boolean> {
    return (await this.roomRepository.delete(id)).affected > 0;
  }
}

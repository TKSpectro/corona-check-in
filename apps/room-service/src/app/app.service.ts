import {
  findWithMeta,
  Order,
  PageOptionsDto,
} from '@corona-check-in/micro-service-shared';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { randomInt } from 'crypto';
import { lastValueFrom, timeout } from 'rxjs';
import { Repository } from 'typeorm';
import { environment } from '../environments/environment';
import { Faculty } from './faculty.enum';
import { RoomEntity } from './room.entity';
import { findAllQuery, RoomDto } from './rooms.dto';
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
    if (environment.seedEnabled === true) {
      console.info('[ROOM] Seeding rooms...');
      await this.#seed();
    } else {
      console.info('[ROOM] Seeding disabled.');
    }
  }

  async getRooms(pageOptionsDto: PageOptionsDto, query: findAllQuery = {}) {
    const queryBuilder = this.roomRepository.createQueryBuilder();

    if (query.name) {
      queryBuilder.andWhere('name like :name', { name: `%${query.name}%` });
    }

    if (query.faculty) {
      queryBuilder.andWhere('faculty = :faculty', { faculty: query.faculty });
    }
    pageOptionsDto.order = Order.DESC;
    return findWithMeta(queryBuilder, pageOptionsDto, 'updated_at');
  }

  async getRoom(id: string): Promise<RoomEntity> {
    return await this.roomRepository.findOne({ where: { id } });
  }

  async createRoom(createRoomDto: RoomDto): Promise<RoomEntity> {
    const room: RoomEntity = await this.roomRepository.save(createRoomDto);
    if (room) {
      const qrCode = await lastValueFrom(
        this.qrCodeSrv
          .send<qrCodeData>(
            { role: 'qr-code', cmd: 'generate' },
            {
              roomId: room.id,
            }
          )
          .pipe(timeout(environment.serviceTimeout))
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
      this.qrCodeSrv
        .send<qrCodeData>(
          { role: 'qr-code', cmd: 'generate' },
          {
            roomId: updateRoomDto.id,
          }
        )
        .pipe(timeout(environment.serviceTimeout))
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

  async #seed() {
    for (let i = 0; i < 25; ++i) {
      if (
        !(await this.roomRepository.findOne({
          where: {
            id: `00000000-0000-0000-0000-0000000000${i < 10 ? 0 : ''}${i}`,
          },
        }))
      ) {
        await this.roomRepository.insert({
          id: `00000000-0000-0000-0000-0000000000${i < 10 ? 0 : ''}${i}`,
          name: `room-${i}`,
          maxDuration: randomInt(30, 240),
          maxParticipants: randomInt(10, 100),
          qrCode: null,
          createdQrCode: new Date(),
          faculty: i % 2 === 0 ? Faculty.AI : Faculty.SA,
        });
      }
    }
  }
}

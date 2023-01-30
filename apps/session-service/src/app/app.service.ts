import {
  findWithMeta,
  PageOptionsDto,
  RequestUser,
  UserEntity,
  UserRole,
} from '@corona-check-in/micro-service-shared';
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { environment } from '../environments/environment';
import { SessionEntity } from './session.entity';
import { SessionDto } from './sessions.dto';
import { UpdateSessionDto } from './update-sessions.dto';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';

const selectWithoutNote = [
  'session.id',
  'session.createdAt',
  'session.updatedAt',
  'session.startTime',
  'session.endTime',
  'session.infected',
  'session.userId',
  // TODO: Add this back in when we have a room service
  // 'session.roomId',
];

// This is some really hacky code to work around the weird select behavior of typeorm
// If you use the queryBuilder.select() method, it will add the table name to the select key
// And for .find() it will need an object with everything set to true (setting it to false will just do nothing)
const selectWithoutNoteObj = selectWithoutNote.reduce(
  (a, v) => ({ ...a, [v.replace('session.', '')]: true }),
  {}
);

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @Inject('room-service') private roomSrv: ClientProxy
  ) {}

  async onModuleInit() {
    if (environment.seedEnabled === true) {
      console.info('[SESSION] Seeding sessions...');
      await this.#seed();
    } else {
      console.info('[SESSION] Seeding disabled.');
    }
  }

  getSessions(
    pageOptionsDto: PageOptionsDto,
    user: RequestUser,
    infected?: string,
    sessionBegin?: Date,
    sessionEnd?: Date
  ) {
    const queryBuilder = this.sessionRepository.createQueryBuilder('session');

    // This is kinda hacky, infected will be a string even if it's typed as a boolean
    if (infected === 'true' || infected === 'false') {
      queryBuilder.andWhere('infected = :infected', { infected });
    }
    if (sessionBegin) {
      queryBuilder.andWhere('startTime >= :sessionBegin', { sessionBegin });
    }
    if (sessionEnd) {
      queryBuilder.andWhere('endTime <= :sessionEnd', { sessionEnd });
    }

    if (user.role === UserRole.USER) {
      queryBuilder.andWhere('userId = :userId', { userId: user.sub });
    }
    if (user.role === UserRole.ADMIN) {
      queryBuilder.select(selectWithoutNote);
    }

    return findWithMeta(queryBuilder, pageOptionsDto);
  }

  async getSessionById(id: string, user: RequestUser) {
    return this.sessionRepository.findOne({
      select: { ...selectWithoutNoteObj, note: user.role !== UserRole.ADMIN },
      where: {
        id: id,
        userId: user.role === UserRole.USER ? user.sub : undefined,
      },
    });
  }

  async createSession(createSessionDto: SessionDto): Promise<SessionEntity> {
    return await this.sessionRepository.save(createSessionDto);
  }

  async createSessionFromQrCode(
    createSessionDto: SessionDto
  ): Promise<SessionEntity> {
    const room = await lastValueFrom(
      this.roomSrv
        .send({ role: 'room', cmd: 'getRoom' }, createSessionDto.roomId)
        .pipe(timeout(5000))
    );
    if (!room) {
      throw new HttpException('Room not found', HttpStatus.BAD_REQUEST);
    }
    if (room.createdQrCode !== createSessionDto.createdQrCode) {
      throw new HttpException('QrCode must be updated', HttpStatus.BAD_REQUEST);
    }

    let startTime = new Date();
    startTime = new Date(startTime.setDate(startTime.getDate() - 5));

    const sessions = await this.sessionRepository.find({
      where: {
        roomId: createSessionDto.roomId,
        userId: createSessionDto.userId,
        startTime: MoreThan(startTime),
      },
    });
    if (sessions.length <= 0) {
      // User has no session in this room, so he scanned to enter
      return await this.sessionRepository.save(createSessionDto);
    }
    for (const session of sessions) {
      const maxEndTime = new Date(
        session.startTime.getTime() + room.maxDuration * 60000
      );
      if (maxEndTime <= new Date()) {
        // Session is an old session which the user did not close
        session.endTime = maxEndTime;
      } else {
        // Session is the current session and the user scanned to leave
        session.endTime = new Date();
      }
      await this.updateSession(session);
      if (session.infected) {
        throw new HttpException(
          'User is infected and not allowed to enter the room.',
          HttpStatus.BAD_REQUEST
        );
      }
    }
    return await this.sessionRepository.save(createSessionDto);
  }

  async updateSession(
    updateSessionDto: UpdateSessionDto
  ): Promise<SessionEntity> {
    const updateSession = await this.sessionRepository.findOne({
      where: { id: updateSessionDto.id },
    });

    return await this.sessionRepository.save(
      this.sessionRepository.merge(updateSession, updateSessionDto)
    );
  }

  async #seed() {
    for (let i = 1; i < 26; i++) {
      if (
        !(await this.sessionRepository.findOne({
          where: [
            { id: `00000000-0000-0000-0002-0000000000${i < 10 ? 0 : ''}${i}` },
          ],
        }))
      ) {
        try {
          await this.sessionRepository.insert({
            id: `00000000-0000-0000-0002-0000000000${i < 10 ? 0 : ''}${i}`,
            endTime:
              i % 2 === 0 ? `2022-12-${i < 10 ? '0' : ''}${i}T09:30:00` : null,
            infected: i % 2 === 0,
            userId: '00000000-0000-0000-0000-000000000002',
            roomId: '00000000-0000-0000-0000-000000000000',
          });
        } catch (error) {
          // do nothing
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  }

  async deleteSession(id: string): Promise<boolean> {
    return (await this.sessionRepository.delete(id)).affected > 0;
  }
}

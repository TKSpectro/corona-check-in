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
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';
import { lastValueFrom, timeout } from 'rxjs';
import { MoreThan, Repository } from 'typeorm';
import { resourceLimits } from 'worker_threads';
import { environment } from '../environments/environment';
import { CurrenStatusDto } from './current-status.dto';
import { Risk } from './risk.enum';
import { SessionEntity } from './session.entity';
import { SessionDto } from './sessions.dto';
import { UpdateSessionDto } from './update-sessions.dto';

const selectWithoutNote = [
  'session.id',
  'session.createdAt',
  'session.updatedAt',
  'session.startTime',
  'session.endTime',
  'session.infected',
  'session.userId',
  'session.roomId',
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
      if (environment.seedMassRandom === true) {
        await this.#massRandomSeed();
      }

      await this.#seed();
    } else {
      console.info('[SESSION] Seeding disabled.');
    }
  }

  async getSessions(
    pageOptionsDto: PageOptionsDto,
    user: RequestUser,
    infected?: string,
    sessionBegin?: Date,
    sessionEnd?: Date,
    roomId?: string
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
    if (roomId) {
      queryBuilder.andWhere('roomId = :roomId', { roomId });
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
    const session = await this.sessionRepository.findOne({
      select: { ...selectWithoutNoteObj, note: user.role !== UserRole.ADMIN },
      where: {
        id: id,
        userId: user.role === UserRole.USER ? user.sub : undefined,
      },
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return session;
  }

  async getCurrentSession(user: RequestUser) {
    const session = await this.sessionRepository.findOne({
      select: { ...selectWithoutNoteObj, note: user.role !== UserRole.ADMIN },
      where: { userId: user.sub },
      order: { startTime: 'DESC' },
    });

    const room = await lastValueFrom(
      this.roomSrv
        .send({ role: 'room', cmd: 'get-by-id' }, session.roomId)
        .pipe(timeout(environment.serviceTimeout))
    );
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    session.room = room;

    return session;
  }

  async createSession(createSessionDto: SessionDto): Promise<SessionEntity> {
    return this.sessionRepository.save(createSessionDto);
  }

  async createSessionFromQrCode(
    createSessionDto: SessionDto
  ): Promise<SessionEntity> {
    const room = await lastValueFrom(
      this.roomSrv
        .send({ role: 'room', cmd: 'get-by-id' }, createSessionDto.roomId)
        .pipe(timeout(environment.serviceTimeout))
    );
    if (!room) {
      throw new NotFoundException('Room not found');
    }

    if (
      new Date(room.createdQrCode).toISOString() !==
      new Date(createSessionDto.createdQrCode).toISOString()
    ) {
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
      return this.sessionRepository.save(createSessionDto);
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
    return this.sessionRepository.save(createSessionDto);
  }

  async markLastSessionsAsInfected(user: RequestUser): Promise<HttpStatus> {
    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 5);

    const queryBuilder = await this.sessionRepository
      .createQueryBuilder()
      .update()
      .set({ infected: true })
      .where('userId = :userId', { userId: user.sub })
      .andWhere('startTime >= :lastDay', { lastDay })
      .execute();

    if (queryBuilder) {
      return HttpStatus.OK;
    } else {
      throw new HttpException(
        'Error while trying to update infection status',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async updateSession(
    updateSessionDto: UpdateSessionDto
  ): Promise<SessionEntity> {
    const updateSession = await this.sessionRepository.findOne({
      where: { id: updateSessionDto.id },
    });
    if (!updateSession) {
      throw new NotFoundException('Session not found');
    }

    return this.sessionRepository.save(
      this.sessionRepository.merge(updateSession, updateSessionDto)
    );
  }

  async deleteSession(id: string) {
    const session = await this.sessionRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    return await this.sessionRepository.remove(session);
  }

  async getCurrentStatus(user: RequestUser) {
    const lastDay = new Date();
    lastDay.setDate(lastDay.getDate() - 5);

    const encounters = await this.sessionRepository
      .createQueryBuilder('s1')
      .select('COUNT(*)', 'count')
      .addSelect('MAX(s1.endtime)', 'max_endtime')
      .innerJoin(SessionEntity, 's2', 's2.roomid = s1.roomid')
      .where('s1.userid = :userid', { userid: user.sub })
      .andWhere('s2.userid <> s1.userid')
      .andWhere(
        '(s1.starttime, s1.endtime) OVERLAPS (s2.starttime, s2.endtime)'
      )
      .andWhere('s2.infected = true')
      .andWhere('s1.starttime >= :date', { date: lastDay })
      .getRawOne();

    const infection = await this.sessionRepository
      .createQueryBuilder()
      .select('infected')
      .where('userId = :userId', { userId: user.sub })
      .orderBy('endtime', 'DESC')
      .limit(1)
      .getRawOne();

    console.log(encounters);
    const result = new CurrenStatusDto();
    result.numberOfEncounters = encounters.count;
    result.updatedAt = new Date();

    if (infection.infected == true) {
      result.risk = Risk.HIGH;
    } else {
      if (encounters.count > 0) {
        result.risk = Risk.MEDIUM;
      } else {
        result.risk = Risk.LOW;
      }
    }

    // remove time from the last encounter and return only the date for privacy
    if (encounters.max_endtime !== null) {
      result.lastEncounter = new Date(
        encounters.max_endtime.setHours(0, 0, 0, 0)
      );
    }

    return result;
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
            startTime: DateTime.now()
              .minus({ days: i })
              .set({ hour: 8, minute: 0 })
              .toISO(),
            endTime:
              i % 2 === 0
                ? DateTime.now()
                    .minus({ days: i })
                    .set({ hour: 9, minute: 30 })
                    .toISO()
                : null,
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

  // seed sessions for the last 2 months with a random amount of infections per day and with a random amount of sessions per day
  async #massRandomSeed() {
    if (
      !(await this.sessionRepository.findOne({
        where: [{ id: `00000000-0000-0000-0000-0000000000aa` }],
      }))
    ) {
      try {
        await this.sessionRepository.insert({
          id: `00000000-0000-0000-0000-0000000000aa`,
          startTime: `2022-12-31T09:30:00`,
          endTime: `2022-12-31T09:30:00`,
          infected: false,
          userId: '00000000-0000-0000-0000-000000000002',
          roomId: '00000000-0000-0000-0000-000000000000',
        });

        const today = new Date();
        const twoMonthsAgo = new Date();
        twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);

        const days = Math.round(
          (today.getTime() - twoMonthsAgo.getTime()) / (1000 * 3600 * 24)
        );

        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          const infections = Math.floor(Math.random() * 10);

          for (let j = 0; j < infections; j++) {
            const session = new SessionEntity();
            session.id = randomUUID();
            session.startTime = date;
            session.endTime = date;
            session.infected = true;
            session.userId = '00000000-0000-0000-0000-000000000002';
            session.roomId = '00000000-0000-0000-0000-000000000000';
            await this.sessionRepository.save(session);
          }

          const room2Infections = Math.floor(Math.random() * 50);
          for (let j = 0; j < room2Infections; j++) {
            const session = new SessionEntity();
            session.id = randomUUID();
            session.startTime = date;
            session.endTime = date;
            session.infected = true;
            session.userId = '00000000-0000-0000-0000-000000000002';
            session.roomId = '00000000-0000-0000-0000-000000000001';
            await this.sessionRepository.save(session);
          }

          await new Promise((resolve) => setTimeout(resolve, 5));
        }
      } catch (error) {
        // do nothing
      }
    }
  }
}

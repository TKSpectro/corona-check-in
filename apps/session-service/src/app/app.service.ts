import {
  findWithMeta,
  PageOptionsDto,
  UserEntity,
} from '@corona-check-in/micro-service-shared';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { environment } from '../environments/environment';
import { SessionEntity } from './session.entity';
import { SessionDto } from './sessions.dto';
import { UpdateSessionDto } from './update-sessions.dto';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
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
    infected?: string,
    sessionBegin?: Date,
    sessionEnd?: Date
  ) {
    const queryBuilder = this.sessionRepository.createQueryBuilder();

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

    return findWithMeta(queryBuilder, pageOptionsDto);
  }

  getSessionById(id: string) {
    return this.sessionRepository.findOne({ where: { id } });
  }

  async createSession(createSessionDto: SessionDto): Promise<SessionEntity> {
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
            startTime: `2022-12-${i < 10 ? 0 : ''}${i}T08:00:00`,
            endTime:
              i % 2 === 0 ? `2022-12-${i < 10 ? '0' : ''}${i}T09:30:00` : null,
            infected: i % 2 === 0 ? true : false,
            userId: '00000000-0000-0000-0000-000000000002',
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

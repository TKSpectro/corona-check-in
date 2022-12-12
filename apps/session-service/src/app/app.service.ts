import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { Repository } from 'typeorm';
import { SessionEntity } from './session.entity';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>
  ) {}

  async onModuleInit() {
    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-1' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000001',
        name: 'seed-session-1',
        startTime: '2022-12-01 08:00:00',
        endTime: '2022-12-01 09:30:00',
        infected: true,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-2' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000002',
        name: 'seed-session-2',
        startTime: '2022-12-02 08:00:00',
        infected: true,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-3' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000003',
        name: 'seed-session-3',
        startTime: '2022-12-03 08:00:00',
        infected: false,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-4' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000004',
        name: 'seed-session-4',
        startTime: '2022-12-04 08:00:00',
        infected: false,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-5' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000005',
        name: 'seed-session-5',
        startTime: '2022-12-05 08:00:00',
        infected: false,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-6' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000006',
        name: 'seed-session-6',
        startTime: '2022-12-06 08:00:00',
        infected: false,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-7' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000007',
        name: 'seed-session-7',
        startTime: '2022-12-07 08:00:00',
        infected: false,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-8' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000008',
        name: 'seed-session-8',
        startTime: '2022-12-08 08:00:00',
        infected: false,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-9' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000009',
        name: 'seed-session-9',
        startTime: '2022-12-09 08:00:00',
        infected: false,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-10' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000010',
        name: 'seed-session-10',
        startTime: '2022-12-10 08:00:00',
        infected: false,
      });
    }

    if (
      !(await this.sessionRepository.findOne({
        where: { name: 'seed-session-11' },
      }))
    ) {
      await this.sessionRepository.insert({
        id: '00000000-0000-0000-0002-000000000011',
        name: 'seed-session-11',
        startTime: '2022-12-11 08:00:00',
        infected: false,
      });
    }
  }

  getSessions(page: number, limit: number, sessionName?: string) {
    if (sessionName) {
      return this.sessionRepository.find({
        skip: page * limit,
        take: limit,
        where: { name: sessionName },
      });
    }

    return this.sessionRepository.find({ skip: page * limit, take: limit });
  }

  getSessionById(id: string) {
    return this.sessionRepository.findOne({ where: { id } });
  }
}

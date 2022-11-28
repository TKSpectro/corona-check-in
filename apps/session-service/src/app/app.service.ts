import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SessionEntity } from './session.entity';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

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
      });
    }
  }

  getSessions(page: number, limit: number) {
    return this.sessionRepository.find({skip: page * limit, take: limit });
  }

  getSessionById(id: string) {
    return this.sessionRepository.findOne({ where: { id } });
  }
}

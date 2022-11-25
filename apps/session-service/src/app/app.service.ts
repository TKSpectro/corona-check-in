import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
  }

  getSessions() {
    return this.sessionRepository.find();
  }

  getSessionById(id: string) {
    return this.sessionRepository.findOne({ where: { id } });
  }
}

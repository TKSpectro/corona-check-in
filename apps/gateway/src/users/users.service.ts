import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity, UserRole } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async onModuleInit() {
    if (
      !(await this.userRepository.findOne({
        where: { email: 'admin@turbomeet.xyz' },
      }))
    ) {
      await this.userRepository.insert({
        id: '00000000-0000-0000-0000-000000000001',
        email: 'admin@turbomeet.xyz',
        // password: hashSync('password', 10),
        password:
          '$2b$10$.u8J.QB3BqWG7/9e4Q.hpOoEubTbsNqHPc.sQLY2bdrisDduk8wFS',
        firstname: 'AdminFirst',
        lastname: 'AdminLast',
        roles: UserRole.ADMIN,
      });
    }

    if (
      !(await this.userRepository.findOne({
        where: { email: 'user@turbomeet.xyz' },
      }))
    ) {
      await this.userRepository.insert({
        id: '00000000-0000-0000-0000-000000000002',
        email: 'user@turbomeet.xyz',
        // password: hashSync('password', 10),
        password:
          '$2b$10$.u8J.QB3BqWG7/9e4Q.hpOoEubTbsNqHPc.sQLY2bdrisDduk8wFS',
        firstname: 'UserFirst',
        lastname: 'UserLast',
        roles: UserRole.USER,
      });
    }
  }

  async findOne(email: string): Promise<UserEntity> {
    return this.userRepository.findOne({ where: { email: email } });
    // return this.users.find((user) => user.email === email);
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return this.userRepository.save(user);
  }
}

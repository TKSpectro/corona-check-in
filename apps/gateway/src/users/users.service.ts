import {
  findWithMeta,
  PageOptionsDto,
  UserEntity,
  UserRole,
} from '@corona-check-in/micro-service-shared';
import { faker } from '@faker-js/faker';
import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compareSync, hashSync } from 'bcrypt';
import { Brackets, Repository } from 'typeorm';
import { SignupUserDto } from '../auth/auth.dto';
import { environment } from '../environments/environment';
import { findAllQueryDto, UpdateUserDto } from './users.dto';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async onModuleInit() {
    if (environment.seedEnabled === true) {
      console.info('[USER] Seeding users...');
      await this.#seed();
    } else {
      console.info('[USER] Seeding disabled.');
    }
  }

  async find(pageOptionsDto: PageOptionsDto, query: findAllQueryDto) {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder.andWhere('user.deleted IS false');

    if (query.role && Object.values(UserRole).includes(query.role)) {
      queryBuilder.andWhere('user.role = :role', { role: query.role });
    }

    if (query.search) {
      query.search = query.search.trim().toLowerCase();

      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.where('LOWER(user.email) LIKE :search', {
            search: `%${query.search}%`,
          })
            .orWhere('LOWER(user.firstname) LIKE :search', {
              search: `%${query.search}%`,
            })
            .orWhere('LOWER(user.lastname) LIKE :search', {
              search: `%${query.search}%`,
            });
        })
      );
    }

    return findWithMeta(queryBuilder, pageOptionsDto, 'email');
  }

  async findOne(email: string) {
    return this.userRepository.findOne({
      where: { email: email },
    });
  }

  async create(user: UserEntity | SignupUserDto) {
    const existingUser = await this.findOne(user.email);
    if (existingUser) {
      throw new HttpException(
        'ERRORS.EMAIL_ALREADY_IN_USE',
        HttpStatus.BAD_REQUEST
      );
    }

    return this.userRepository.save(user);
  }

  async update(id: string, data: UpdateUserDto) {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      throw new HttpException({}, HttpStatus.NOT_FOUND);
    }

    if (user.role !== UserRole.ADMIN) {
      delete data.role;
    }

    if (data.newPassword) {
      if (!data.oldPassword || !compareSync(data.oldPassword, user.password)) {
        throw new HttpException(
          'ERRORS.OLD_PASSWORD_WRONG',
          HttpStatus.BAD_REQUEST
        );
      }

      if (data.newPassword !== data.newPasswordRepeat) {
        throw new HttpException(
          'ERRORS.PASSWORDS_NOT_MATCHING',
          HttpStatus.BAD_REQUEST
        );
      }

      data['password'] = hashSync(data.newPassword, 10);
    }

    Object.assign(user, data);

    return { ...(await user.save()), password: undefined };
  }

  async delete(id: string) {
    const user = await this.userRepository.findOne({ where: { id: id } });

    if (!user) {
      return false;
    }

    user.deleted = true;
    user.email = 'deleted-' + user.id;
    user.firstname = '';
    user.lastname = '';
    user.password = '';

    await this.userRepository.save(user);

    return true;
  }

  async #seed() {
    await this.userRepository.delete({
      email: 'deleted-00000000-0000-0000-0000-000000000001',
    });
    await this.userRepository.delete({
      email: 'deleted-00000000-0000-0000-0000-000000000002',
    });
    await this.userRepository.delete({
      email: 'deleted-00000000-0000-0000-0000-000000000003',
    });

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
        firstname: 'Admin',
        lastname: 'Admin',
        role: UserRole.ADMIN,
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
        firstname: 'User',
        lastname: 'User',
        role: UserRole.USER,
      });
    }

    if (
      !(await this.userRepository.findOne({
        where: [
          { email: 'deleteme@turbomeet.xyz' },
          { email: 'deleted-00000000-0000-0000-0000-000000000003' },
        ],
      }))
    ) {
      await this.userRepository.insert({
        id: '00000000-0000-0000-0000-000000000003',
        email: 'deleteme@turbomeet.xyz',
        // password: hashSync('password', 10),
        password:
          '$2b$10$.u8J.QB3BqWG7/9e4Q.hpOoEubTbsNqHPc.sQLY2bdrisDduk8wFS',
        firstname: faker.name.firstName(),
        lastname: faker.name.lastName(),
        role: UserRole.USER,
      });
    }

    //create 20 users
    for (let i = 0; i < 20; i++) {
      try {
        await this.userRepository.insert({
          email: `user-${i}` + '@turbomeet.xyz',
          // password: hashSync('password', 10),
          password:
            '$2b$10$.u8J.QB3BqWG7/9e4Q.hpOoEubTbsNqHPc.sQLY2bdrisDduk8wFS',
          firstname: faker.name.firstName(),
          lastname: faker.name.lastName(),
          role: UserRole.USER,
        });
      } catch (error) {
        // do nothing
      }
    }
  }
}

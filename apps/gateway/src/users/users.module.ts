import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environments/environment';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.db.host,
      port: environment.db.port as number,
      username: environment.db.username,
      password: environment.db.password,
      database: environment.db.database,
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

import { UserEntity } from '@corona-check-in/micro-service-shared';
import { Module } from '@nestjs/common';

import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SessionEntity } from './session.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'room-service',
        transport: Transport.REDIS,
        options: environment.redis,
      },
    ]),
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
    TypeOrmModule.forFeature([SessionEntity, UserEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

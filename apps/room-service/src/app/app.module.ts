import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../environments/environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RoomEntity } from './room.entity';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'qr-code-service',
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
    TypeOrmModule.forFeature([RoomEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

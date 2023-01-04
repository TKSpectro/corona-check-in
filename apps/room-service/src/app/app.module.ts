import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../../../session-service/src/environments/environment';
import { RoomEntity } from './room.entity';

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
    TypeOrmModule.forFeature([RoomEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

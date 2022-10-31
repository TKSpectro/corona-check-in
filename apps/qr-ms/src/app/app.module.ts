import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemEntity } from './item.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5433,
      username: 'postgres_user',
      password: 'postgres_password',
      database: 'ccn',
      synchronize: true,
      autoLoadEntities: true,
    }),
    TypeOrmModule.forFeature([ItemEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { environment } from '../environments/environment';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'room-service',
        transport: Transport.REDIS,
        options: environment.redis,
      },
    ]),
    ClientsModule.register([
      {
        name: 'session-service',
        transport: Transport.REDIS,
        options: environment.redis,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

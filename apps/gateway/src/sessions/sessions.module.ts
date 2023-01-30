import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { environment } from '../environments/environment';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'sessions-service',
        transport: Transport.REDIS,
        options: environment.redis,
      },
    ]),
  ],
  providers: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}

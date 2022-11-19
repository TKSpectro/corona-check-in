import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SessionsController } from './sessions.controller';
import { SessionsService } from './sessions.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'sessions-service',
        transport: Transport.REDIS,
        options: { host: 'localhost', port: 6379 },
      },
    ]),
  ],
  providers: [SessionsService],
  controllers: [SessionsController],
})
export class SessionsModule {}

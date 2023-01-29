import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { IncidenceController } from './incidence.controller';
import { IncidenceService } from './incidence.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'incidence-service',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST || 'localhost',
          port: 6379,
        },
      },
    ]),
  ],
  controllers: [IncidenceController],
  providers: [IncidenceService],
})
export class IncidenceModule {}

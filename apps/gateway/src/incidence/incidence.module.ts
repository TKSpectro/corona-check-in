import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { environment } from '../environments/environment';
import { IncidenceController } from './incidence.controller';
import { IncidenceService } from './incidence.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'incidence-service',
        transport: Transport.REDIS,
        options: environment.redis,
      },
    ]),
  ],
  controllers: [IncidenceController],
  providers: [IncidenceService],
})
export class IncidenceModule {}

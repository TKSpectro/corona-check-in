import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { environment } from '../../environments/environment';
import { PrometheusModule } from '../prometheus/prometheus.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [
    TerminusModule,
    PrometheusModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: environment.db.host,
      port: environment.db.port as number,
      username: environment.db.username,
      password: environment.db.password,
      database: environment.db.database,
    }),
    ClientsModule.register([
      {
        name: 'sessions-service',
        transport: Transport.REDIS,
        options: {
          host: environment.redis.host,
          port: parseInt(environment.redis.port as string),
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'rooms-service',
        transport: Transport.REDIS,
        options: {
          host: environment.redis.host,
          port: parseInt(environment.redis.port as string),
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'qr-code-service',
        transport: Transport.REDIS,
        options: {
          host: environment.redis.host,
          port: parseInt(environment.redis.port as string),
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'incidence-service',
        transport: Transport.REDIS,
        options: {
          host: environment.redis.host,
          port: parseInt(environment.redis.port as string),
        },
      },
    ]),
  ],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}

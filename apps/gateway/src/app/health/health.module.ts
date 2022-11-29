import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { PrometheusModule } from '../prometheus/prometheus.module';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  imports: [TerminusModule, PrometheusModule],
  controllers: [HealthController],
  providers: [HealthService],
  exports: [HealthService],
})
export class HealthModule {}

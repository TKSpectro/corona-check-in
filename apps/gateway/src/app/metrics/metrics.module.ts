import { Module } from '@nestjs/common';
import { HealthModule } from '../health/health.module';
import { PrometheusModule } from '../prometheus/prometheus.module';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Module({
  providers: [MetricsService],
  controllers: [MetricsController],
  imports: [PrometheusModule, HealthModule],
})
export class MetricsModule {}

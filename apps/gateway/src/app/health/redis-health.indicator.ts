import { Transport } from '@nestjs/microservices';
import {
  HealthIndicatorResult,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { environment } from '../../environments/environment';
import { PrometheusService } from '../prometheus/prometheus.service';
import { BaseHealthIndicator } from './base-health.indicator';
import { HealthIndicator } from './health-indicator.interface';

export class RedisHealthIndicator
  extends BaseHealthIndicator
  implements HealthIndicator
{
  public readonly name = 'Redis_Health';
  protected readonly help = 'Status of ' + this.name;
  protected readonly promClientService: PrometheusService | undefined;

  private readonly microserviceHealthIndicator: MicroserviceHealthIndicator;

  constructor(
    microserviceHealthIndicator: MicroserviceHealthIndicator,
    promClientService?: PrometheusService
  ) {
    super();
    this.microserviceHealthIndicator = microserviceHealthIndicator;
    this.promClientService = promClientService;
    this.registerMetrics();
    this.registerGauges();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    const result: Promise<HealthIndicatorResult> =
      this.microserviceHealthIndicator.pingCheck('redis', {
        transport: Transport.REDIS,
        options: environment.redis,
      });
    this.updatePrometheusData(true);
    return result;
  }
}

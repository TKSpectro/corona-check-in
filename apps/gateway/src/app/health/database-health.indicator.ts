import {
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { PrometheusService } from '../prometheus/prometheus.service';
import { BaseHealthIndicator } from './base-health.indicator';
import { HealthIndicator } from './health-indicator.interface';

export class DatabaseHealthIndicator
  extends BaseHealthIndicator
  implements HealthIndicator
{
  public readonly name = 'Database_Health';
  protected readonly help = 'Status of ' + this.name;
  protected readonly promClientService: PrometheusService | undefined;

  private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator;

  constructor(
    typeOrmHealthIndicator: TypeOrmHealthIndicator,
    promClientService?: PrometheusService
  ) {
    super();
    this.typeOrmHealthIndicator = typeOrmHealthIndicator;
    this.promClientService = promClientService;
    this.registerMetrics();
    this.registerGauges();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    const result: HealthIndicatorResult =
      await this.typeOrmHealthIndicator.pingCheck('database');
    this.updatePrometheusData(true);

    return result;
  }
}

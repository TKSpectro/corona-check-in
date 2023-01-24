import { ClientProxy } from '@nestjs/microservices';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { lastValueFrom, timeout } from 'rxjs';
import { PrometheusService } from '../prometheus/prometheus.service';
import { BaseHealthIndicator } from './base-health.indicator';
import { HealthIndicator } from './health-indicator.interface';

export class IncidenceServiceHealthIndicator
  extends BaseHealthIndicator
  implements HealthIndicator
{
  public readonly name = 'Incidence_Service_Health';
  protected readonly help = 'Status of ' + this.name;

  private readonly incidenceClient: ClientProxy;
  protected readonly promClientService: PrometheusService | undefined;

  constructor(
    incidenceClient: ClientProxy,
    promClientService?: PrometheusService
  ) {
    super();
    this.incidenceClient = incidenceClient;
    this.promClientService = promClientService;
    this.registerMetrics();
    this.registerGauges();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    const isUp = await lastValueFrom(
      this.incidenceClient
        .send({ role: 'incidence', cmd: 'health' }, {})
        .pipe(timeout(5000))
    );

    const res: HealthIndicatorResult = {
      'incidence-service': { status: isUp ? 'up' : 'down' },
    };

    this.updatePrometheusData(isUp);

    return res;
  }
}

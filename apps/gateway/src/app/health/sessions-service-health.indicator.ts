import { ClientProxy } from '@nestjs/microservices';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { lastValueFrom, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { PrometheusService } from '../prometheus/prometheus.service';
import { BaseHealthIndicator } from './base-health.indicator';
import { HealthIndicator } from './health-indicator.interface';

export class SessionsServiceHealthIndicator
  extends BaseHealthIndicator
  implements HealthIndicator
{
  public readonly name = 'Sessions_Service_Health';
  protected readonly help = 'Status of ' + this.name;

  private readonly sessionClient: ClientProxy;
  protected readonly promClientService: PrometheusService | undefined;

  constructor(
    sessionClient: ClientProxy,
    promClientService?: PrometheusService
  ) {
    super();
    this.sessionClient = sessionClient;
    this.promClientService = promClientService;
    this.registerMetrics();
    this.registerGauges();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    const isUp = await lastValueFrom(
      this.sessionClient
        .send({ role: 'sessions', cmd: 'health' }, {})
        .pipe(timeout(environment.serviceTimeout))
    );

    const res: HealthIndicatorResult = {
      'sessions-service': { status: isUp ? 'up' : 'down' },
    };

    this.updatePrometheusData(isUp);

    return res;
  }
}

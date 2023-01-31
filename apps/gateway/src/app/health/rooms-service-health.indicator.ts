import { ClientProxy } from '@nestjs/microservices';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { lastValueFrom, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { PrometheusService } from '../prometheus/prometheus.service';
import { BaseHealthIndicator } from './base-health.indicator';
import { HealthIndicator } from './health-indicator.interface';

export class RoomsServiceHealthIndicator
  extends BaseHealthIndicator
  implements HealthIndicator
{
  public readonly name = 'Rooms_Service_Health';
  protected readonly help = 'Status of ' + this.name;
  private readonly roomClient: ClientProxy;
  protected readonly promClientService: PrometheusService | undefined;

  constructor(roomClient: ClientProxy, promClientService?: PrometheusService) {
    super();
    this.roomClient = roomClient;
    this.promClientService = promClientService;
    this.registerMetrics();
    this.registerGauges();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    const isUp = await lastValueFrom(
      this.roomClient
        .send({ role: 'room', cmd: 'health' }, {})
        .pipe(timeout(environment.serviceTimeout))
    );

    const res: HealthIndicatorResult = {
      'rooms-service': { status: isUp ? 'up' : 'down' },
    };

    this.updatePrometheusData(isUp);

    return res;
  }
}

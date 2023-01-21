import { ClientProxy } from '@nestjs/microservices';
import { HealthIndicatorResult } from '@nestjs/terminus';
import { lastValueFrom, timeout } from 'rxjs';
import { PrometheusService } from '../prometheus/prometheus.service';
import { BaseHealthIndicator } from './base-health.indicator';
import { HealthIndicator } from './health-indicator.interface';

export class QrCodeServiceHealthIndicator
  extends BaseHealthIndicator
  implements HealthIndicator
{
  public readonly name = 'QrCode_Service_Health';
  protected readonly help = 'Status of ' + this.name;

  private readonly qrCodeClient: ClientProxy;
  protected readonly promClientService: PrometheusService | undefined;

  constructor(
    qrCodeClient: ClientProxy,
    promClientService?: PrometheusService
  ) {
    super();
    this.qrCodeClient = qrCodeClient;
    this.promClientService = promClientService;
    this.registerMetrics();
    this.registerGauges();
  }

  public async isHealthy(): Promise<HealthIndicatorResult> {
    const isUp = await lastValueFrom(
      this.qrCodeClient
        .send({ role: 'qr-code', cmd: 'health' }, {})
        .pipe(timeout(5000))
    );

    const res: HealthIndicatorResult = {
      'qr-code-service': { status: isUp ? 'up' : 'down' },
    };

    this.updatePrometheusData(isUp);

    return res;
  }
}

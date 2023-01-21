import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HttpHealthIndicator,
  MicroserviceHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
// import { AnyOtherService } from '../any-other-module/any-other.service';
import { PrometheusService } from '../prometheus/prometheus.service';
import { HealthIndicator } from './health-indicator.interface';
import { RedisHealthIndicator } from './redis-health.indicator';
// import { AnyOtherHealthIndicator } from './models/any-other-health.indicator';
import { ClientProxy } from '@nestjs/microservices';
import { DatabaseHealthIndicator } from './database-health.indicator';
import { IncidenceServiceHealthIndicator } from './incidence-service-health.indicator';
import { NestjsHealthIndicator } from './nestjs-health.indicator';
import { QrCodeServiceHealthIndicator } from './qr-code-service-health.indicator';
import { RoomsServiceHealthIndicator } from './rooms-service-health.indicator';
import { SessionsServiceHealthIndicator } from './sessions-service-health.indicator';

@Injectable()
export class HealthService {
  private readonly listOfThingsToMonitor: HealthIndicator[];

  constructor(
    private promClientService: PrometheusService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
    private typeOrmHealthIndicator: TypeOrmHealthIndicator,
    @Inject('sessions-service') private sessionClient: ClientProxy,
    @Inject('rooms-service') private roomClient: ClientProxy,
    @Inject('qr-code-service') private qrCodeClient: ClientProxy,
    @Inject('incidence-service') private incidenceClient: ClientProxy
  ) {
    this.listOfThingsToMonitor = [
      new NestjsHealthIndicator(
        this.http,
        'https://docs.nestjs.com',
        this.promClientService
      ),
      new DatabaseHealthIndicator(
        this.typeOrmHealthIndicator,
        this.promClientService
      ),
      new RedisHealthIndicator(this.microservice, this.promClientService),
      new SessionsServiceHealthIndicator(
        this.sessionClient,
        this.promClientService
      ),
      new RoomsServiceHealthIndicator(this.roomClient, this.promClientService),
      new QrCodeServiceHealthIndicator(
        this.qrCodeClient,
        this.promClientService
      ),
      new IncidenceServiceHealthIndicator(
        this.incidenceClient,
        this.promClientService
      ),
    ];
  }

  @HealthCheck()
  public async check(): Promise<HealthCheckResult | undefined> {
    return await this.health.check(
      this.listOfThingsToMonitor.map(
        (apiIndicator: HealthIndicator) => async () => {
          try {
            return await apiIndicator.isHealthy();
          } catch (e) {
            Logger.warn(e);
            return apiIndicator.reportUnhealthy();
          }
        }
      )
    );
  }
}

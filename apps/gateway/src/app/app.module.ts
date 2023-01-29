import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';

import { HttpModule } from '@nestjs/axios';
import { environment } from '../environments/environment';
import { RoomsModule } from '../rooms/rooms.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { MetricsModule } from './metrics/metrics.module';
import { PrometheusModule } from './prometheus/prometheus.module';
import { QrCodeModule } from './qr-code/qr-code.module';

@Module({
  imports: [
    HttpModule,
    AuthModule,
    UsersModule,
    ClientsModule.register([
      {
        name: 'incidence-service',
        transport: Transport.REDIS,
        options: environment.redis,
      },
    ]),
    SessionsModule,
    RoomsModule,
    UsersModule,
    QrCodeModule,
    HealthModule,
    PrometheusModule,
    MetricsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Globally enable JwtAuthGuard for every route
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
    // Globally enable RolesGuard
    { provide: 'APP_GUARD', useClass: RolesGuard },
  ],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthModule } from '../auth/auth.module';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { SessionsController } from '../sessions/sessions.controller';
import { SessionsModule } from '../sessions/sessions.module';
import { UsersModule } from '../users/users.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ClientsModule.register([
      {
        name: 'QR_MS',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'incidence-service',
        transport: Transport.REDIS,
        options: {
          host: 'localhost',
          port: 6379,
        },
      },
    ]),
    SessionsModule,
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

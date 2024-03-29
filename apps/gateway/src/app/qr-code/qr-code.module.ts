import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { environment } from '../../environments/environment';
import { QrCodeController } from './qr-code.controller';
import { QrCodeService } from './qr-code.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'qr-code-service',
        transport: Transport.REDIS,
        options: environment.redis,
      },
    ]),
  ],
  providers: [QrCodeService],
  controllers: [QrCodeController],
})
export class QrCodeModule {}

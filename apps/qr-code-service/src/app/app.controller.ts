import { Controller } from '@nestjs/common';

import { MessagePattern } from '@nestjs/microservices';
import { AppService } from './app.service';
import { QRCodeData } from './qr-code.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @MessagePattern({ role: 'qr-code', cmd: 'health' })
  health() {
    return true;
  }

  @MessagePattern({ role: 'qr-code', cmd: 'generate' })
  generateQRCode(qrCodeData: QRCodeData) {
    return this.appService.generateQRCode(qrCodeData);
  }
}

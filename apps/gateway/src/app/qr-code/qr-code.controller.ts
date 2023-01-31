import { Body, Controller, Post } from '@nestjs/common';
import { QrCodeService } from './qr-code.service';
import { QRCodeData } from './qr-code.types';

@Controller('qr-code')
export class QrCodeController {
  constructor(private qrCodeSrc: QrCodeService) {}
  @Post('')
  async generateQRCode(@Body() qrCodeData: QRCodeData) {
    return this.qrCodeSrc.generate(qrCodeData);
  }
}

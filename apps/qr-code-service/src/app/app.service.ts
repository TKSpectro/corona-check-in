import { Injectable } from '@nestjs/common';
import { create } from 'qrcode';
import { QRCodeData } from './qr-code.dto';

@Injectable()
export class AppService {
  generateQRCode(qrCodeData: QRCodeData) {
    const generatedAt = new Date();
    const code = create(JSON.stringify({ generatedAt, ...qrCodeData }), {});

    return { qrCode: code.modules.data, generatedAt: generatedAt };
  }
}

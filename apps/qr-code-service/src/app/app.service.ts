import { Injectable } from '@nestjs/common';
import { create } from 'qrcode';
import { QRCodeData } from './qr-code.dto';

@Injectable()
export class AppService {
  generateQRCode(qrCodeData: QRCodeData): { qrCode: Uint8Array } {
    const code = create(JSON.stringify(qrCodeData), {});

    // Print to console for debugging purposes
    // toString(JSON.stringify(qrCodeData), { type: 'terminal' }, (err, url) => {
    //   console.log(url);
    // });

    return { qrCode: code.modules.data };
  }
}

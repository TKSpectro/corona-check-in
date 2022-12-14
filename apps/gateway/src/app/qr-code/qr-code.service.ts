import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { QRCodeData } from './qr-code.types';

@Injectable()
export class QrCodeService {
  constructor(@Inject('qr-code-service') private qrCodeSrv: ClientProxy) {}

  generate(qrCodeData: QRCodeData) {
    return this.qrCodeSrv.send(
      { role: 'qr-code', cmd: 'generate' },
      qrCodeData
    );
  }
}

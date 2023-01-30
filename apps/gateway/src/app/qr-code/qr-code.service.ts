import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { QRCodeData } from './qr-code.types';

@Injectable()
export class QrCodeService {
  constructor(@Inject('qr-code-service') private qrCodeSrv: ClientProxy) {}

  async generate(qrCodeData: QRCodeData) {
    return lastValueFrom(
      this.qrCodeSrv
        .send({ role: 'qr-code', cmd: 'generate' }, qrCodeData)
        .pipe(timeout(environment.serviceTimeout))
    );
  }
}

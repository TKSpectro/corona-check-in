import { Component, EventEmitter, Output } from '@angular/core';
import { Result } from '@zxing/library';
import { ScanQrCodeBody } from '../../shared/types';

@Component({
  selector: 'ccn-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.scss'],
})
export class QrCodeScannerComponent {
  turnCameraOn = false;
  noCameraFound = false;
  cameraDevices: MediaDeviceInfo[] = [];
  desiredDevice!: MediaDeviceInfo;

  @Output() scanEvent = new EventEmitter<ScanQrCodeBody>();

  camerasFoundHandler($event: MediaDeviceInfo[]) {
    if ($event.length > 0) {
      this.cameraDevices = $event;
      this.desiredDevice = $event[0];
    } else {
      console.warn('no Camera found');
      this.noCameraFound = true;
    }
  }

  camerasNotFoundHandler($event: any) {
    console.error('camerasNotFoundHandler', $event);
  }

  scanSuccessHandler($event: string) {
    console.log('scanSuccessHandler', $event);
  }

  scanErrorHandler($event: Error) {
    console.log('scanErrorHandler', $event);
  }

  scanCompleteHandler($event: Result) {
    if ($event) {
      const roomDetails: ScanQrCodeBody = JSON.parse($event.getText());
      roomDetails.createdQrCode = new Date(roomDetails.createdQrCode);
      this.scanEvent.emit(roomDetails);
      this.turnCameraOn = !this.turnCameraOn;
    }
  }

  changeCamera() {
    console.log('changeCamera', this.desiredDevice);
  }

  toggleCamera() {
    this.turnCameraOn = !this.turnCameraOn;
  }
}

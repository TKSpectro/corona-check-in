import { Component, OnInit } from '@angular/core';
import { Result } from '@zxing/library';

@Component({
  selector: 'ccn-qr-code-scanner',
  templateUrl: './qr-code-scanner.component.html',
  styleUrls: ['./qr-code-scanner.component.scss'],
})
export class QrCodeScannerComponent implements OnInit {
  turnCameraOn = false;
  cameraDevices: MediaDeviceInfo[] = [];
  desiredDevice!: MediaDeviceInfo;

  constructor() {}

  ngOnInit(): void {}

  camerasFoundHandler($event: MediaDeviceInfo[]) {
    if ($event.length > 0) {
      this.cameraDevices = $event;
      this.desiredDevice = $event[0];
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
      console.log('scanCompleteHandler', $event);
    }
  }

  changeCamera() {
    console.log('changeCamera', this.desiredDevice);
    //this.desiredDevice = this.cameraDevices[parseInt(cameraSelect.value)];
  }
}

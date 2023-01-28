import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Result } from '@zxing/library';

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

  constructor(private snackBar: MatSnackBar, private t: TranslateService) {}

  camerasFoundHandler($event: MediaDeviceInfo[]) {
    if ($event.length > 0) {
      this.cameraDevices = $event;
      this.desiredDevice = $event[0];
    } else {
      console.warn('no Camera found');
      this.noCameraFound = true;
    }
  }

  camerasNotFoundHandler($event: string) {
    this.snackBar.open(
      this.t.instant('DASHBOARDS.CAMERA_NOT_FOUND_ERROR'),
      undefined,
      {
        panelClass: 'snackbar-error',
      }
    );
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
  }

  toggleCamera() {
    this.turnCameraOn = !this.turnCameraOn;
  }
}

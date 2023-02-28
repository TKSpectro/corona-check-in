import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AngularMaterialModule } from '../angular-material.module';
import { LibModule } from '../libs/lib.module';
import { CurrentStatusComponent } from './current-status/current-status.component';
import { DashboardComponent } from './dashboard.component';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import { SessionCardComponent } from './session-card/session-card.component';

@NgModule({
  declarations: [
    SessionCardComponent,
    QrCodeScannerComponent,
    DashboardComponent,
    CurrentStatusComponent,
  ],
  imports: [
    CommonModule,
    ZXingScannerModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    LibModule,
  ],
})
export class DashboardModule {}

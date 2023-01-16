import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AngularMaterialModule } from '../angular-material.module';
import { DashboardComponent } from './dashboard.component';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import { SessionCardComponent } from './session-card/session-card.component';
import { LibModule } from '../libs/lib.module';

@NgModule({
  declarations: [
    SessionCardComponent,
    QrCodeScannerComponent,
    DashboardComponent,
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

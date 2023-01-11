import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DashboardComponent } from './dashboard.component';
import { IncidenceComponent } from './graphs/incidence/incidence.component';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import { SessionCardComponent } from './session-card/session-card.component';
import { SharedModule } from '../shared/shared.module';
import { AngularMaterialModule } from '../angular-material.module';
import { MatSliderModule } from '@angular/material/slider';

@NgModule({
  declarations: [
    SessionCardComponent,
    IncidenceComponent,
    QrCodeScannerComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    ZXingScannerModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    SharedModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}

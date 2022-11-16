import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DashboardComponent } from './dashboard.component';
import { IncidenceComponent } from './graphs/incidence/incidence.component';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import { SessionCardComponent } from './session-card/session-card.component';
import { SessionListComponent } from './session-list/session-list.component';

@NgModule({
  declarations: [
    SessionListComponent,
    SessionCardComponent,
    IncidenceComponent,
    QrCodeScannerComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    ZXingScannerModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}

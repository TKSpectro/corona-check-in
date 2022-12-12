import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { DashboardComponent } from './dashboard.component';
import { IncidenceComponent } from './graphs/incidence/incidence.component';
import { QrCodeScannerComponent } from './qr-code-scanner/qr-code-scanner.component';
import { SessionCardComponent } from './session-card/session-card.component';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    SessionListComponent,
    SessionCardComponent,
    IncidenceComponent,
    QrCodeScannerComponent,
    DashboardComponent,
    SessionDetailsComponent,
  ],
  imports: [
    CommonModule,
    MatSliderModule,
    ZXingScannerModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatPaginatorModule,
    MatCardModule,
    HttpClientModule,
    FormsModule,
    TranslateModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}

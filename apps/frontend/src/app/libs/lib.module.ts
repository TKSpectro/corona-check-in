import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { CustomDatePipe } from '.';
import { AngularMaterialModule } from '../angular-material.module';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { IncidenceComponent } from './graphs/incidence/incidence.component';
import { SessionTableComponent } from './session-table/session-table.component';

@NgModule({
  declarations: [
    SessionTableComponent,
    ConfirmationDialogComponent,
    IncidenceComponent,
    CustomDatePipe,
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    TranslateModule,
    RouterOutlet,
    NgxChartsModule,
  ],
  exports: [
    SessionTableComponent,
    ConfirmationDialogComponent,
    IncidenceComponent,
    CustomDatePipe,
  ],
})
export class LibModule {}

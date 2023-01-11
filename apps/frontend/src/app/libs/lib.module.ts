import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionTableComponent } from './session-table/session-table.component';
import { AngularMaterialModule } from '../angular-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import { RouterOutlet } from '@angular/router';
import { IncidenceComponent } from './graphs/incidence/incidence.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    SessionTableComponent,
    ConfirmationDialogComponent,
    IncidenceComponent,
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
  ],
})
export class LibModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionTableComponent } from './session-table/session-table.component';
import { AngularMaterialModule } from '../angular-material.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SessionTableComponent],
  imports: [CommonModule, AngularMaterialModule, TranslateModule],
  exports: [SessionTableComponent],
})
export class SharedModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../angular-material.module';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { FormsModule } from '@angular/forms';
import { LibModule } from '../libs/lib.module';

@NgModule({
  declarations: [SessionListComponent, SessionDetailsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AngularMaterialModule,
    FormsModule,
    LibModule,
  ],
})
export class SessionsModule {}

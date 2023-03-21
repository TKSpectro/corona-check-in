import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthGuard } from '../auth';
import { LibModule } from '../libs/lib.module';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { SessionListComponent } from './session-list/session-list.component';

const routes: Routes = [
  {
    path: '',
    component: SessionListComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [SessionListComponent, SessionDetailsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AngularMaterialModule,
    FormsModule,
    LibModule,
    RouterModule.forChild(routes),
  ],
})
export class SessionsModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../angular-material.module';
import { SessionListComponent } from './session-list/session-list.component';
import { SessionDetailsComponent } from './session-details/session-details.component';
import { FormsModule } from '@angular/forms';
import { LibModule } from '../libs/lib.module';
import { RouterModule, Routes } from '@angular/router';
import { RoomsComponent } from '../rooms/rooms.component';
import { AuthGuard } from '../auth';

const routes: Routes = [
  {
    path: '',
    component: RoomsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: SessionListComponent, title: 'Session' },
      {
        path: ':id',
        component: SessionDetailsComponent,
        title: 'Session Details',
      },
    ],
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

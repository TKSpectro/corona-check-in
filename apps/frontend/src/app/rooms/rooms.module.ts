import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  RouterLink,
  RouterModule,
  RouterOutlet,
  Routes,
} from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { AngularMaterialModule } from '../angular-material.module';
import { LibModule } from '../libs/lib.module';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomsComponent } from './rooms.component';
import { RoomFormComponent } from './room-form/room-form.component';
import { AuthGuard } from '../auth';

function test() {
  console.log('test');
}

const routes: Routes = [
  {
    path: '',
    component: RoomsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RoomListComponent, title: 'Rooms' },
      { path: ':id', component: RoomDetailsComponent, title: 'Room Details' },
    ],
  },
];

@NgModule({
  declarations: [
    RoomListComponent,
    RoomDetailsComponent,
    RoomsComponent,
    RoomFormComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AngularMaterialModule,
    RouterOutlet,
    RouterLink,
    FormsModule,
    ReactiveFormsModule,
    LibModule,
    QRCodeModule,
    RouterModule.forChild(routes),
  ],
})
export class RoomsModule {}

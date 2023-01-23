import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { QRCodeModule } from 'angularx-qrcode';
import { AngularMaterialModule } from '../angular-material.module';
import { LibModule } from '../libs/lib.module';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomsComponent } from './rooms.component';

@NgModule({
  declarations: [RoomListComponent, RoomDetailsComponent, RoomsComponent],
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
  ],
})
export class RoomsModule {}

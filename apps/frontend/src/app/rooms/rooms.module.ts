import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../angular-material.module';
import { RoomListComponent } from './room-list/room-list.component';
import { RoomDetailsComponent } from './room-details/room-details.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { RoomsComponent } from './rooms.component';
import { LibModule } from '../libs/lib.module';
import { QRCodeModule } from 'angularx-qrcode';

@NgModule({
  declarations: [RoomListComponent, RoomDetailsComponent, RoomsComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AngularMaterialModule,
    RouterOutlet,
    RouterLink,
    LibModule,
    QRCodeModule,
  ],
})
export class RoomsModule {}
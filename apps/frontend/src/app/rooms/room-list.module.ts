import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../angular-material.module';
import { RoomListComponent } from './room-list/room-list.component';

@NgModule({
  declarations: [RoomListComponent],
  imports: [CommonModule, TranslateModule, AngularMaterialModule],
})
export class RoomListModule {}

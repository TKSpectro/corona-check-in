import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoomListComponent } from './room-list/room-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [RoomListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    AngularMaterialModule,
    MatPaginatorModule,
  ],
})
export class RoomListModule {}

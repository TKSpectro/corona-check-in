import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../angular-material.module';
import { LibModule } from '../libs/lib.module';
import { UserListComponent } from './user-list/user-list.component';
import { UsersComponent } from './users.component';

@NgModule({
  declarations: [UsersComponent, UserListComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    AngularMaterialModule,
    LibModule,
  ],
})
export class ProfilesModule {}

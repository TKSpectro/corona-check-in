import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../angular-material.module';
import { ProfileDeleteDialogComponent } from './profile-delete-dialog-component';
import { ProfileComponent } from './profile.component';

@NgModule({
  declarations: [ProfileComponent, ProfileDeleteDialogComponent],
  imports: [CommonModule, TranslateModule, FormsModule, AngularMaterialModule],
  exports: [ProfileComponent],
})
export class ProfileModule {}

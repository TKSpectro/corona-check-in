import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../angular-material.module';
import { ProfileComponent } from './profile.component';

@NgModule({
  imports: [CommonModule, TranslateModule, FormsModule, AngularMaterialModule],
  declarations: [ProfileComponent],
  exports: [ProfileComponent],
})
export class ProfileModule {}

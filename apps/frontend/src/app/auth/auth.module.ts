import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AngularMaterialModule } from '../angular-material.module';
import { AuthComponent } from './authentication/auth.component';

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, TranslateModule, FormsModule, AngularMaterialModule],
  exports: [AuthComponent],
})
export class AuthModule {}

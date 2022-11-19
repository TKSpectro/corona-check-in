import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthComponent } from './authentication/auth.component';

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule],
  exports: [AuthComponent],
})
export class AuthModule {}

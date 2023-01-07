import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthComponent, AuthGuard } from './auth';
import { DashboardComponent } from './dashboard';
import { ProfileComponent } from './profile';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  { path: 'auth', component: AuthComponent },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
  },
  {
    path: 'test',
    canActivate: [AuthGuard, AdminGuard],

    component: ProfileComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

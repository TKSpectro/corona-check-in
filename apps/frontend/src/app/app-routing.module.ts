import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthComponent, AuthGuard } from './auth';
import { DashboardComponent } from './dashboard';
import { ProfileComponent } from './profile';
import { RoomListComponent } from './rooms';

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
    path: 'rooms',
    canActivate: [AuthGuard],
    component: RoomListComponent,
  },
  {
    path: 'admin',
    canActivate: [AuthGuard, AdminGuard],
    component: ProfileComponent,
  },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

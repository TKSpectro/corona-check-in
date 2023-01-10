import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent, AuthGuard } from './auth';
import { DashboardComponent } from './dashboard';
import { ProfileComponent } from './profile';
import { RoomListComponent } from './rooms';
import { SessionDetailsComponent } from './dashboard/session-details/session-details.component';
import { SessionListComponent } from './dashboard/session-list/session-list.component';

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
  { path: 'sessions/:id', component: SessionDetailsComponent },
  { path: 'sessions', component: SessionListComponent },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

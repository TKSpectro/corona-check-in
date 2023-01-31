import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent, AuthGuard } from './auth';
import { DashboardComponent } from './dashboard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileComponent } from './profile';
import { RoomListComponent } from './rooms';
import { RoomDetailsComponent } from './rooms/room-details/room-details.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SessionDetailsComponent } from './sessions/session-details/session-details.component';
import { SessionListComponent } from './sessions/session-list/session-list.component';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
    title: 'Dashboard',
  },
  { path: 'auth', component: AuthComponent, title: 'Auth' },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
    title: 'Profile',
  },
  {
    path: 'rooms',
    component: RoomsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RoomListComponent, title: 'Rooms' },
      { path: ':id', component: RoomDetailsComponent, title: 'Room Details' },
    ],
  },
  {
    path: 'sessions/:id',
    canActivate: [AuthGuard],
    component: SessionDetailsComponent,
    title: 'Session Details',
  },
  {
    path: 'sessions',
    canActivate: [AuthGuard],
    component: SessionListComponent,
    title: 'Sessions',
  },
  { path: '404', component: PageNotFoundComponent, title: 'Page Not Found' },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

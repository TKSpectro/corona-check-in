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
  },
  { path: 'auth', component: AuthComponent },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    component: ProfileComponent,
  },
  {
    path: 'rooms',
    component: RoomsComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: RoomListComponent },
      { path: ':id', component: RoomDetailsComponent },
    ],
  },
  {
    path: 'sessions/:id',
    canActivate: [AuthGuard],
    component: SessionDetailsComponent,
  },
  {
    path: 'sessions',
    canActivate: [AuthGuard],
    component: SessionListComponent,
  },
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

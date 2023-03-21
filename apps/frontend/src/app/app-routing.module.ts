import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard, AuthComponent, AuthGuard } from './auth';
import { DashboardComponent } from './dashboard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
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
    path: 'rooms',
    loadChildren: () =>
      import('./rooms/rooms.module').then((m) => m.RoomsModule),
  },
  {
    path: 'sessions',
    loadChildren: () =>
      import('./sessions/sessions.module').then((m) => m.SessionsModule),
  },
  {
    path: 'users',
    canActivate: [AuthGuard, AdminGuard],
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
  },
  { path: '404', component: PageNotFoundComponent, title: 'Page Not Found' },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [CommonModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

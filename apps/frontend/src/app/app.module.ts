import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppComponent } from './app.component';
import { AuthComponent } from './auth/authentication/auth.component';
import { AuthModule } from './auth/auth.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { AuthInterceptor } from './auth.interceptor';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent,
  },
  { path: 'auth', component: AuthComponent },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatTableModule,
    MatCardModule,
    NgxChartsModule,
    DashboardModule,
    AuthModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

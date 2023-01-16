import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpClientModule,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth';
import { AuthInterceptor } from './auth.interceptor';
import { DashboardModule } from './dashboard';
import { SidenavComponent } from './libs';
import { ProfileModule } from './profile';
import { RoomsModule } from './rooms/rooms.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SessionsModule } from './sessions/sessions.module';
import { LibModule } from './libs/lib.module';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [AppComponent, SidenavComponent, PageNotFoundComponent],
  imports: [
    BrowserModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    NgxChartsModule,
    DashboardModule,
    RoomsModule,
    SessionsModule,
    LibModule,
    ProfileModule,
    AuthModule,
    AngularMaterialModule,
    AppRoutingModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

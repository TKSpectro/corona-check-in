import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AngularMaterialModule } from './angular-material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule } from './auth';
import { AuthInterceptor } from './auth/auth.interceptor';
import { DashboardModule } from './dashboard';
import { ErrorInterceptor } from './error.interceptor';
import { ImprintComponent } from './imprint/imprint.component';
import { SidenavComponent } from './libs';
import { LibModule } from './libs/lib.module';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ProfileModule } from './profile';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function tokenGetter() {
  return localStorage.getItem('ccn_token');
}

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    PageNotFoundComponent,
    ImprintComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    DashboardModule,
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
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        headerName: 'X-CCN-Authorization',
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

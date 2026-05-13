import {
  NgModule,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  BrowserModule,
  provideClientHydration,
  withEventReplay
} from '@angular/platform-browser';

import {
  provideHttpClient,
  withInterceptorsFromDi,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import { AppRoutingModule } from './app-routing-module';

import { App } from './app';

import { AuthInterceptor }
from './auth/interceptors/auth.interceptor';

@NgModule({
  declarations: [App],

  imports: [
    BrowserModule,
    AppRoutingModule
  ],

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideClientHydration(
      withEventReplay()
    ),

    provideHttpClient(
      withInterceptorsFromDi()
    ),

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],

  bootstrap: [App]
})
export class AppModule {}
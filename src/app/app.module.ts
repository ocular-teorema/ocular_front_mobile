import { BrowserModule } from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import { AppComponent } from './app.component';
import { StreamComponent } from './stream-component/stream.component';
import { AppRoutingModule } from './app-routing.module';
import {HttpClientModule, HttpClientXsrfModule} from '@angular/common/http';
import { AuthComponent } from './auth-component/auth.component';
import { FormsModule } from '@angular/forms';
import { CameraComponent } from './camera-component/camera.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store';
import { HeaderComponent } from './header-component/header.component';
import { ArchiveComponent } from './archive/archive.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatSelectModule} from '@angular/material';


@NgModule({
  declarations: [
    AppComponent,
    StreamComponent,
    AuthComponent,
    CameraComponent,
    HeaderComponent,
    ArchiveComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatSelectModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({'teorema': reducers}),
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'en-US'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { StreamComponent } from './stream-component/stream.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { AuthComponent } from './auth-component/auth.component';
import { FormsModule } from '@angular/forms';
import { CameraComponent } from './camera-component/camera.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store';
import { HeaderComponent } from './header-component/header.component';

@NgModule({
  declarations: [
    AppComponent,
    StreamComponent,
    AuthComponent,
    CameraComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({'teorema': reducers}),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

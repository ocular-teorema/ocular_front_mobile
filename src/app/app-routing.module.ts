import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StreamComponent } from './stream-component/stream.component';
import { AuthComponent } from './auth-component/auth.component';
import { AuthGuardService } from './services/auth-guard/auth-guard.service';
import { CameraComponent } from './camera-component/camera.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    component: AuthComponent
  },
  {
    path: 'stream',
    component: StreamComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'camera',
    component: CameraComponent,
    canActivate: [AuthGuardService]
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

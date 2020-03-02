import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from '../shared';

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot([        
      {
        path: '',
        redirectTo: '/orders/section',
        pathMatch: 'full',
        canActivate: [AuthGuard]
      },
      {
        path: 'login', 
        component: LoginComponent 
      }
    ])
  ],  
  exports: [ RouterModule ]
})
export class AppRoutingModule { }

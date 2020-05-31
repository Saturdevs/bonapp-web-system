import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { PinAuthenticateComponent } from './pin-authenticate.component';

@NgModule({
  declarations: [
    PinAuthenticateComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers:[
    PinAuthenticateComponent
  ],
  exports: [
    PinAuthenticateComponent
  ]
})
export class PinAuthenticateModule { }
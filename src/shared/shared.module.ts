import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MDBBootstrapModules } from 'ng-mdb-pro';
import { MDBSpinningPreloader } from 'ng-mdb-pro';
import { ToastModule } from 'ng-mdb-pro/pro/alerts';
import { ApiService } from '../shared/services/api.service';
import { SharedService } from './services/shared.service';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    ToastModule.forRoot(),
    MDBBootstrapModules.forRoot(),    
  ],
  declarations: [],
  providers: [ 
    ApiService,
    SharedService,
    MDBSpinningPreloader   
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModules,
    ModalModule
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SharedModule { }

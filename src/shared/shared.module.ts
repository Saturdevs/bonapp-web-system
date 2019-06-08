import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MDBBootstrapModules } from 'ng-mdb-pro';
import { MDBSpinningPreloader } from 'ng-mdb-pro';
import { ToastModule } from 'ng-mdb-pro/pro/alerts';
import { ApiService } from '../shared/services/api.service';
import { ErrorTemplateComponent } from '../shared/components/error-template/error-template.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    ToastModule.forRoot(),
    MDBBootstrapModules.forRoot(),    
  ],
  declarations: [
    ErrorTemplateComponent
  ],
  providers: [ 
    ApiService,
    MDBSpinningPreloader   
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModules,
    ModalModule,
    ErrorTemplateComponent
  ],
  entryComponents: [
    ErrorTemplateComponent
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SharedModule { }

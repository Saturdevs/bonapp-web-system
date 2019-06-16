import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MDBBootstrapModules } from 'ng-mdb-pro';
import { MDBSpinningPreloader } from 'ng-mdb-pro';
import { ToastModule } from 'ng-mdb-pro/pro/alerts';
import { ApiService } from '../shared/services/api.service';
import { SharedService } from './services/shared.service';
import { ErrorTemplateComponent } from '../shared/components/error-template/error-template.component';
import { DeleteTemplateComponent } from '../shared/components/delete-template/delete-template.component';
import { CancelTemplateComponent } from './components/cancel-template/cancel-template.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    ToastModule.forRoot(),
    MDBBootstrapModules.forRoot(),    
  ],
  declarations: [
    ErrorTemplateComponent,
    DeleteTemplateComponent,
    CancelTemplateComponent
  ],
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
    ModalModule,
    ErrorTemplateComponent,
    DeleteTemplateComponent,
    CancelTemplateComponent
  ],
  entryComponents: [
    ErrorTemplateComponent
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SharedModule { }

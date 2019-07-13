import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MDBBootstrapModulesPro, MDBSpinningPreloader, ToastModule } from 'ng-uikit-pro-standard';
import { ApiService } from '../shared/services/api.service';
import { SharedService } from './services/shared.service';
import { ErrorTemplateComponent } from '../shared/components/error-template/error-template.component';
import { DeleteTemplateComponent } from '../shared/components/delete-template/delete-template.component';
import { CancelTemplateComponent } from './components/cancel-template/cancel-template.component';
import { OrderPreComponent } from '../app/order/order-pre/order-pre.component';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    ToastModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),    
  ],
  declarations: [
    ErrorTemplateComponent,
    DeleteTemplateComponent,
    CancelTemplateComponent,
    OrderPreComponent
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
    MDBBootstrapModulesPro,
    ModalModule,
    ErrorTemplateComponent,
    DeleteTemplateComponent,
    CancelTemplateComponent,
    OrderPreComponent
  ],
  entryComponents: [
    ErrorTemplateComponent
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SharedModule { }

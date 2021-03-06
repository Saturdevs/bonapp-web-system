import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalModule } from 'ngx-bootstrap/modal';
import { MDBBootstrapModulesPro, MDBSpinningPreloader, ToastModule } from 'ng-uikit-pro-standard';
import { ApiService } from '../shared/services/api.service';
import { ErrorTemplateComponent } from '../shared/components/error-template/error-template.component';
import { DeleteTemplateComponent } from '../shared/components/delete-template/delete-template.component';
import { CancelTemplateComponent } from './components/cancel-template/cancel-template.component';
import { TranslateModule } from '@ngx-translate/core';
import { SettingsService } from './services/settings.service';

@NgModule({
  imports: [
    CommonModule,
    ModalModule.forRoot(),
    ToastModule.forRoot(),
    MDBBootstrapModulesPro.forRoot(),  
    BrowserAnimationsModule,
  ],
  declarations: [
    ErrorTemplateComponent,
    DeleteTemplateComponent,
    CancelTemplateComponent
  ],
  providers: [ 
    ApiService,
    MDBSpinningPreloader,
    SettingsService   
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
    TranslateModule
  ],
  entryComponents: [
    ErrorTemplateComponent
  ],
  schemas: [ NO_ERRORS_SCHEMA ]
})
export class SharedModule { }

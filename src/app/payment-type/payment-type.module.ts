import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { PaymentTypeNewComponent } from './payment-type-new/payment-type-new.component';
import { PaymentTypeListComponent } from './payment-type-list/payment-type-list.component';
import { PaymentTypeEditComponent } from './payment-type-edit/payment-type-edit.component';

import { PaymentTypeService } from '../../shared/index';
import { PaymentTypeResolverService } from './payment-type-list/payment-type-resolver.service';
import { PaymentTypeEditResolverService } from './payment-type-edit/payment-type-edit-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    PaymentTypeNewComponent, 
    PaymentTypeListComponent, 
    PaymentTypeEditComponent
  ],
  providers: [
    PaymentTypeService,
    PaymentTypeResolverService,
    PaymentTypeEditResolverService
  ]
})
export class PaymentTypeModule { }

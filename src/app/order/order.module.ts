import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { OrderNewComponent } from './order-new/order-new.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderService } from '../../shared/services/order.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    OrderNewComponent, 
    OrderDetailComponent, 
    OrderListComponent
  ],
  providers: [
    OrderNewComponent, 
    OrderDetailComponent, 
    OrderListComponent,
    OrderService
  ],
  exports: [
    OrderNewComponent
  ]
})
export class OrderModule { }

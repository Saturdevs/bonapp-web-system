import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { OrderNewComponent } from './order-new/order-new.component';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderListComponent } from './order-list/order-list.component';
import { OrderCloseComponent } from './order-close/order-close.component';

import { OrderService } from '../../shared/services/order.service';
import { OrderNewResolverService } from './order-new/order-new-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    OrderNewComponent, 
    OrderDetailComponent, 
    OrderListComponent, 
    OrderCloseComponent
  ],
  providers: [
    OrderService,
    OrderNewResolverService
  ],
  exports: [
    OrderNewComponent
  ]
})
export class OrderModule { }

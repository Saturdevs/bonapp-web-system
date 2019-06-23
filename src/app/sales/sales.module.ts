import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { SalesComponent } from './sales.component';
import { SectionListComponent } from '../section/section-list/section-list.component';
import { TableListComponent } from '../table/table-list/table-list.component';
import { DeliveryComponent } from '../delivery/delivery.component';
import { CounterComponent } from '../counter/counter.component';
import { OrderNewComponent } from '../order/order-new/order-new.component';

import { SectionListResolverService } from '../section/section-list/section-list-resolver.service';
import { TableListResolverService } from '../table/table-list/table-list-resolver.service';
import { DeliveryResolverService } from "../delivery/delivery-resolver.service";
import { OrderNewResolverService } from '../order/order-new/order-new-resolver.service';
import { ProductResolverService } from '../product/product-list/product-resolver.service';
import { MenuResolverService } from '../menu/menu-resolver.service';
import { CategoryResolverService } from '../category/category-list/category-resolver.service';
import { PaymentTypeResolverService } from '../payment-type/payment-type-list/payment-type-resolver.service';
import { CashRegisterAvailablesResolverService } from '../cash-register/resolvers/cash-register-availables-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'orders', 
        component: SalesComponent,
        children: [
          {
            path: '', redirectTo: 'section', pathMatch: 'full'
          },
          {
            path: 'section',
            component: SectionListComponent, 
            children: [
              {
                path: 'tables/:id',
                component: TableListComponent,
                resolve: { tables: TableListResolverService }   
              }                  
            ],
            resolve: { sections: SectionListResolverService }         
          },
          {
            path:'orderNew/:tableNumber',
            component: OrderNewComponent,
            resolve:{ 
                      order: OrderNewResolverService, 
                      products: ProductResolverService,
                      categories: CategoryResolverService,
                      menus: MenuResolverService,
                      cashRegisters: CashRegisterAvailablesResolverService,
                      paymentTypes: PaymentTypeResolverService
                    }
          },
          {
            path: 'delivery',
            component: DeliveryComponent,
            resolve: { clients: DeliveryResolverService }      
          },
          {
            path: 'counter',
            component: CounterComponent 
          }
        ]
      }
    ]),
    SharedModule
  ],
  declarations: [
    SalesComponent
  ]
})
export class SalesModule { }

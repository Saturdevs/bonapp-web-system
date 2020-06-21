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
import { CashRegisterAvailablesResolverService } from '../cash-register/resolvers/cash-register-availables-resolver.service';
import { PaymentTypeAvailableResolverService } from '../payment-type/resolvers/payment-type-available-resolver.service';
import { DailyMenuResolverService } from '../daily-menu/daily-menu-list/daily-menu-resolver.service';
import { MenuAvailablesResolverService } from '../menu/resolvers/menu-availables-resolver.service';
import { AuthGuard } from '../../shared';
import { ProductResolverService } from '../product/product-list/product-resolver.service';
import { MenuResolverService } from '../menu/menu-resolver.service';
import { UsersResolverService } from '../user/user-list/users-resolver-service';

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
                resolve: { tables: TableListResolverService },
                data: { menu: 'section' }
              }
            ],
            resolve: { sections: SectionListResolverService },
            data: { menu: 'section' },
            canActivate: [AuthGuard]
          },
          {
            path: 'orderNew/:tableNumber',
            component: OrderNewComponent,
            resolve: {
              order: OrderNewResolverService,
              products: ProductResolverService,
              menus: MenuAvailablesResolverService,
              cashRegisters: CashRegisterAvailablesResolverService,
              paymentTypes: PaymentTypeAvailableResolverService,
              dailyMenus: DailyMenuResolverService,
              users: UsersResolverService
            },
            data: { menu: 'public' },
            canActivate: [AuthGuard]
          },
          {
            path: 'delivery',
            component: DeliveryComponent,
            resolve: { clients: DeliveryResolverService },
            data: { menu: 'delivery' },
            canActivate: [AuthGuard]
          },
          {
            path: 'counter',
            component: CounterComponent,
            data: { menu: 'counter' },
            canActivate: [AuthGuard]
          }
        ],
        data: { menu: 'orders' }
      }
    ]),
    SharedModule
  ],
  declarations: [
    SalesComponent
  ]
})
export class SalesModule { }

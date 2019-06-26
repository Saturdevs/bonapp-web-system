import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { SalesListComponent } from './sales-list.component';
import { OrderListComponent } from '../order/order-list/order-list.component';
import { CashFlowsListComponent } from '../cash-flows/cash-flows-list/cash-flows-list.component';
import { CashFlowsEditComponent } from '../cash-flows/cash-flows-edit/cash-flows-edit.component';
import { CashFlowsNewComponent } from '../cash-flows/cash-flows-new/cash-flows-new.component';
import { ArqueoCajaListComponent } from '../arqueo-caja/arqueo-caja-list/arqueo-caja-list.component';
import { ArqueoCajaEditComponent } from '../arqueo-caja/arqueo-caja-edit/arqueo-caja-edit.component';
import { ArqueoCajaNewComponent } from '../arqueo-caja/arqueo-caja-new/arqueo-caja-new.component';
import { SelectItemComponent } from '../select-item/select-item.component';

import { CashFlowResolverService } from '../cash-flows/cash-flows-list/cash-flow-resolver.service';
import { CashFlowEditResolverService } from '../cash-flows/cash-flows-edit/cash-flow-edit-resolver.service';
import { CashRegisterResolverService } from '../cash-register/cash-register-list/cash-register-resolver.service';
import { PaymentTypeResolverService } from '../payment-type/payment-type-list/payment-type-resolver.service';
import { ArqueoCajaResolverService } from '../arqueo-caja/arqueo-caja-list/arqueo-caja-resolver.service';
import { ArqueoCajaEditResolverService } from '../arqueo-caja/arqueo-caja-edit/arqueo-caja-edit-resolver.service';
import { CashRegisterAvailablesResolverService } from '../cash-register/resolvers/cash-register-availables-resolver.service';
import { PaymentTypeAvailableResolverService } from '../payment-type/resolvers/payment-type-available-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'sales',
        component: SalesListComponent,
        children: [
          {
            path: '', redirectTo: 'sales-list', pathMatch: 'full'
          },
          {
            path: 'sales-list',
            component: OrderListComponent            
          },
          {
            path: 'cash-flows',
            component: CashFlowsListComponent,
            resolve: { 
                      cashFlows: CashFlowResolverService, 
                      cashRegisters: CashRegisterResolverService
                     },
            children: [
              {
                path: 'editCashFlow/:id',
                component: CashFlowsEditComponent,
                resolve: { 
                          cashFlow: CashFlowEditResolverService, 
                          cashRegisters: CashRegisterAvailablesResolverService, 
                          paymentTypes: PaymentTypeResolverService 
                        },
                outlet: 'edit'
              },
              {
                path: 'newCashFlow',
                component: CashFlowsNewComponent,
                resolve: { 
                          cashRegisters: CashRegisterAvailablesResolverService, 
                          paymentTypes: PaymentTypeAvailableResolverService 
                         },
                outlet: 'edit'
              },
              {
                path: 'selectItem',
                component: SelectItemComponent,
                outlet: 'edit'
              }              
            ]
          },
          {
            path: 'cash-counts',
            component: ArqueoCajaListComponent,
            resolve: {
                      arqueos: ArqueoCajaResolverService,
                      cashRegisters: CashRegisterResolverService
            },
            children: [
              {
                path: 'editCashCount/:id',
                component: ArqueoCajaEditComponent,
                resolve: {
                  arqueo: ArqueoCajaEditResolverService,
                  cashRegisters: CashRegisterAvailablesResolverService, 
                  paymentTypes: PaymentTypeResolverService 
                },
                outlet: 'edit'
              },
              {
                path: 'newCashCount',
                component: ArqueoCajaNewComponent,
                resolve: {
                  cashRegisters: CashRegisterAvailablesResolverService
                },
                outlet: 'edit'
              },
              {
                path: 'selectItem',
                component: SelectItemComponent,
                outlet: 'edit'
              }               
            ]
          }
        ]
      }
    ]),
    SharedModule
  ],
  declarations: [
    SalesListComponent
  ]
})
export class SalesListModule { } 

import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { ClientModuleComponent } from './client-module.component';
import { ClientListComponent } from '../client/client-list/client-list.component';
import { ClientNewComponent } from '../client/client-new/client-new.component';
import { ClientEditComponent } from '../client/client-edit/client-edit.component';
import { TransactionListComponent } from '../client-account-transactions/transaction-list/transaction-list.component';
import { TransactionNewComponent } from '../client-account-transactions/transaction-new/transaction-new.component';
import { TransactionDetailComponent } from '../client-account-transactions/transaction-detail/transaction-detail.component';
import { SelectItemComponent } from '../select-item/select-item.component';

import { ClientResolverService } from '../client/client-list/client-resolver.service';
import { ClientEditResolverService } from '../client/client-edit/client-edit-resolver.service';
import { TransactionResolverService } from '../client-account-transactions/transaction-list/transaction-resolver.service';
import { TransactionDetailResolverService } from '../client-account-transactions/transaction-detail/transaction-detail-resolver.service';
import { CashRegisterResolverService } from '../cash-register/cash-register-list/cash-register-resolver.service';
import { PaymentTypeResolverService } from '../payment-type/payment-type-list/payment-type-resolver.service';
import { ClientWithTransactionsResolverService } from '../client-account-transactions/transaction-list/client-with-transactions-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'clients-module',
        component: ClientModuleComponent,
        children: [
          {
            path: '', redirectTo: '/clients-module/clients/(edit:selectItem)', pathMatch: 'full'
          },
          {
            path: 'clients',
            component: ClientListComponent,   
            resolve: {
              clients: ClientResolverService
            },        
            children: [
              {
                path: 'editClient/:id',
                component: ClientEditComponent,
                resolve: {
                  client: ClientEditResolverService
                },
                outlet: 'edit'
              },
              {
                path: 'newClient',
                component: ClientNewComponent,
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
            path: 'accountTransactions',
            component: TransactionListComponent,   
            resolve: {
              transactions: TransactionResolverService,
              clientsWithTransactions: ClientWithTransactionsResolverService
            },        
            children: [
              {
                path: 'editTransaction/:idClient/:idTransaction',
                component: TransactionDetailComponent,
                resolve: {
                  transaction: TransactionDetailResolverService
                },
                outlet: 'edit'
              },
              {
                path: 'newTransaction',
                component: TransactionNewComponent,
                resolve: {
                  cashRegisters: CashRegisterResolverService, 
                  paymentTypes: PaymentTypeResolverService,
                  clients: ClientResolverService
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
    ClientModuleComponent
  ]
})
export class ClientModuleModule { }

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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
import { CashRegisterAvailablesResolverService } from '../cash-register/resolvers/cash-register-availables-resolver.service';
import { ClientCurrentAccountResolverService } from '../client/resolvers/client-current-account-resolver.service';
import { PaymentTypeAvailableResolverService } from '../payment-type/resolvers/payment-type-available-resolver.service';
import { AuthGuard } from '../../shared';

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
                outlet: 'edit',
                data: { menu: 'clients-edit' },
                canActivate: [AuthGuard]
              },
              {
                path: 'newClient',
                component: ClientNewComponent,
                outlet: 'edit',
                data: { menu: 'clients-new' },
                canActivate: [AuthGuard]
              },
              {
                path: 'selectItem',
                component: SelectItemComponent,
                outlet: 'edit'
              }
            ],
            data: { menu: 'clients' },
            canActivate: [AuthGuard]
          },
          {
            path: 'current-accounts',
            component: TransactionListComponent,
            resolve: {
              transactions: TransactionResolverService,
              clientsWithTransactionsEnabled: ClientCurrentAccountResolverService
            },
            children: [
              {
                path: 'editTransaction/:idTransaction',
                component: TransactionDetailComponent,
                resolve: {
                  transaction: TransactionDetailResolverService
                },
                outlet: 'edit',
                data: { menu: 'current-accounts-transaction-detail' },
                canActivate: [AuthGuard]
              },
              {
                path: 'newTransaction',
                component: TransactionNewComponent,
                resolve: {
                  cashRegisters: CashRegisterAvailablesResolverService,
                  paymentTypes: PaymentTypeAvailableResolverService,
                  clients: ClientCurrentAccountResolverService
                },
                outlet: 'edit',
                data: { menu: 'current-accounts-transaction-new' },
                canActivate: [AuthGuard]
              },
              {
                path: 'selectItem',
                component: SelectItemComponent,
                outlet: 'edit'
              }
            ],
            data: { menu: 'current-accounts' },
            canActivate: [AuthGuard]
          }
        ],
        data: { menu: 'clients-module' },
        canActivate: [AuthGuard]
      }
    ]),
    SharedModule
  ],
  declarations: [
    ClientModuleComponent
  ]
})
export class ClientModuleModule { }

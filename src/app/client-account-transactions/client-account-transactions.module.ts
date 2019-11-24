import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionNewComponent } from './transaction-new/transaction-new.component';
import { TransactionDetailComponent } from './transaction-detail/transaction-detail.component';

import { ClientService } from '../../shared/services/client.service';
import { TransactionResolverService } from './transaction-list/transaction-resolver.service';
import { TransactionDetailResolverService } from './transaction-detail/transaction-detail-resolver.service';
import { TransactionService } from '../../shared/services/transaction.service';
import { ClientCurrentAccountResolverService } from '../client/resolvers/client-current-account-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    TransactionListComponent, 
    TransactionNewComponent, 
    TransactionDetailComponent
  ],
  providers: [
    ClientService,
    TransactionService,
    TransactionResolverService,
    TransactionDetailResolverService,
    ClientCurrentAccountResolverService
  ]
})
export class ClientAccountTransactionsModule { }

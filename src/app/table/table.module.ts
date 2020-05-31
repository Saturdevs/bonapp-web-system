import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';
import { NgGridModule } from 'angular2-grid';

import { SharedModule } from '../../shared/shared.module';

import { TableListComponent } from './table-list/table-list.component';
import { TableEditComponent } from './table-edit/table-edit.component';
import { TableNewComponent } from './table-new/table-new.component';

import { TableService } from '../../shared/services/table.service';
import { TableListResolverService } from './table-list/table-list-resolver.service';
import { TableAllResolverService } from './table-list/table-all-resolver.service';

import { OrderModule } from '../order/order.module';
import { PinAuthenticateModule } from '../pin-authenticate/pin-authenticate.module';

@NgModule({
  imports: [
    RouterModule.forChild([

    ]),
    SharedModule,
    NgGridModule,
    OrderModule,
    PinAuthenticateModule
  ],
  exports: [
    RouterModule
  ],
  declarations: [
    TableListComponent, 
    TableEditComponent, 
    TableNewComponent
  ],
  providers: [
    TableService,
    TableListResolverService,
    TableAllResolverService
  ]
})
export class TableModule { }

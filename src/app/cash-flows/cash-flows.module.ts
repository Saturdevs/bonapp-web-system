import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { DatePickerModule } from '../../shared/components/date-picker/date-picker.module';
import { DatePickerComponent } from '../../shared/components/date-picker/date-picker.component'

import { CashFlowsListComponent } from './cash-flows-list/cash-flows-list.component';
import { CashFlowsEditComponent } from './cash-flows-edit/cash-flows-edit.component';
import { CashFlowsNewComponent } from './cash-flows-new/cash-flows-new.component';

import { CashFlowService } from '../../shared/index';
import { CashFlowResolverService } from './cash-flows-list/cash-flow-resolver.service';
import { CashFlowEditResolverService } from './cash-flows-edit/cash-flow-edit-resolver.service';
import { CashFlowSearchPipe } from "../../shared/pipes/cash-flow-search.pipe";

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule,
    DatePickerModule
  ],
  declarations: [
    CashFlowsListComponent,
    CashFlowsEditComponent,
    CashFlowsNewComponent,
    CashFlowSearchPipe
  ],
  providers: [
    CashFlowService,
    CashFlowResolverService,
    CashFlowEditResolverService
  ]
})
export class CashFlowsModule { }

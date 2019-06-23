import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { CashRegisterEditComponent } from './cash-register-edit/cash-register-edit.component';
import { CashRegisterNewComponent } from './cash-register-new/cash-register-new.component';
import { CashRegisterListComponent } from './cash-register-list/cash-register-list.component';

import { CashRegisterService } from '../../shared/index';
import { CashRegisterResolverService } from './cash-register-list/cash-register-resolver.service';
import { CashRegisterEditResolverService } from './cash-register-edit/cash-register-edit-resolver.service';
import { CashRegisterAvailablesResolverService } from './resolvers/cash-register-availables-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    CashRegisterEditComponent, 
    CashRegisterNewComponent, 
    CashRegisterListComponent
  ],
  providers: [
    CashRegisterService,
    CashRegisterResolverService,
    CashRegisterAvailablesResolverService,
    CashRegisterEditResolverService
  ]
})
export class CashRegisterModule { }

import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { SettingsComponent } from './settings.component';
import { TableListComponent } from '../table/table-list/table-list.component';
import { GeneralSettingsComponent } from '../general-settings/general-settings.component';
import { SectionListComponent } from '../section/section-list/section-list.component';
import { SectionNewComponent } from '../section/section-new/section-new.component';
import { SectionEditComponent } from '../section/section-edit/section-edit.component';
import { SectionListConfigComponent } from '../section/section-list-config/section-list-config.component';
import { SizeListComponent } from '../size/size-list/size-list.component';
import { SizeNewComponent } from '../size/size-new/size-new.component';
import { SizeEditComponent } from '../size/size-edit/size-edit.component';
import { PaymentTypeListComponent } from '../payment-type/payment-type-list/payment-type-list.component';
import { PaymentTypeNewComponent } from '../payment-type/payment-type-new/payment-type-new.component';
import { PaymentTypeEditComponent } from '../payment-type/payment-type-edit/payment-type-edit.component';
import { CashRegisterListComponent } from '../cash-register/cash-register-list/cash-register-list.component';
import { CashRegisterNewComponent } from '../cash-register/cash-register-new/cash-register-new.component';
import { CashRegisterEditComponent } from '../cash-register/cash-register-edit/cash-register-edit.component';
import { SelectItemComponent } from '../select-item/select-item.component';

import { TableListResolverService } from '../table/table-list/table-list-resolver.service';
import { TableAllResolverService } from '../table/table-list/table-all-resolver.service';
import { SectionListResolverService } from '../section/section-list/section-list-resolver.service';
import { SectionEditResolverService } from '../section/section-edit/section-edit-resolver.service';
import { SizeResolverService } from '../size/size-list/size-resolver.service';
import { SizeEditResolverService } from '../size/size-edit/size-edit-resolver.service';
import { PaymentTypeResolverService } from '../payment-type/payment-type-list/payment-type-resolver.service';
import { PaymentTypeEditResolverService } from '../payment-type/payment-type-edit/payment-type-edit-resolver.service';
import { CashRegisterResolverService } from '../cash-register/cash-register-list/cash-register-resolver.service';
import { CashRegisterEditResolverService } from '../cash-register/cash-register-edit/cash-register-edit-resolver.service';
import { SectionListGuardService } from '../section/section-list/section-list-guard.service';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: '', redirectTo: 'general', pathMatch: 'full'
          },
          {
            path: 'general',
            component: GeneralSettingsComponent,
            children: [
              {
                path: 'sizes',
                component: SizeListComponent,
                resolve: { sizes: SizeResolverService },
                children: [                  
                  {
                    path: 'editSize/:id',
                    component: SizeEditComponent,
                    resolve: { size: SizeEditResolverService },
                    outlet: 'edit'
                  }, 
                  {
                    path: 'newSize',
                    component: SizeNewComponent,
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
                path: 'paymentTypes',                
                component: PaymentTypeListComponent,
                resolve: { paymentTypes: PaymentTypeResolverService },
                children: [
                  {
                    path: 'editPaymentType/:id',
                    component: PaymentTypeEditComponent,
                    resolve: { paymentType: PaymentTypeEditResolverService },
                    outlet: 'edit'
                  },
                  {
                    path: 'newPaymentType',
                    component: PaymentTypeNewComponent,
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
                path: 'cashRegisters',                
                component: CashRegisterListComponent,
                resolve: { cashRegisters: CashRegisterResolverService },
                children: [
                  {
                    path: 'editCashRegister/:id',
                    component: CashRegisterEditComponent,
                    resolve: { cashRegister: CashRegisterEditResolverService },
                    outlet: 'edit'
                  },
                  {
                    path: 'newCashRegister',
                    component: CashRegisterNewComponent,
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
                path: 'sections',                
                component: SectionListConfigComponent,
                resolve: { sections: SectionListResolverService },
                children: [
                  {
                    path: 'editSection/:id',
                    component: SectionEditComponent,
                    resolve: { section: SectionEditResolverService },
                    outlet: 'edit'
                  },
                  {
                    path: 'newSection',
                    component: SectionNewComponent,
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
          },
          {
            path: 'section',
            component: SectionListComponent, 
            canDeactivate: [SectionListGuardService],
            children: [
              {
                path: 'tables/:id',
                component: TableListComponent,
                resolve: { tables: TableListResolverService, totalTables: TableAllResolverService }                                
              },
              {
                path: 'newSection',
                component: SectionNewComponent
              }
            ],
            resolve: { sections: SectionListResolverService }         
          }
        ]
      }     
    ]),
    SharedModule
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule { }
 
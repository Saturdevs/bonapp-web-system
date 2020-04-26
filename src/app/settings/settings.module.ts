import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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
import { UserRolesListComponent } from '../user-roles/user-roles-list/user-roles-list.component';
import { UserRolesEditComponent } from '../user-roles/user-roles-edit/user-roles-edit.component';
import { UserRolesNewComponent } from '../user-roles/user-roles-new/user-roles-new.component';

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
import { AuthGuard } from '../../shared';
import { UserRolesResolverService } from '../user-roles/user-roles-list/user-roles-resolver.service';
import { UserRolesEditResolverService } from '../user-roles/user-roles-edit/user-roles-edit-resolver.service';
import { UserListComponent } from '../user/user-list/user-list.component';
import { UserEditComponent } from '../user/user-edit/user-edit.component';
import { UserNewComponent } from '../user/user-new/user-new.component';
import { UsersResolverService } from '../user/user-list/users-resolver-service';
import { UsersNewResolverService } from '../user/user-new/user-new-resolver.service';
import { UserEditResolverService } from '../user/user-edit/user-edit-resolver.service';


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'settings',
        component: SettingsComponent,
        children: [
          {
            path: '', redirectTo: 'general-settings', pathMatch: 'full'
          },
          {
            path: 'general-settings',
            component: GeneralSettingsComponent,
            children: [
              {
                path: 'size',
                component: SizeListComponent,
                resolve: { sizes: SizeResolverService },
                children: [
                  {
                    path: 'editSize/:id',
                    component: SizeEditComponent,
                    resolve: { size: SizeEditResolverService },
                    outlet: 'edit',
                    data: { menu: 'size-edit' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'newSize',
                    component: SizeNewComponent,
                    outlet: 'edit',
                    data: { menu: 'size-new' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'selectItem',
                    component: SelectItemComponent,
                    outlet: 'edit'
                  }
                ],
                data: { menu: 'size' },
                canActivate: [AuthGuard]
              },
              {
                path: 'payment-types',
                component: PaymentTypeListComponent,
                resolve: { paymentTypes: PaymentTypeResolverService },
                children: [
                  {
                    path: 'editPaymentType/:id',
                    component: PaymentTypeEditComponent,
                    resolve: { paymentType: PaymentTypeEditResolverService },
                    outlet: 'edit',
                    data: { menu: 'payment-types-edit' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'newPaymentType',
                    component: PaymentTypeNewComponent,
                    outlet: 'edit',
                    data: { menu: 'payment-types-new' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'selectItem',
                    component: SelectItemComponent,
                    outlet: 'edit'
                  }
                ],
                data: { menu: 'payment-types' },
                canActivate: [AuthGuard]
              },
              {
                path: 'users',
                component: UserListComponent,
                resolve: { users: UsersResolverService },
                children: [
                  {
                    path: 'editUser/:id',
                    component: UserEditComponent,
                    resolve: { userRoles: UsersNewResolverService,
                               user: UserEditResolverService },                    
                    outlet: 'edit',
                    data: { menu: 'users-edit' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'newUser',
                    component: UserNewComponent,
                    resolve: { userRoles: UsersNewResolverService },
                    outlet: 'edit',
                    data: { menu: 'users-new' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'selectItem',
                    component: SelectItemComponent,
                    outlet: 'edit'
                  }
                ],
                data: { menu: 'users' },
                canActivate: [AuthGuard]
              },
              {
                path: 'cash-register',
                component: CashRegisterListComponent,
                resolve: { cashRegisters: CashRegisterResolverService },
                children: [
                  {
                    path: 'editCashRegister/:id',
                    component: CashRegisterEditComponent,
                    resolve: { cashRegister: CashRegisterEditResolverService },
                    outlet: 'edit',
                    data: { menu: 'cash-register-edit' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'newCashRegister',
                    component: CashRegisterNewComponent,
                    outlet: 'edit',
                    data: { menu: 'cash-register-new' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'selectItem',
                    component: SelectItemComponent,
                    outlet: 'edit'
                  }
                ],
                data: { menu: 'cash-register' },
                canActivate: [AuthGuard]
              },
              {
                path: 'roles-users',
                component: UserRolesListComponent,
                resolve: { userRoles: UserRolesResolverService },
                children: [
                  {
                    path: 'editUserRole/:id',
                    component: UserRolesEditComponent,
                    resolve: { userRole: UserRolesEditResolverService },
                    outlet: 'edit',
                    data: { menu: 'roles-users-edit' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'newUserRole',
                    component: UserRolesNewComponent,
                    outlet: 'edit',
                    data: { menu: 'roles-users-new' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'selectItem',
                    component: SelectItemComponent,
                    outlet: 'edit'
                  }
                ],
                data: { menu: 'roles-users' },
                canActivate: [AuthGuard]
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
                    outlet: 'edit',
                    data: { menu: 'sections-edit' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'newSection',
                    component: SectionNewComponent,
                    outlet: 'edit',
                    data: { menu: 'sections-new' },
                    canActivate: [AuthGuard]
                  },
                  {
                    path: 'selectItem',
                    component: SelectItemComponent,
                    outlet: 'edit'
                  }
                ],
                data: { menu: 'sections' },
                canActivate: [AuthGuard]
              }
            ],
            data: { menu: 'general-settings' },
            canActivate: [AuthGuard]
          },
          {
            path: 'tables-section',
            component: SectionListComponent,
            canDeactivate: [SectionListGuardService],
            children: [
              {
                path: 'tables/:id',
                component: TableListComponent,
                resolve: { tables: TableListResolverService, totalTables: TableAllResolverService }
              }
            ],
            resolve: { sections: SectionListResolverService },
            data: { menu: 'tables-section' },
            canActivate: [AuthGuard]
          }
        ],
        data: { menu: 'settings' },
        canActivate: [AuthGuard]
      }
    ]),
    SharedModule
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule { }

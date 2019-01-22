import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { SupplierModuleComponent } from './supplier-module.component';
import { SupplierListComponent } from '../supplier/supplier-list/supplier-list.component';
import { SupplierNewComponent } from '../supplier/supplier-new/supplier-new.component';
import { SupplierEditComponent } from '../supplier/supplier-edit/supplier-edit.component';
import { SelectItemComponent } from '../select-item/select-item.component';

import { SupplierResolverService } from '../supplier/supplier-list/supplier-resolver.service';
import { SupplierEditResolverService } from '../supplier/supplier-edit/supplier-edit-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'suppliers-module',
        component: SupplierModuleComponent,
        children: [
          {
            path: '', redirectTo: '/suppliers-module/suppliers/(edit:selectItem)', pathMatch: 'full'
          },
          {
            path: 'suppliers',
            component: SupplierListComponent,   
            resolve: {
              suppliers: SupplierResolverService
            },        
            children: [
              {
                path: 'editSupplier/:id',
                component: SupplierEditComponent,
                resolve: {
                  supplier: SupplierEditResolverService
                },
                outlet: 'edit'
              },
              {
                path: 'newSupplier',
                component: SupplierNewComponent,
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
    SupplierModuleComponent
  ]
})
export class SupplierModuleModule { }

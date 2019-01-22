import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { SupplierListComponent } from './supplier-list/supplier-list.component';
import { SupplierNewComponent } from './supplier-new/supplier-new.component';
import { SupplierEditComponent } from './supplier-edit/supplier-edit.component';

import { SupplierService } from '../../shared/services/supplier.service';
import { SupplierResolverService } from './supplier-list/supplier-resolver.service';
import { SupplierEditResolverService } from './supplier-edit/supplier-edit-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    SupplierListComponent, 
    SupplierNewComponent, 
    SupplierEditComponent
  ],
  providers: [
    SupplierService,
    SupplierResolverService,
    SupplierEditResolverService
  ]
})
export class SupplierModule { }

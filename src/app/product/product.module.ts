import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { ProductListComponent } from './product-list/product-list.component';
import { ProductNewComponent } from './product-new/product-new.component';
import { ProductModifyComponent } from './product-modify/product-modify.component';

import { ProductService } from '../../shared/services/product.service';
import { ProductEditGuardService } from './product-modify/product-modify-guard.service';
import { ProductNewGuardService } from './product-new/product-new-guard.service';
import { ProductResolverService } from './product-list/product-resolver.service';
import { ProductModifyResolverService } from './product-modify/product-modify-resolver.service';
import { CategoryResolverService } from '../category/category-list/category-resolver.service';
import { FileInputModule } from '../file-input/file-input.module';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule,
    FileInputModule
  ],
  declarations: [
    ProductListComponent,
    ProductModifyComponent,
    ProductNewComponent,
  ],
  providers: [ 
    ProductService,
    ProductNewGuardService,
    ProductEditGuardService,
    ProductModifyResolverService,
    ProductResolverService 
  ]
})
export class ProductModule { }

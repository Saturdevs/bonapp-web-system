import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { CategoryComponent } from './category-list/category.component';
import { CategoryNewComponent } from './category-new/category-new.component';
import { CategoryModifyComponent } from './category-modify/category-modify.component';

import { CategoryService } from '../../shared/services/category.service';
import { ProductService } from '../../shared/services/product.service';
import { CategoryResolverService } from './category-list/category-resolver.service';
import { CategoryModifyResolverService } from './category-modify/category-modify-resolver.service';
import { MenuResolverService } from '../menu/menu-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      
    ]),
    SharedModule
  ],
  declarations: [
    CategoryComponent,
    CategoryNewComponent,
    CategoryModifyComponent
  ],
  providers: [
    CategoryService,
    ProductService,
    CategoryResolverService,
    CategoryModifyResolverService,
    MenuResolverService
  ]
})
export class CategoryModule { }

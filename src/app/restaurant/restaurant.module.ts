import { NgModule } from '@angular/core';
import { RouterModule} from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { RestaurantComponent } from './restaurant.component';
import { MenuComponent } from '../menu/menu.component';
import { MenuNewComponent } from '../menu/menu-new/menu-new.component';
import { MenuModifyComponent } from '../menu/menu-modify/menu-modify.component';
import { CategoryComponent } from '../category/category-list/category.component';
import { CategoryNewComponent } from '../category/category-new/category-new.component';
import { CategoryModifyComponent } from '../category/category-modify/category-modify.component';
import { ProductListComponent } from '../product/product-list/product-list.component';
import { ProductNewComponent } from '../product/product-new/product-new.component';
import { ProductModifyComponent } from '../product/product-modify/product-modify.component';

import { MenuResolverService } from '../menu/menu-resolver.service';
import { MenuModifyResolverService } from '../menu/menu-modify/menu-modify-resolver.service';
import { CategoryResolverService } from '../category/category-list/category-resolver.service';
import { CategoryModifyResolverService } from '../category/category-modify/category-modify-resolver.service';
import { ProductResolverService } from '../product/product-list/product-resolver.service';
import { ProductModifyResolverService } from '../product/product-modify/product-modify-resolver.service';
import { ProductEditGuardService } from '../product/product-modify/product-modify-guard.service';
import { ProductNewGuardService } from '../product/product-new/product-new-guard.service';
import { CategoryHasproductResolverService } from '../category/resolvers/category-hasproduct-resolver.service';
import { MenuHascategoryResolverService } from '../menu/resolvers/menu-hascategory-resolver.service';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: 'restaurant',
        component: RestaurantComponent,
        children: [
          {
            path: '', redirectTo: 'menu', pathMatch: 'full'
          },
          {
            path: 'menu', 
            children: [
              {
                path: '',
                component: MenuComponent,
                resolve: { menus: MenuResolverService }
              },
              { 
                path: 'newMenu', 
                component: MenuNewComponent 
              },
              { path: 'edit/:id', 
                component: MenuModifyComponent,
                resolve: { 
                  menu: MenuModifyResolverService,
                  category: MenuHascategoryResolverService
                } 
              } 
            ]            
          },
          {
            path: 'category', 
            children: [
              {
                path: '',
                component: CategoryComponent,
                resolve: { categories: CategoryResolverService, menus: MenuResolverService }
              },
              { 
                path: 'newCategory', 
                component: CategoryNewComponent,
                resolve: {
                  menus: MenuResolverService
                }
              },
              { path: 'edit/:id', 
                component: CategoryModifyComponent, 
                resolve: {
                  category: CategoryModifyResolverService, 
                  menus: MenuResolverService,
                  product: CategoryHasproductResolverService
                } 
              }
            ]            
          },
          { 
            path: 'product', 
            children: [
              {
                path: '',
                component: ProductListComponent,
                resolve: { products: ProductResolverService, categories: CategoryResolverService }
              },
              { 
                path: 'newProduct', 
                canDeactivate: [ ProductNewGuardService ],
                component: ProductNewComponent },
              { path: 'edit/:id', 
                canDeactivate: [ ProductEditGuardService ], 
                component: ProductModifyComponent,
                resolve: { product: ProductModifyResolverService, categories: CategoryResolverService }
              }
            ]            
          }
        ]
      }
    ]),
    SharedModule
  ],
  declarations: [
    RestaurantComponent
  ]
})
export class RestaurantModule { }

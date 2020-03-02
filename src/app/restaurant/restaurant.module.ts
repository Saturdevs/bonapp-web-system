import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

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
import { SizeResolverService } from '../size/size-list/size-resolver.service';
import { MenuAvailablesResolverService } from '../menu/resolvers/menu-availables-resolver.service';
import { CategoryAvailablesResolverService } from '../category/resolvers/category-availables-resolver.service';
import { AuthGuard } from '../../shared';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'restaurant',
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
                resolve: { menus: MenuResolverService },
                data: { menu: 'menu-list' },
                canActivate: [AuthGuard]
              },
              {
                path: 'newMenu',
                component: MenuNewComponent,
                data: { menu: 'menu-new' },
                canActivate: [AuthGuard]
              },
              {
                path: 'edit/:id',
                component: MenuModifyComponent,
                resolve: {
                  menu: MenuModifyResolverService
                },
                data: { menu: 'menu-new' },
                canActivate: [AuthGuard]
              }
            ],
            data: { menu: 'menu' },
            canActivate: [AuthGuard]
          },
          {
            path: 'category',
            children: [
              {
                path: '',
                component: CategoryComponent,
                resolve: { categories: CategoryResolverService, menus: MenuResolverService },
                data: { menu: 'category-list' },
                canActivate: [AuthGuard]
              },
              {
                path: 'newCategory',
                component: CategoryNewComponent,
                resolve: {
                  menus: MenuAvailablesResolverService
                },
                data: { menu: 'category-new' },
                canActivate: [AuthGuard]
              },
              {
                path: 'edit/:id',
                component: CategoryModifyComponent,
                resolve: {
                  category: CategoryModifyResolverService,
                  menus: MenuResolverService
                },
                data: { menu: 'category-edit' },
                canActivate: [AuthGuard]
              }
            ],
            data: { menu: 'category' },
            canActivate: [AuthGuard]
          },
          {
            path: 'product',
            children: [
              {
                path: '',
                component: ProductListComponent,
                resolve: {
                  products: ProductResolverService,
                  categories: CategoryResolverService
                },
                data: { menu: 'product-list' },
                canActivate: [AuthGuard]
              },
              {
                path: 'newProduct',
                canDeactivate: [ProductNewGuardService],
                component: ProductNewComponent,
                resolve: {
                  sizes: SizeResolverService,
                  categories: CategoryAvailablesResolverService
                },
                data: { menu: 'product-new' },
                canActivate: [AuthGuard]
              },
              {
                path: 'edit/:id',
                canDeactivate: [ProductEditGuardService],
                component: ProductModifyComponent,
                resolve: {
                  product: ProductModifyResolverService,
                  sizes: SizeResolverService,
                  categories: CategoryResolverService
                },
                data: { menu: 'product-edit' },
                canActivate: [AuthGuard]
              }
            ],
            data: { menu: 'product' },
            canActivate: [AuthGuard]
          }
        ],
        data: { menu: 'restaurant' },
        canActivate: [AuthGuard]
      }
    ]),
    SharedModule
  ],
  declarations: [
    RestaurantComponent
  ]
})
export class RestaurantModule { }

import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs/Observable';

import { Product } from '../../../shared/models/product';
import { ProductService } from '../../../shared/services/product.service';

@Injectable()
export class ProductResolverService implements Resolve<Product[]> {

  constructor(private _productService: ProductService) { }

  resolve(route: ActivatedRouteSnapshot, satate: RouterStateSnapshot): Observable<Product[]> {
    console.log('asd');
    
    return this._productService.getAll();
  }

}

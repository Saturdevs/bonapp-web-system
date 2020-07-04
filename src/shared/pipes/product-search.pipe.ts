import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../models';

@Pipe({
  name: 'productSearch'
})
export class ProductSearchPipe implements PipeTransform {

  transform(productItems: Array<Product>, name: string, categoryId: string): Array<Product> {
    if (productItems && productItems.length) {
      return productItems.filter(product => {
        if (name && name !== 'default' && product.name.toLowerCase().indexOf(name.toLowerCase()) === -1) {
          return false;
        }
        if (categoryId && categoryId !== 'default' && product.category._id.toLowerCase().indexOf(categoryId.toLowerCase()) === -1) {
          return false;
        }
        return true;
      })
    } else {
      return productItems;
    }
  }

}

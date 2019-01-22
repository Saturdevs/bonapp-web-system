import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router'

import { ProductModifyComponent } from './product-modify.component'

@Injectable()
export class ProductEditGuardService implements CanDeactivate<ProductModifyComponent> {

  constructor(private router: Router) { }

  canDeactivate(component: ProductModifyComponent): boolean {
    if (component.productForm.dirty && component.clickAceptar === false) {
      let productName = component.productNameModified;
      return confirm(`Editando producto ${productName} ¿Desea abandonar la página sin guardar los cambios?`);
    }
    return true
  }
}

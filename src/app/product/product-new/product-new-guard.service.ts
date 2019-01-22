import { Injectable } from '@angular/core';
import { Router, CanDeactivate } from '@angular/router'

import { ProductNewComponent } from './product-new.component'

@Injectable()
export class ProductNewGuardService implements CanDeactivate<ProductNewComponent> {

  constructor(private router: Router) { }

  canDeactivate(component: ProductNewComponent): boolean {
    if (component.productForm.dirty && component.clickAceptar === false) {
      return confirm(`Está creando un nuevo producto ¿Desea abandonar la página sin guardar los cambios?`);
    }
    return true
  }

}

import { TestBed } from '@angular/core/testing';

import { ProductOrderResolverService } from './product-order-resolver.service';

describe('ProductOrderResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProductOrderResolverService = TestBed.get(ProductOrderResolverService);
    expect(service).toBeTruthy();
  });
});

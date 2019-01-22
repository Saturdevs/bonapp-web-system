import { TestBed, inject } from '@angular/core/testing';

import { ProductModifyResolverService } from './product-modify-resolver.service';

describe('ProductModifyResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductModifyResolverService]
    });
  });

  it('should be created', inject([ProductModifyResolverService], (service: ProductModifyResolverService) => {
    expect(service).toBeTruthy();
  }));
});

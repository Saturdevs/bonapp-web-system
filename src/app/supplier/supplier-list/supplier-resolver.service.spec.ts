import { TestBed, inject } from '@angular/core/testing';

import { SupplierResolverService } from './supplier-resolver.service';

describe('SupplierResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplierResolverService]
    });
  });

  it('should be created', inject([SupplierResolverService], (service: SupplierResolverService) => {
    expect(service).toBeTruthy();
  }));
});

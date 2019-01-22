import { TestBed, inject } from '@angular/core/testing';

import { SupplierEditResolverService } from './supplier-edit-resolver.service';

describe('SupplierEditResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SupplierEditResolverService]
    });
  });

  it('should be created', inject([SupplierEditResolverService], (service: SupplierEditResolverService) => {
    expect(service).toBeTruthy();
  }));
});

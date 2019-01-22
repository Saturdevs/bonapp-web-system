import { TestBed, inject } from '@angular/core/testing';

import { ProductNewGuardService } from './product-new-guard.service';

describe('ProductNewGuardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProductNewGuardService]
    });
  });

  it('should be created', inject([ProductNewGuardService], (service: ProductNewGuardService) => {
    expect(service).toBeTruthy();
  }));
});

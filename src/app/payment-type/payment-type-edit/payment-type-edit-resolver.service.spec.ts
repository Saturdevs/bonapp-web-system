import { TestBed, inject } from '@angular/core/testing';

import { PaymentTypeEditResolverService } from './payment-type-edit-resolver.service';

describe('PaymentTypeEditResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentTypeEditResolverService]
    });
  });

  it('should be created', inject([PaymentTypeEditResolverService], (service: PaymentTypeEditResolverService) => {
    expect(service).toBeTruthy();
  }));
});

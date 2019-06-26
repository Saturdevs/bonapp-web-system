import { TestBed, inject } from '@angular/core/testing';

import { PaymentTypeAvailableResolverService } from './payment-type-available-resolver.service';

describe('PaymentTypeAvailableResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentTypeAvailableResolverService]
    });
  });

  it('should be created', inject([PaymentTypeAvailableResolverService], (service: PaymentTypeAvailableResolverService) => {
    expect(service).toBeTruthy();
  }));
});

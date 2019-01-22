import { TestBed, inject } from '@angular/core/testing';

import { PaymentTypeResolverService } from './payment-type-resolver.service';

describe('PaymentTypeResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaymentTypeResolverService]
    });
  });

  it('should be created', inject([PaymentTypeResolverService], (service: PaymentTypeResolverService) => {
    expect(service).toBeTruthy();
  }));
});

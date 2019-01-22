import { TestBed, inject } from '@angular/core/testing';

import { DeliveryResolverService } from './delivery-resolver.service';

describe('DeliveryResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeliveryResolverService]
    });
  });

  it('should be created', inject([DeliveryResolverService], (service: DeliveryResolverService) => {
    expect(service).toBeTruthy();
  }));
});

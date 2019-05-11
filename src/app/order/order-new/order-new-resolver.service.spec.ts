import { TestBed, inject } from '@angular/core/testing';

import { OrderNewResolverService } from './order-new-resolver.service';

describe('OrderNewResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderNewResolverService]
    });
  });

  it('should be created', inject([OrderNewResolverService], (service: OrderNewResolverService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { OrderResolverService } from './order-resolver.service';

describe('OrderResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderResolverService = TestBed.inject(OrderResolverService);
    expect(service).toBeTruthy();
  });
});

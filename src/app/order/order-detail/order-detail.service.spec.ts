import { TestBed } from '@angular/core/testing';

import { OrderDetailService } from './order-detail.service';

describe('OrderDetailService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrderDetailService = TestBed.inject(OrderDetailService);
    expect(service).toBeTruthy();
  });
});

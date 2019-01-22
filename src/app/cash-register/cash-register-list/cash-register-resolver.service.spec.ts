import { TestBed, inject } from '@angular/core/testing';

import { CashRegisterResolverService } from './cash-register-resolver.service';

describe('CashRegisterResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashRegisterResolverService]
    });
  });

  it('should be created', inject([CashRegisterResolverService], (service: CashRegisterResolverService) => {
    expect(service).toBeTruthy();
  }));
});

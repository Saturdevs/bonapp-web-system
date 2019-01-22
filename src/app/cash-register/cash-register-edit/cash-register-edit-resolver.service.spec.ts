import { TestBed, inject } from '@angular/core/testing';

import { CashRegisterEditResolverService } from './cash-register-edit-resolver.service';

describe('CashRegisterEditResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashRegisterEditResolverService]
    });
  });

  it('should be created', inject([CashRegisterEditResolverService], (service: CashRegisterEditResolverService) => {
    expect(service).toBeTruthy();
  }));
});

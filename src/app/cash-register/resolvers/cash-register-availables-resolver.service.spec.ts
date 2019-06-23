import { TestBed, inject } from '@angular/core/testing';

import { CashRegisterAvailablesResolverService } from './cash-register-availables-resolver.service';

describe('CashRegisterAvailablesResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashRegisterAvailablesResolverService]
    });
  });

  it('should be created', inject([CashRegisterAvailablesResolverService], (service: CashRegisterAvailablesResolverService) => {
    expect(service).toBeTruthy();
  }));
});

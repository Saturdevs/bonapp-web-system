import { TestBed, inject } from '@angular/core/testing';

import { TransactionResolverService } from './transaction-resolver.service';

describe('TransactionResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionResolverService]
    });
  });

  it('should be created', inject([TransactionResolverService], (service: TransactionResolverService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { ClientWithTransactionsResolverService } from './client-with-transactions-resolver.service';

describe('ClientWithTransactionsResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientWithTransactionsResolverService]
    });
  });

  it('should be created', inject([ClientWithTransactionsResolverService], (service: ClientWithTransactionsResolverService) => {
    expect(service).toBeTruthy();
  }));
});

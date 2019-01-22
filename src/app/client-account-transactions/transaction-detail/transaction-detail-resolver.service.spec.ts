import { TestBed, inject } from '@angular/core/testing';

import { TransactionDetailResolverService } from './transaction-detail-resolver.service';

describe('TransactionDetailResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TransactionDetailResolverService]
    });
  });

  it('should be created', inject([TransactionDetailResolverService], (service: TransactionDetailResolverService) => {
    expect(service).toBeTruthy();
  }));
});

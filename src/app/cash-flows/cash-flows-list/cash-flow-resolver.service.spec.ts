import { TestBed, inject } from '@angular/core/testing';

import { CashFlowResolverService } from './cash-flow-resolver.service';

describe('CashFlowResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashFlowResolverService]
    });
  });

  it('should be created', inject([CashFlowResolverService], (service: CashFlowResolverService) => {
    expect(service).toBeTruthy();
  }));
});

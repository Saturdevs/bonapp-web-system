import { TestBed, inject } from '@angular/core/testing';

import { CashFlowEditResolverService } from './cash-flow-edit-resolver.service';

describe('CashFlowEditResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CashFlowEditResolverService]
    });
  });

  it('should be created', inject([CashFlowEditResolverService], (service: CashFlowEditResolverService) => {
    expect(service).toBeTruthy();
  }));
});

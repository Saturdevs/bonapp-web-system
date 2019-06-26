import { TestBed, inject } from '@angular/core/testing';

import { ClientCurrentAccountResolverService } from './client-current-account-resolver.service';

describe('ClientCurrentAccountResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientCurrentAccountResolverService]
    });
  });

  it('should be created', inject([ClientCurrentAccountResolverService], (service: ClientCurrentAccountResolverService) => {
    expect(service).toBeTruthy();
  }));
});

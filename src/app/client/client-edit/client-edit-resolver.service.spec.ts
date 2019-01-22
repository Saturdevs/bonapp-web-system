import { TestBed, inject } from '@angular/core/testing';

import { ClientEditResolverService } from './client-edit-resolver.service';

describe('ClientEditResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientEditResolverService]
    });
  });

  it('should be created', inject([ClientEditResolverService], (service: ClientEditResolverService) => {
    expect(service).toBeTruthy();
  }));
});

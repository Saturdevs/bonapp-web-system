import { TestBed, inject } from '@angular/core/testing';

import { SizeResolverService } from './size-resolver.service';

describe('SizeResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SizeResolverService]
    });
  });

  it('should be created', inject([SizeResolverService], (service: SizeResolverService) => {
    expect(service).toBeTruthy();
  }));
});

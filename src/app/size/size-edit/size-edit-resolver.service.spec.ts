import { TestBed, inject } from '@angular/core/testing';

import { SizeEditResolverService } from './size-edit-resolver.service';

describe('SizeEditResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SizeEditResolverService]
    });
  });

  it('should be created', inject([SizeEditResolverService], (service: SizeEditResolverService) => {
    expect(service).toBeTruthy();
  }));
});

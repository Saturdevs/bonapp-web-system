import { TestBed, inject } from '@angular/core/testing';

import { SectionEditResolverService } from './section-edit-resolver.service';

describe('SectionEditResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectionEditResolverService]
    });
  });

  it('should be created', inject([SectionEditResolverService], (service: SectionEditResolverService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { SectionListResolverService } from './section-list-resolver.service';

describe('SectionListResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SectionListResolverService]
    });
  });

  it('should be created', inject([SectionListResolverService], (service: SectionListResolverService) => {
    expect(service).toBeTruthy();
  }));
});

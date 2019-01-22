import { TestBed, inject } from '@angular/core/testing';

import { CategoryResolverService } from './category-resolver.service';

describe('CategoryResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryResolverService]
    });
  });

  it('should be created', inject([CategoryResolverService], (service: CategoryResolverService) => {
    expect(service).toBeTruthy();
  }));
});

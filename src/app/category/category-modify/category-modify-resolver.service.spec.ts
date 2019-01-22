import { TestBed, inject } from '@angular/core/testing';

import { CategoryModifyResolverService } from './category-modify-resolver.service';

describe('CategoryModifyResolverService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryModifyResolverService]
    });
  });

  it('should be created', inject([CategoryModifyResolverService], (service: CategoryModifyResolverService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';

import { CategoryHasproductResolverService } from './category-hasproduct-resolver.service';

describe('CategoryHasproductResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoryHasproductResolverService = TestBed.get(CategoryHasproductResolverService);
    expect(service).toBeTruthy();
  });
});

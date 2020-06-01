import { TestBed } from '@angular/core/testing';

import { CategoryAvailablesResolverService } from './category-availables-resolver.service';

describe('CategoryAvailablesResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategoryAvailablesResolverService = TestBed.inject(CategoryAvailablesResolverService);
    expect(service).toBeTruthy();
  });
});
